/*
  # Create Events System

  ## New Tables
  
  1. `events`
    - `id` (uuid, primary key)
    - `organizer_id` (uuid, references profiles) - Event creator
    - `title` (text) - Event name
    - `description` (text) - Event description
    - `category` (text) - Event category
    - `location` (text) - Event location
    - `event_type` (text) - online/in-person/hybrid
    - `start_date` (timestamptz) - Event start
    - `end_date` (timestamptz) - Event end
    - `max_attendees` (integer) - Max capacity
    - `current_attendees` (integer) - Current enrollment count
    - `badge_id` (uuid, references badges) - Badge to issue
    - `image_url` (text) - Event cover image
    - `status` (text) - draft/published/ongoing/completed/cancelled
    - `is_featured` (boolean)
    - `created_at` (timestamptz)
    
  2. `event_enrollments`
    - `id` (uuid, primary key)
    - `event_id` (uuid, references events)
    - `user_id` (uuid, references profiles)
    - `enrolled_at` (timestamptz)
    - `status` (text) - enrolled/attended/completed/cancelled
    - `checked_in_at` (timestamptz)
    - `badge_issued` (boolean)
    
  3. `organizer_profiles`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles)
    - `organization_name` (text)
    - `organization_type` (text)
    - `verified_organizer` (boolean)
    - `total_events` (integer)
    - `total_attendees` (integer)
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can view all published events
  - Only organizers can create/edit their events
  - Users can enroll in events
  - Organizers can manage their event enrollments
*/

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('technology', 'business', 'design', 'data', 'marketing', 'other')),
  location text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('online', 'in-person', 'hybrid')) DEFAULT 'online',
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  max_attendees integer DEFAULT 100,
  current_attendees integer DEFAULT 0,
  badge_id uuid REFERENCES badges(id) ON DELETE SET NULL,
  image_url text DEFAULT 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
  status text NOT NULL CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')) DEFAULT 'published',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published events"
  ON events FOR SELECT
  TO authenticated, anon
  USING (status = 'published' OR status = 'ongoing' OR status = 'completed');

CREATE POLICY "Organizers can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- Event enrollments table
CREATE TABLE IF NOT EXISTS event_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  status text NOT NULL CHECK (status IN ('enrolled', 'attended', 'completed', 'cancelled')) DEFAULT 'enrolled',
  checked_in_at timestamptz,
  badge_issued boolean DEFAULT false,
  UNIQUE(event_id, user_id)
);

ALTER TABLE event_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
  ON event_enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Organizers can view event enrollments"
  ON event_enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_enrollments.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can enroll in events"
  ON event_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel enrollment"
  ON event_enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'enrolled')
  WITH CHECK (status = 'cancelled');

CREATE POLICY "Organizers can update enrollment status"
  ON event_enrollments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_enrollments.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Organizer profiles table
CREATE TABLE IF NOT EXISTS organizer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  organization_name text NOT NULL,
  organization_type text NOT NULL CHECK (organization_type IN ('company', 'university', 'nonprofit', 'community', 'individual')),
  verified_organizer boolean DEFAULT false,
  total_events integer DEFAULT 0,
  total_attendees integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE organizer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view organizer profiles"
  ON organizer_profiles FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create own organizer profile"
  ON organizer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own organizer profile"
  ON organizer_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update event attendee count
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'enrolled' THEN
    UPDATE events
    SET current_attendees = current_attendees + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'enrolled' AND NEW.status = 'cancelled' THEN
      UPDATE events
      SET current_attendees = current_attendees - 1
      WHERE id = NEW.event_id;
    ELSIF OLD.status = 'cancelled' AND NEW.status = 'enrolled' THEN
      UPDATE events
      SET current_attendees = current_attendees + 1
      WHERE id = NEW.event_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_event_count_on_enrollment
AFTER INSERT OR UPDATE ON event_enrollments
FOR EACH ROW
EXECUTE FUNCTION update_event_attendee_count();

-- Function to update organizer stats
CREATE OR REPLACE FUNCTION update_organizer_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE organizer_profiles
    SET total_events = total_events + 1
    WHERE user_id = NEW.organizer_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_organizer_event_count
AFTER INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION update_organizer_stats();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_enrollments_event_id ON event_enrollments(event_id);
CREATE INDEX IF NOT EXISTS idx_event_enrollments_user_id ON event_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_organizer_profiles_user_id ON organizer_profiles(user_id);

-- Insert sample events
DO $$
DECLARE
  sample_user_id uuid;
  react_badge_id uuid;
  aws_badge_id uuid;
  design_badge_id uuid;
BEGIN
  -- Get a sample user (or create one if needed)
  SELECT id INTO sample_user_id FROM profiles LIMIT 1;
  
  -- Get badge IDs
  SELECT id INTO react_badge_id FROM badges WHERE name LIKE '%React%' LIMIT 1;
  SELECT id INTO aws_badge_id FROM badges WHERE name LIKE '%AWS%' LIMIT 1;
  SELECT id INTO design_badge_id FROM badges WHERE name LIKE '%Design%' LIMIT 1;
  
  IF sample_user_id IS NOT NULL THEN
    -- Create organizer profile for sample user
    INSERT INTO organizer_profiles (user_id, organization_name, organization_type, verified_organizer)
    VALUES (sample_user_id, 'Tech Events Global', 'company', true)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Insert sample events
    INSERT INTO events (organizer_id, title, description, category, location, event_type, start_date, end_date, badge_id, max_attendees, image_url, status) VALUES
      (sample_user_id, 'React Advanced Workshop', 'Deep dive into advanced React patterns, hooks, and performance optimization. Build production-ready applications with modern best practices.', 'technology', 'San Francisco, CA', 'hybrid', now() + interval '7 days', now() + interval '8 days', react_badge_id, 100, 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800', 'published'),
      (sample_user_id, 'AWS Cloud Architecture Summit', 'Learn cloud infrastructure design from AWS certified architects. Hands-on labs with EC2, S3, Lambda, and more.', 'technology', 'Online', 'online', now() + interval '14 days', now() + interval '15 days', aws_badge_id, 200, 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800', 'published'),
      (sample_user_id, 'UI/UX Design Masterclass', 'Master the principles of user-centered design. Create beautiful, functional interfaces that users love.', 'design', 'New York, NY', 'in-person', now() + interval '21 days', now() + interval '22 days', design_badge_id, 50, 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', 'published'),
      (sample_user_id, 'Startup Pitch Competition', 'Present your startup idea to top investors. Winners get funding and mentorship from industry leaders.', 'business', 'Online', 'online', now() + interval '30 days', now() + interval '30 days', NULL, 150, 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800', 'published'),
      (sample_user_id, 'Data Science Bootcamp', 'Intensive 2-day bootcamp covering Python, ML algorithms, and real-world data projects.', 'data', 'Boston, MA', 'hybrid', now() + interval '45 days', now() + interval '47 days', NULL, 80, 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800', 'published'),
      (sample_user_id, 'Digital Marketing Conference 2025', 'The biggest digital marketing event of the year. Network with 1000+ marketers and learn cutting-edge strategies.', 'marketing', 'Los Angeles, CA', 'in-person', now() + interval '60 days', now() + interval '63 days', NULL, 500, 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800', 'published')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
