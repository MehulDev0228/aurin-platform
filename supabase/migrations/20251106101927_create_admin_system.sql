/*
  # Create Admin System

  ## New Tables
  
  1. `admin_users`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references profiles) - Admin user
    - `role` (text) - super_admin, admin, moderator
    - `permissions` (jsonb) - Detailed permissions
    - `created_at` (timestamptz)
    - `created_by` (uuid) - Who granted admin
    
  2. `admin_activity_logs`
    - `id` (uuid, primary key)
    - `admin_id` (uuid, references admin_users)
    - `action` (text) - Action performed
    - `target_type` (text) - user, event, badge, organizer
    - `target_id` (uuid) - ID of affected entity
    - `details` (jsonb) - Additional information
    - `created_at` (timestamptz)
    
  3. `platform_analytics`
    - `id` (uuid, primary key)
    - `date` (date, unique) - Analytics date
    - `total_users` (integer)
    - `new_users` (integer)
    - `total_events` (integer)
    - `total_enrollments` (integer)
    - `total_badges_issued` (integer)
    - `active_organizers` (integer)
    - `revenue` (decimal)
    - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all admin tables
  - Only super_admin can access admin tables
  - All admin actions are logged
*/

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  role text NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')) DEFAULT 'moderator',
  permissions jsonb DEFAULT '{"users": true, "events": true, "badges": true, "analytics": true}'::jsonb,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id)
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only super admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );

CREATE POLICY "Only super admins can manage admins"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );

-- Admin activity logs
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  action text NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('user', 'event', 'badge', 'organizer', 'system')),
  target_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert activity logs"
  ON admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Platform analytics table
CREATE TABLE IF NOT EXISTS platform_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE DEFAULT CURRENT_DATE,
  total_users integer DEFAULT 0,
  new_users integer DEFAULT 0,
  total_events integer DEFAULT 0,
  total_enrollments integer DEFAULT 0,
  total_badges_issued integer DEFAULT 0,
  active_organizers integer DEFAULT 0,
  revenue decimal(12,2) DEFAULT 0.00,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics"
  ON platform_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "System can update analytics"
  ON platform_analytics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = check_user_id
  );
END;
$$;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = check_user_id
    AND role = 'super_admin'
  );
END;
$$;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_user_id uuid,
  p_action text,
  p_target_type text,
  p_target_id uuid,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id uuid;
BEGIN
  SELECT id INTO v_admin_id
  FROM admin_users
  WHERE user_id = p_admin_user_id;

  IF v_admin_id IS NOT NULL THEN
    INSERT INTO admin_activity_logs (admin_id, action, target_type, target_id, details)
    VALUES (v_admin_id, p_action, p_target_type, p_target_id, p_details);
  END IF;
END;
$$;

-- Function to update daily analytics
CREATE OR REPLACE FUNCTION update_platform_analytics()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO platform_analytics (
    date,
    total_users,
    new_users,
    total_events,
    total_enrollments,
    total_badges_issued,
    active_organizers
  )
  VALUES (
    CURRENT_DATE,
    (SELECT COUNT(*) FROM profiles),
    (SELECT COUNT(*) FROM profiles WHERE DATE(created_at) = CURRENT_DATE),
    (SELECT COUNT(*) FROM events),
    (SELECT COUNT(*) FROM event_enrollments),
    (SELECT COUNT(*) FROM achievements WHERE nft_minted = true),
    (SELECT COUNT(DISTINCT organizer_id) FROM events WHERE DATE(created_at) >= CURRENT_DATE - INTERVAL '30 days')
  )
  ON CONFLICT (date) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    new_users = EXCLUDED.new_users,
    total_events = EXCLUDED.total_events,
    total_enrollments = EXCLUDED.total_enrollments,
    total_badges_issued = EXCLUDED.total_badges_issued,
    active_organizers = EXCLUDED.active_organizers,
    updated_at = now();
END;
$$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_analytics_date ON platform_analytics(date DESC);

-- Add is_admin flag to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Update profile when admin is added
CREATE OR REPLACE FUNCTION sync_admin_flag()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET is_admin = true WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET is_admin = false WHERE id = OLD.user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_admin_flag_trigger
AFTER INSERT OR DELETE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION sync_admin_flag();
