/*
  # Fix students table RLS policies

  1. Changes
    - Update the RLS policy for updating students to handle status changes correctly
    - Allow updates when setting deleted_at for 'Retirado' status
    - Maintain security by ensuring only authenticated users can update

  2. Security
    - Maintain RLS enabled on students table
    - Update policy to handle both active and retiring students
    - Keep other policies unchanged
*/

-- Drop the existing update policy
DROP POLICY IF EXISTS "Users can update students" ON students;

-- Create new update policy that handles both active students and status changes
CREATE POLICY "Users can update students"
ON students
FOR UPDATE
TO authenticated
USING (
  -- Allow updates for active students (deleted_at IS NULL)
  (deleted_at IS NULL)
  OR
  -- Allow updates when setting status to 'Retirado' and deleted_at
  (status = 'Retirado' AND deleted_at IS NOT NULL)
)
WITH CHECK (
  -- Allow updates for active students
  (deleted_at IS NULL)
  OR
  -- Allow setting status to 'Retirado' with deleted_at
  (status = 'Retirado' AND deleted_at IS NOT NULL)
);