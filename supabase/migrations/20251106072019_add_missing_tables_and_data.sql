/*
  # Add Missing Tables and Sample Data

  ## New Tables
  1. `platform_stats` - Global platform statistics
  2. `user_activity` - Activity heatmap data
  
  ## Updates
  - Add sample issuers
  - Add sample badges with real data
  - Functions to calculate stats
*/

-- Platform stats table
CREATE TABLE IF NOT EXISTS platform_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_users integer DEFAULT 0,
  total_badges integer DEFAULT 0,
  total_verifications integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view platform stats"
  ON platform_stats FOR SELECT
  TO authenticated, anon
  USING (true);

-- User activity table for heatmap
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_date date NOT NULL DEFAULT CURRENT_DATE,
  activity_count integer DEFAULT 1,
  UNIQUE(user_id, activity_date)
);

ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR true);

CREATE POLICY "Users can insert own activity"
  ON user_activity FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity"
  ON user_activity FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update platform stats
CREATE OR REPLACE FUNCTION update_platform_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM platform_stats;
  
  INSERT INTO platform_stats (total_users, total_badges, total_verifications, updated_at)
  SELECT
    (SELECT COUNT(*) FROM profiles),
    (SELECT COUNT(*) FROM achievements),
    (SELECT COUNT(*) FROM verifications),
    now();
END;
$$;

-- Initialize platform stats
SELECT update_platform_stats();

-- Insert sample issuers if none exist
INSERT INTO issuers (name, description, verified) VALUES
  ('Meta Engineering', 'Meta platforms engineering team', true),
  ('Amazon Web Services', 'AWS cloud certification', true),
  ('Stanford Online', 'Stanford University online learning', true),
  ('GitHub', 'World''s leading developer platform', true),
  ('Figma Design', 'Collaborative design platform', true),
  ('Cloud Native Foundation', 'CNCF certification programs', true),
  ('Google AI', 'Google AI and ML programs', true),
  ('HashiCorp', 'Infrastructure automation tools', true)
ON CONFLICT DO NOTHING;

-- Get issuer IDs for badge creation
DO $$
DECLARE
  meta_id uuid;
  aws_id uuid;
  stanford_id uuid;
  github_id uuid;
  figma_id uuid;
  cncf_id uuid;
  google_id uuid;
  hashicorp_id uuid;
BEGIN
  SELECT id INTO meta_id FROM issuers WHERE name = 'Meta Engineering';
  SELECT id INTO aws_id FROM issuers WHERE name = 'Amazon Web Services';
  SELECT id INTO stanford_id FROM issuers WHERE name = 'Stanford Online';
  SELECT id INTO github_id FROM issuers WHERE name = 'GitHub';
  SELECT id INTO figma_id FROM issuers WHERE name = 'Figma Design';
  SELECT id INTO cncf_id FROM issuers WHERE name = 'Cloud Native Foundation';
  SELECT id INTO google_id FROM issuers WHERE name = 'Google AI';
  SELECT id INTO hashicorp_id FROM issuers WHERE name = 'HashiCorp';

  -- Insert sample badges
  INSERT INTO badges (name, description, image_url, category, issuer_id, total_issued, is_active) VALUES
    ('React Advanced Patterns', 'Master advanced React patterns and hooks', 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400', 'skill', meta_id, 15234, true),
    ('AWS Solutions Architect Pro', 'Professional level AWS certification', 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400', 'certification', aws_id, 12145, true),
    ('System Design Master', 'Advanced system design principles', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400', 'course', stanford_id, 8934, true),
    ('Open Source Contributor', 'Contributed to major open source projects', 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400', 'achievement', github_id, 23456, true),
    ('UI/UX Design Fundamentals', 'Core UI/UX design principles', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400', 'skill', figma_id, 11234, true),
    ('Kubernetes Administrator', 'Certified Kubernetes administrator', 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400', 'certification', cncf_id, 9876, true),
    ('Machine Learning Specialist', 'Advanced ML and AI techniques', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400', 'course', google_id, 7654, true),
    ('DevOps Excellence', 'DevOps best practices and tools', 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=400', 'skill', hashicorp_id, 6543, true)
  ON CONFLICT DO NOTHING;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_badge_id ON achievements(badge_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON profile_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_date ON user_activity(user_id, activity_date);
