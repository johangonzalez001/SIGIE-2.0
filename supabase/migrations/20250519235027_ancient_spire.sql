/*
  # Fix students table RLS policies

  1. Changes
    - Drop existing update policy
    - Create new update policy that allows proper status transitions
    - Fix syntax to avoid NEW/OLD references
    - Maintain security while allowing proper updates

  2. Security
    - Only authenticated users can update students
    - Allow updates for active students
    - Allow updates when retiring students
    - Allow reactivating retired students
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update students" ON students;

-- Create new update policy that properly handles all status changes
CREATE POLICY "Users can update students"
ON students
FOR UPDATE
TO authenticated
USING (
  -- Allow updates on non-deleted students
  (deleted_at IS NULL)
  OR
  -- Allow updates on retired students (to enable reactivation)
  (status = 'Retirado')
)
WITH CHECK (
  -- Allow any valid status
  status IN ('Activo', 'Egresado', 'Retirado')
);