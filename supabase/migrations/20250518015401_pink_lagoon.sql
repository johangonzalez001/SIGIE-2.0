/*
  # Fix students table RLS policies

  1. Changes
    - Update the RLS policy for UPDATE operations on students table
    - Allow authenticated users to update any non-deleted student record
    - Ensure both USING and WITH CHECK clauses are properly configured

  2. Security
    - Maintains RLS enabled on students table
    - Only allows updates on non-deleted records
    - Requires authentication
*/

DROP POLICY IF EXISTS "Users can update students" ON students;

CREATE POLICY "Users can update students"
ON public.students
FOR UPDATE TO authenticated
USING (deleted_at IS NULL)
WITH CHECK (deleted_at IS NULL);