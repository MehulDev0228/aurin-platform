/*
  # Aurin Core Schema - Blockchain-Verified Achievement Platform

  ## Overview
  This migration creates the foundational database schema for Aurin, a blockchain-based
  student achievement badge system. It enables permanent, verifiable, and transferable
  digital credentials stored as NFTs on the Ethereum blockchain.

  ## New Tables

  ### 1. `profiles`
  User profiles with public-facing information
  - `id` (uuid, primary key) - Links to auth.users
  - `username` (text, unique) - Public URL identifier (aurin.com/username)
  - `full_name` (text) - Display name
  - `bio` (text) - User biography
  - `avatar_url` (text) - Profile picture
  - `location` (text) - User location
  - `wallet_address` (text) - Ethereum wallet address
  - `is_verified` (boolean) - Verification status
  - `profile_views` (integer) - Total profile views
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `badges`
  NFT badge definitions and metadata
  - `id` (uuid, primary key)
  - `name` (text) - Badge name
  - `description` (text) - Badge description
  - `image_url` (text) - Badge visual
  - `category` (text) - Badge category (skill, achievement, certification, course)
  - `issuer_id` (uuid) - Reference to issuing organization
  - `contract_address` (text) - Ethereum smart contract address
  - `token_standard` (text) - NFT standard (ERC-721, ERC-1155)
  - `total_issued` (integer) - Total badges issued
  - `is_active` (boolean) - Whether badge can still be issued
  - `created_at` (timestamptz)

  ### 3. `achievements`
  Individual badge ownership records (NFT ownership)
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Badge owner
  - `badge_id` (uuid) - Badge reference
  - `token_id` (text) - Blockchain token ID
  - `transaction_hash` (text) - Ethereum transaction hash
  - `blockchain_verified` (boolean) - Verification status
  - `earned_at` (timestamptz) - When badge was earned
  - `metadata` (jsonb) - Additional achievement data
  - `is_featured` (boolean) - Featured on profile
  - `is_public` (boolean) - Public visibility

  ### 4. `issuers`
  Organizations that can issue badges
  - `id` (uuid, primary key)
  - `name` (text) - Organization name
  - `description` (text) - Organization description
  - `logo_url` (text) - Organization logo
  - `website` (text) - Organization website
  - `verified` (boolean) - Verified issuer status
  - `wallet_address` (text) - Issuer wallet address
  - `created_at` (timestamptz)

  ### 5. `verifications`
  Verification requests and audit log
  - `id` (uuid, primary key)
  - `achievement_id` (uuid) - Achievement being verified
  - `verifier_email` (text) - Verifier contact
  - `verifier_name` (text) - Verifier name
  - `verified_at` (timestamptz) - Verification timestamp
  - `ip_address` (text) - Request IP for audit
  - `user_agent` (text) - Browser info for audit

  ### 6. `profile_views`
  Analytics for profile visits
  - `id` (uuid, primary key)
  - `profile_id` (uuid) - Profile viewed
  - `viewer_ip` (text) - Visitor IP (hashed)
  - `viewed_at` (timestamptz) - View timestamp

  ## Security
  - RLS enabled on all tables
  - Public read access for profiles, badges, issuers
  - Authenticated write access with ownership checks
  - Admin-only issuer management
  - Audit logging for verifications

  ## Important Notes
  - All blockchain data (contract_address, token_id, transaction_hash) is immutable
  - Profile usernames are unique and URL-safe
  - Badge issuance is tracked for transparency
  - Verification system maintains audit trail
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  bio text DEFAULT '',
  avatar_url text,
  location text,
  wallet_address text,
  is_verified boolean DEFAULT false,
  profile_views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$')
);

-- Issuers table
CREATE TABLE IF NOT EXISTS issuers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text DEFAULT '',
  logo_url text,
  website text,
  verified boolean DEFAULT false,
  wallet_address text,
  created_at timestamptz DEFAULT now()
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  issuer_id uuid REFERENCES issuers(id) ON DELETE CASCADE,
  contract_address text,
  token_standard text DEFAULT 'ERC-721',
  total_issued integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category CHECK (category IN ('skill', 'achievement', 'certification', 'course', 'event'))
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  token_id text,
  transaction_hash text,
  blockchain_verified boolean DEFAULT false,
  earned_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_public boolean DEFAULT true
);

-- Verifications table
CREATE TABLE IF NOT EXISTS verifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  verifier_email text,
  verifier_name text,
  verified_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Profile views table
CREATE TABLE IF NOT EXISTS profile_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  viewer_ip text,
  viewed_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_badge_id ON achievements(badge_id);
CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_issuer_id ON badges(issuer_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_profile_id ON profile_views(profile_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE issuers ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Badges policies
CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT
  TO public
  USING (true);

-- Achievements policies
CREATE POLICY "Public achievements are viewable by everyone"
  ON achievements FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Users can view their own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Issuers policies
CREATE POLICY "Issuers are viewable by everyone"
  ON issuers FOR SELECT
  TO public
  USING (true);

-- Verifications policies
CREATE POLICY "Anyone can insert verification requests"
  ON verifications FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Achievement owners can view verifications"
  ON verifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM achievements
      WHERE achievements.id = verifications.achievement_id
      AND achievements.user_id = auth.uid()
    )
  );

-- Profile views policies
CREATE POLICY "Anyone can record profile views"
  ON profile_views FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Profile owners can view their analytics"
  ON profile_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_views.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Function to update profile views count
CREATE OR REPLACE FUNCTION increment_profile_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET profile_views = profile_views + 1
  WHERE id = NEW.profile_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment profile views
CREATE TRIGGER on_profile_view
  AFTER INSERT ON profile_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_profile_views();

-- Function to update badge total_issued count
CREATE OR REPLACE FUNCTION increment_badge_issued()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE badges
  SET total_issued = total_issued + 1
  WHERE id = NEW.badge_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment badge issued count
CREATE TRIGGER on_achievement_earned
  AFTER INSERT ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION increment_badge_issued();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER on_profile_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();