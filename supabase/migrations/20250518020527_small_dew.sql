/*
  # Update students table RLS policies

  1. Changes
    - Drop existing update policy
    - Create new update policy with proper conditions
    - Ensure proper handling of status transitions
    
  2. Security
    - Maintain data integrity
    - Allow proper status transitions
    - Preserve existing security model
*/

-- Drop the existing UPDATE policy
DROP POLICY IF EXISTS "Users can update students" ON students;

-- Create new UPDATE policy with appropriate conditions
CREATE POLICY "Users can update students"
ON students
FOR UPDATE
TO authenticated
USING ((deleted_at IS NULL) OR (status = 'Retirado'))
WITH CHECK (status IN ('Activo', 'Egresado', 'Retirado'));