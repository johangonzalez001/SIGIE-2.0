/*
  # Fix Students Table RLS Policies

  1. Changes
    - Simplify the UPDATE policy to only check for soft deletion
    - Remove the status check from the WITH CHECK clause as it's already enforced by the table constraint

  2. Security
    - Maintains soft delete check to prevent updating deleted records
    - Table constraint still ensures valid status values
    - Authenticated users can still only update non-deleted records
*/

-- Drop the existing update policy
DROP POLICY IF EXISTS "Users can update students" ON students;

-- Create new simplified update policy
CREATE POLICY "Users can update students"
ON students
FOR UPDATE
TO authenticated
USING (deleted_at IS NULL)
WITH CHECK (deleted_at IS NULL);