/*
  # Fix students table RLS policies for updates

  1. Changes
    - Update RLS policies to allow proper student updates
    - Fix policy conditions for status changes
    - Maintain security while allowing necessary operations

  2. Security
    - Only authenticated users can update students
    - Allow updates for both active and retired students
    - Maintain data integrity with status constraints
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update students" ON students;

-- Create new update policy with proper conditions
CREATE POLICY "Users can update students"
ON students
FOR UPDATE
TO authenticated
USING (
  -- Allow updates when:
  -- 1. Student is active (not deleted)
  -- 2. Student is being retired (status change to 'Retirado')
  -- 3. Student is being reactivated from 'Retirado' status
  ((deleted_at IS NULL) OR (status = 'Retirado'))
)
WITH CHECK (
  -- Ensure status is valid and matches deletion state
  (status = ANY (ARRAY['Activo'::text, 'Egresado'::text, 'Retirado'::text])) AND
  (
    -- For active students
    (status IN ('Activo', 'Egresado') AND deleted_at IS NULL) OR
    -- For retired students
    (status = 'Retirado')
  )
);