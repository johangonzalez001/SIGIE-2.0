/*
  # Fix students table RLS policies

  1. Changes
    - Drop the existing UPDATE policy for students table
    - Create a new UPDATE policy that properly allows authenticated users to update students
    - The new policy explicitly allows updates for authenticated users when deleted_at IS NULL

  2. Security
    - Maintains RLS on the students table
    - Ensures only non-deleted records can be updated
*/

-- Drop the existing UPDATE policy which might be too restrictive
DROP POLICY IF EXISTS "Users can update students" ON students;

-- Create a new, more specific UPDATE policy
CREATE POLICY "Users can update students" 
ON students
FOR UPDATE 
TO authenticated
USING (deleted_at IS NULL)
WITH CHECK (true);