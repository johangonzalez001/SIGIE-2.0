/*
  # Fix students table RLS policy

  1. Changes
    - Drop existing update policy
    - Create new update policy with correct conditions
    - Fix syntax to avoid NEW reference in USING clause
    - Maintain security while allowing proper updates

  2. Security
    - Only authenticated users can update students
    - Updates allowed for active students
    - Updates allowed when withdrawing students
    - Updates allowed for withdrawn students
*/

DROP POLICY IF EXISTS "Users can update students" ON students;

CREATE POLICY "Users can update students"
ON students
FOR UPDATE
TO authenticated
USING (
  deleted_at IS NULL OR 
  status = 'Retirado'
)
WITH CHECK (
  deleted_at IS NULL OR 
  status = 'Retirado'
);