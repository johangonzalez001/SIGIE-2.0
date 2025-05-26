/*
  # Fix Students RLS Policies

  1. Changes
    - Remove the `deleted_at IS NULL` condition from the UPDATE policy
    - This allows authenticated users to update student records regardless of their deleted status
    
  2. Security
    - Maintains authentication requirement
    - Still restricts access to authenticated users only
    - Allows soft deletion through status updates
*/

BEGIN;

-- Drop the existing update policies
DROP POLICY IF EXISTS "Users can update students" ON students;
DROP POLICY IF EXISTS "Users can soft delete students" ON students;

-- Create a new, more permissive update policy
CREATE POLICY "Users can update students"
ON public.students
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

COMMIT;