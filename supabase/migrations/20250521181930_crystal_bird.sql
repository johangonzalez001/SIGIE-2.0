/*
  # Fix RLS Policies for Students Table

  1. Changes
    - Completely drop and recreate the RLS policies for the students table
    - Create a proper UPDATE policy that allows authenticated users to update student records
    - Add proper security while allowing necessary operations

  2. Security
    - RLS remains enabled for proper security
    - Only authenticated users can access students data
    - Policies are simplified to avoid complications with the UPDATE operation
*/

-- First, drop all existing policies for the students table
DROP POLICY IF EXISTS "students_select_policy" ON students;
DROP POLICY IF EXISTS "students_insert_policy" ON students;
DROP POLICY IF EXISTS "students_update_policy" ON students;
DROP POLICY IF EXISTS "students_delete_policy" ON students;
DROP POLICY IF EXISTS "Users can view students" ON students;
DROP POLICY IF EXISTS "Users can create students" ON students;
DROP POLICY IF EXISTS "Users can update students" ON students;
DROP POLICY IF EXISTS "Users can delete students" ON students;

-- Create new, simplified policies for all operations
CREATE POLICY "students_select_policy" 
ON students FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "students_insert_policy" 
ON students FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "students_update_policy" 
ON students FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "students_delete_policy" 
ON students FOR DELETE 
TO authenticated 
USING (true);

-- Ensure RLS is enabled
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON students TO authenticated;
GRANT USAGE ON SEQUENCE students_id_seq TO authenticated;