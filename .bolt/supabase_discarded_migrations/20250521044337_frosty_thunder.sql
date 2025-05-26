/*
  # Fix teachers table RLS policies
  
  1. Changes
    - Drop all existing RLS policies on teachers table
    - Create new, simplified policies
    - Grant necessary permissions

  2. Security
    - Keep security based on authentication
    - Ensure deleted_at check is functioning properly
    - Fix potential issues with circular references
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view teachers" ON teachers;
DROP POLICY IF EXISTS "Users can create teachers" ON teachers;
DROP POLICY IF EXISTS "Users can update teachers" ON teachers;
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver profesores" ON teachers;
DROP POLICY IF EXISTS "Allow anon read access to teachers" ON teachers;

-- Create new simplified policies for teachers
CREATE POLICY "teachers_select_policy" 
ON teachers FOR SELECT 
TO authenticated 
USING (deleted_at IS NULL);

CREATE POLICY "teachers_insert_policy" 
ON teachers FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "teachers_update_policy" 
ON teachers FOR UPDATE 
TO authenticated 
USING (deleted_at IS NULL) 
WITH CHECK (true);

CREATE POLICY "teachers_delete_policy" 
ON teachers FOR DELETE 
TO authenticated 
USING (deleted_at IS NULL);

-- Allow anonymous read-only access for initial connection checks
CREATE POLICY "anon_teachers_select_policy" 
ON teachers FOR SELECT 
TO anon 
USING (deleted_at IS NULL);

-- Ensure all permissions are properly granted
GRANT SELECT ON teachers TO anon;
GRANT ALL ON teachers TO authenticated;
GRANT USAGE ON SEQUENCE teachers_id_seq TO authenticated;