-- AURIN v1 Founder-Cut Spec - Foundation Migration
-- Adds: checkins, organizer_reputation, invites, badge rarity, proofscore

-- 1. Add rarity to badges
ALTER TABLE badges
ADD COLUMN IF NOT EXISTS rarity text CHECK (rarity IN ('common', 'rare', 'legendary')) DEFAULT 'common';

-- 2. Add proofscore to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS proofscore numeric DEFAULT 0 CHECK (proofscore >= 0 AND proofscore <= 100);

-- 3. Create checkins table (LiveProof™)
CREATE TABLE IF NOT EXISTS checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url text,
  lat numeric,
  lng numeric,
  device_fingerprint text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- 4. Add liveproof_id to achievements
ALTER TABLE achievements
ADD COLUMN IF NOT EXISTS liveproof_id uuid REFERENCES checkins(id) ON DELETE SET NULL;

-- 5. Create organizer_reputation table
CREATE TABLE IF NOT EXISTS organizer_reputation (
  organizer_id uuid PRIMARY KEY REFERENCES organizer_profiles(id) ON DELETE CASCADE,
  score numeric DEFAULT 50 CHECK (score >= 0 AND score <= 100),
  issued_on_time_rate numeric DEFAULT 0 CHECK (issued_on_time_rate >= 0 AND issued_on_time_rate <= 1),
  disputes integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- 6. Create invites table
CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invitee_email text NOT NULL,
  accepted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_checkins_event_user ON checkins(event_id, user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_user_created ON checkins(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_user_created ON achievements(user_id, earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_liveproof ON achievements(liveproof_id) WHERE liveproof_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_invites_inviter ON invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invites_email ON invites(invitee_email);
CREATE INDEX IF NOT EXISTS idx_profiles_proofscore ON profiles(proofscore DESC);

-- 8. Enable RLS on new tables
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for checkins (drop if exists first)
DROP POLICY IF EXISTS "Users can insert own checkins" ON checkins;
DROP POLICY IF EXISTS "Organizers can insert checkins for their events" ON checkins;
DROP POLICY IF EXISTS "Users can view own checkins" ON checkins;
DROP POLICY IF EXISTS "Organizers can view checkins for their events" ON checkins;
DROP POLICY IF EXISTS "Admins can view all checkins" ON checkins;
DROP POLICY IF EXISTS "Admins can update checkins" ON checkins;

CREATE POLICY "Users can insert own checkins"
  ON checkins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Organizers can insert checkins for their events"
  ON checkins FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = checkins.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own checkins"
  ON checkins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Organizers can view checkins for their events"
  ON checkins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = checkins.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all checkins"
  ON checkins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update checkins"
  ON checkins FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- 10. RLS Policies for organizer_reputation (drop if exists first)
DROP POLICY IF EXISTS "Public can view organizer reputation" ON organizer_reputation;
DROP POLICY IF EXISTS "Admins can update organizer reputation" ON organizer_reputation;

CREATE POLICY "Public can view organizer reputation"
  ON organizer_reputation FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can update organizer reputation"
  ON organizer_reputation FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- 11. RLS Policies for invites (drop if exists first)
DROP POLICY IF EXISTS "Users can insert own invites" ON invites;
DROP POLICY IF EXISTS "Users can view own invites" ON invites;
DROP POLICY IF EXISTS "Admins can view all invites" ON invites;

CREATE POLICY "Users can insert own invites"
  ON invites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can view own invites"
  ON invites FOR SELECT
  TO authenticated
  USING (auth.uid() = inviter_id);

CREATE POLICY "Admins can view all invites"
  ON invites FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- 12. Function to update organizer reputation
CREATE OR REPLACE FUNCTION update_organizer_reputation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update organizer reputation when badge is issued
  INSERT INTO organizer_reputation (organizer_id, score, issued_on_time_rate, updated_at)
  SELECT 
    op.id,
    50, -- Default score
    0,  -- Default rate
    now()
  FROM organizer_profiles op
  JOIN events e ON e.organizer_id = op.user_id
  WHERE e.id = (SELECT event_id FROM event_enrollments WHERE id = NEW.id LIMIT 1)
  ON CONFLICT (organizer_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 13. Backfill existing data
UPDATE badges SET rarity = 'common' WHERE rarity IS NULL;
UPDATE profiles SET proofscore = 10 WHERE proofscore IS NULL OR proofscore = 0;

-- 14. Initialize organizer reputation for existing organizers
INSERT INTO organizer_reputation (organizer_id, score, issued_on_time_rate)
SELECT id, 60, 0.5
FROM organizer_profiles
ON CONFLICT (organizer_id) DO NOTHING;

-- 15. Comments
COMMENT ON COLUMN badges.rarity IS 'Badge rarity: common, rare, or legendary';
COMMENT ON COLUMN profiles.proofscore IS 'ProofScore (0-100) calculated from organizer rep, rarity, recency, streak';
COMMENT ON COLUMN checkins.photo_url IS 'Selfie photo URL for LiveProof verification';
COMMENT ON COLUMN checkins.lat IS 'Latitude for geo verification';
COMMENT ON COLUMN checkins.lng IS 'Longitude for geo verification';
COMMENT ON COLUMN checkins.device_fingerprint IS 'Device hash for duplicate detection';
COMMENT ON COLUMN achievements.liveproof_id IS 'Reference to checkin record for LiveProof verification';

