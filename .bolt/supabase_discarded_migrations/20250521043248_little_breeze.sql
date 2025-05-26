/*
  # Reset and fix RLS policies for all tables
  
  1. Changes
    - Reset all RLS policies to a more maintainable state
    - Enable RLS for all main tables
    - Create clean, simple RLS policies that work correctly
    
  2. Security
    - Ensure authenticated users can perform all necessary operations
    - Maintain data integrity with proper policies
*/

-- Re-enable RLS for all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Clear all existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view students" ON students;
DROP POLICY IF EXISTS "Users can create students" ON students;
DROP POLICY IF EXISTS "Users can update students" ON students;
DROP POLICY IF EXISTS "Users can delete students" ON students;
DROP POLICY IF EXISTS "Users can soft delete students" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver estudiantes" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear estudiantes" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar estudiantes" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar estudiantes" ON students;
DROP POLICY IF EXISTS "Allow all select" ON students;
DROP POLICY IF EXISTS "Allow all insert" ON students;
DROP POLICY IF EXISTS "Allow all update" ON students;
DROP POLICY IF EXISTS "Allow all delete" ON students;
DROP POLICY IF EXISTS "Super permissive update policy" ON students;
DROP POLICY IF EXISTS "students_select_policy" ON students;
DROP POLICY IF EXISTS "students_insert_policy" ON students;
DROP POLICY IF EXISTS "students_update_policy" ON students;
DROP POLICY IF EXISTS "students_delete_policy" ON students;

-- Create fresh, clean policies for students
CREATE POLICY "Users can view students"
  ON students FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update students"
  ON students FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete students"
  ON students FOR DELETE
  TO authenticated
  USING (true);

-- Update teachers table policies
DROP POLICY IF EXISTS "Users can view teachers" ON teachers;
DROP POLICY IF EXISTS "Users can create teachers" ON teachers;
DROP POLICY IF EXISTS "Users can update teachers" ON teachers;

CREATE POLICY "Users can view teachers"
  ON teachers FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Users can create teachers"
  ON teachers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update teachers"
  ON teachers FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

-- Update courses table policies
DROP POLICY IF EXISTS "Users can view courses" ON courses;
DROP POLICY IF EXISTS "Users can create courses" ON courses;
DROP POLICY IF EXISTS "Users can update courses" ON courses;

CREATE POLICY "Users can view courses"
  ON courses FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Users can create courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);