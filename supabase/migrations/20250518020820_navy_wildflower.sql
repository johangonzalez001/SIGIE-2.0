/*
  # Fix students table RLS policies

  1. Changes
    - Update the RLS policy for UPDATE operations on students table
    - Add deleted_at IS NULL check to match other policies
    - Keep existing status check

  2. Security
    - Maintains existing status validation
    - Adds soft delete check for consistency with other policies
*/

DROP POLICY IF EXISTS "Users can update students" ON students;

CREATE POLICY "Users can update students"
ON public.students
FOR UPDATE
TO authenticated
USING (deleted_at IS NULL)
WITH CHECK (
  deleted_at IS NULL AND
  status = ANY (ARRAY['Activo'::text, 'Egresado'::text, 'Retirado'::text])
);