/*
  # Fix students table RLS policy

  1. Changes
    - Drop existing update policy
    - Create new update policy with proper conditions
    - Ensure status values are valid
*/

-- Drop the existing update policy
DROP POLICY IF EXISTS "Users can update students" ON students;

-- Create new update policy with proper conditions
CREATE POLICY "Users can update students"
ON students
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (
  -- Ensure status is one of the allowed values
  status = ANY (ARRAY['Activo'::text, 'Egresado'::text, 'Retirado'::text])
);