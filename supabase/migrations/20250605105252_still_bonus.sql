/*
  # Fix users table RLS policies

  1. Changes
    - Add INSERT policy for users table to allow new user creation
    - Update SELECT policy to handle profile creation
  
  2. Security
    - Maintains RLS enabled on users table
    - Adds specific policy for user profile creation
    - Ensures users can only access their own data
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can create own profile" ON users;

-- Create updated policies
CREATE POLICY "Users can read own data"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can create own profile"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);