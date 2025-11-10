-- Add unique constraint on username
-- This ensures every username is unique across the platform

-- First, handle any existing duplicate usernames (if any)
-- Add a suffix to duplicates
DO $$
DECLARE
  rec RECORD;
  counter INTEGER;
BEGIN
  FOR rec IN 
    SELECT username, COUNT(*) as count, array_agg(id) as ids
    FROM profiles
    WHERE username IS NOT NULL
    GROUP BY username
    HAVING COUNT(*) > 1
  LOOP
    counter := 1;
    FOR i IN 2..array_length(rec.ids, 1) LOOP
      UPDATE profiles
      SET username = rec.username || '_' || counter
      WHERE id = rec.ids[i];
      counter := counter + 1;
    END LOOP;
  END LOOP;
END $$;

-- Add unique constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_username_key'
  ) THEN
    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;
END $$;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON profiles (LOWER(username));

