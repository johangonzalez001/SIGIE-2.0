/*
  # Fix students RLS policies

  1. Changes
    - Update the RLS policy for UPDATE operations on students table
    - Allow updates when either:
      a) The student is not deleted (deleted_at IS NULL)
      b) We're marking a student as 'Retirado' (which requires setting deleted_at)

  2. Security
    - Maintains RLS enabled on students table
    - Updates policy to handle the 'Retirado' status case properly
*/

-- Drop the existing update policy
DROP POLICY IF EXISTS "Users can update students" ON students;

-- Create new update policy with fixed conditions
CREATE POLICY "Users can update students"
ON students
FOR UPDATE
TO authenticated
USING (
  -- Allow updates on active students (not deleted)
  deleted_at IS NULL
)
WITH CHECK (
  -- Allow updates when either:
  -- 1. The student is not deleted (current state)
  -- 2. We're marking them as 'Retirado' (which requires setting deleted_at)
  (deleted_at IS NULL) OR 
  (status = 'Retirado' AND deleted_at IS NOT NULL)
);