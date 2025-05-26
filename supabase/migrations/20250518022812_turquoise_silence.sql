/*
  # Update students table RLS policies

  1. Changes
    - Remove existing UPDATE policy
    - Add new UPDATE policy that allows authenticated users to update students that aren't deleted
  
  2. Security
    - Maintains RLS enabled on students table
    - Updates policy to allow authenticated users to update active students
    - Preserves existing policies for INSERT, SELECT, and DELETE operations
*/

-- Drop the existing update policy
DROP POLICY IF EXISTS "Users can update students" ON students;

-- Create new update policy that allows authenticated users to update active students
CREATE POLICY "Users can update students"
ON students
FOR UPDATE
TO authenticated
USING (deleted_at IS NULL)
WITH CHECK (deleted_at IS NULL);