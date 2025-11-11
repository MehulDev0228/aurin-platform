-- Add event verification system
-- Events must be verified by admin before badges can be issued

-- Add event_verified column to events table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS event_verified boolean DEFAULT false;

-- Update RLS policy to hide unverified events from public
DROP POLICY IF EXISTS "Anyone can view published events" ON events;

CREATE POLICY "Anyone can view published and verified events"
  ON events FOR SELECT
  TO authenticated, anon
  USING (
    (status = 'published' OR status = 'ongoing' OR status = 'completed')
    AND event_verified = true
  );

-- Organizers can view their own events (even if unverified)
CREATE POLICY "Organizers can view own events"
  ON events FOR SELECT
  TO authenticated
  USING (auth.uid() = organizer_id);

-- Admins can view all events
CREATE POLICY "Admins can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_events_event_verified ON events(event_verified);

-- Comment
COMMENT ON COLUMN events.event_verified IS 'Admin verification status. Only verified events can have badges issued.';

