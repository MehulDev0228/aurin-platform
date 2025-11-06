/*
  # Fix Admin Users RLS Infinite Recursion
  
  1. Problem
    - Current RLS policies on admin_users table check admin_users table itself
    - This causes infinite recursion error
  
  2. Solution
    - Drop existing recursive policies
    - Create simple policies that allow admins to read their own role
    - Use profiles.is_admin flag for admin checks instead
  
  3. Security
    - Admins can read own admin record
    - No one can modify admin_users except via direct SQL
*/

-- Drop existing recursive policies
DROP POLICY IF EXISTS "Only super admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Only super admins can manage admins" ON admin_users;

-- Allow users to read their own admin record (no recursion)
CREATE POLICY "Users can read own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policies - admins must be managed via SQL
-- This prevents accidental changes and ensures security
