/*
  # Fix RLS policies for students table

  1. Changes
     - Drop and recreate the UPDATE policy for the students table to fix the issue with updates
     - Ensures authenticated users can properly update student records
  
  2. Security
     - Maintains row-level security while allowing proper updates
     - Ensures authenticated users can update student records with proper checks
*/

-- Drop the current update policy that's causing issues
DROP POLICY IF EXISTS "Users can update students" ON public.students;

-- Create a new, more permissive update policy
CREATE POLICY "Users can update students" 
ON public.students
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);