/*
  # Fix students table RLS policies

  1. Changes
    - Update the RLS policy for updating students to properly handle the deleted_at field
    - Ensure the WITH CHECK clause matches the USING clause for consistency

  2. Security
    - Maintains RLS enabled on students table
    - Updates policy to allow authenticated users to update non-deleted students
*/

DROP POLICY IF EXISTS "Users can update students" ON students;

CREATE POLICY "Users can update students"
ON students
FOR UPDATE
TO authenticated
USING (deleted_at IS NULL)
WITH CHECK (
  -- Allow updates only if the record is not deleted
  (deleted_at IS NULL) OR
  -- Or if we're setting deleted_at as part of the update
  (deleted_at IS NOT NULL AND status = 'Retirado')
);