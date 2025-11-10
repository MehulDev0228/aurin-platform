/*
  # Add Email Verification and Wallet Connection

  ## Updates
  1. Add email verification tracking
  2. Ensure wallet_address exists
  3. Add profile completion stages
  4. Add blockchain verification tracking
  
  ## New Fields
  - `email_verified` - Email verification status
  - `wallet_connected` - Wallet connection status
  - `profile_complete` - All steps done
  - `blockchain_address` - User's blockchain wallet address
*/

-- Add email verification and wallet fields to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email_verified boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'wallet_connected'
  ) THEN
    ALTER TABLE profiles ADD COLUMN wallet_connected boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_complete'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_complete boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'blockchain_address'
  ) THEN
    ALTER TABLE profiles ADD COLUMN blockchain_address text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

-- Update achievements table for blockchain data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'nft_minted'
  ) THEN
    ALTER TABLE achievements ADD COLUMN nft_minted boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'mint_transaction_hash'
  ) THEN
    ALTER TABLE achievements ADD COLUMN mint_transaction_hash text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'achievements' AND column_name = 'blockchain_network'
  ) THEN
    ALTER TABLE achievements ADD COLUMN blockchain_network text DEFAULT 'base';
  END IF;
END $$;

-- Create wallet connection tracking table
CREATE TABLE IF NOT EXISTS wallet_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  wallet_type text NOT NULL CHECK (wallet_type IN ('metamask', 'walletconnect', 'coinbase', 'privy', 'magic', 'embedded')),
  connected_at timestamptz DEFAULT now(),
  last_used_at timestamptz DEFAULT now(),
  is_primary boolean DEFAULT true,
  UNIQUE(user_id, wallet_address)
);

ALTER TABLE wallet_connections ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'wallet_connections' 
    AND policyname = 'Users can view own wallet connections'
  ) THEN
    CREATE POLICY "Users can view own wallet connections"
      ON wallet_connections FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'wallet_connections' 
    AND policyname = 'Users can add wallet connections'
  ) THEN
    CREATE POLICY "Users can add wallet connections"
      ON wallet_connections FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'wallet_connections' 
    AND policyname = 'Users can update own wallet connections'
  ) THEN
    CREATE POLICY "Users can update own wallet connections"
      ON wallet_connections FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'email_verification_tokens' 
    AND policyname = 'Users can view own verification tokens'
  ) THEN
    CREATE POLICY "Users can view own verification tokens"
      ON email_verification_tokens FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wallet_connections_user_id ON wallet_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);

-- Function to check profile completion
CREATE OR REPLACE FUNCTION check_profile_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.email_verified = true 
     AND NEW.wallet_connected = true 
     AND NEW.onboarding_completed = true THEN
    NEW.profile_complete = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profile_completion
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION check_profile_completion();
