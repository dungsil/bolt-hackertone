/*
  # Add description to accounts table

  1. Changes
    - Add description column to accounts table
    - Update RLS policies to include the new column
*/

-- Add description column to accounts table
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS description text;

-- Update RLS policies to include the new column
DROP POLICY IF EXISTS "Users can update own accounts" ON accounts;
CREATE POLICY "Users can update own accounts"
ON accounts
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());