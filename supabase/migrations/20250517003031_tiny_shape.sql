/*
  # Add soft delete policy for students table

  1. Changes
    - Add RLS policy to allow authenticated users to soft delete students
    - Ensure the policy works with the soft_delete_student RPC function

  2. Security
    - Only authenticated users can soft delete students
    - Maintains existing RLS policies
*/

-- Add policy for soft delete operation
CREATE POLICY "Users can soft delete students"
ON public.students
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure the soft_delete_student function exists and has proper permissions
CREATE OR REPLACE FUNCTION public.soft_delete_student(student_id integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.students
  SET deleted_at = NOW()
  WHERE id = student_id
  AND deleted_at IS NULL;
END;
$$;