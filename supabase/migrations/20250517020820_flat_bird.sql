/*
  # Fix student-course relationship

  1. Changes
    - Ensure course_id column exists with correct name
    - Add foreign key constraint if missing
    - Update RLS policies for proper course relationship access
    - Grant necessary permissions
*/

-- First ensure the column exists with correct name
DO $$ 
BEGIN
  -- Rename column if it exists with different name
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'students' 
    AND column_name = 'courses_id'
  ) THEN
    ALTER TABLE students RENAME COLUMN courses_id TO course_id;
  END IF;

  -- Add column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'students' 
    AND column_name = 'course_id'
  ) THEN
    ALTER TABLE students ADD COLUMN course_id integer;
  END IF;
END $$;

-- Ensure foreign key constraint exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'students_course_id_fkey'
  ) THEN
    ALTER TABLE students
    ADD CONSTRAINT students_course_id_fkey
    FOREIGN KEY (course_id) REFERENCES courses(id);
  END IF;
END $$;

-- Update RLS policies to include course relationships
DROP POLICY IF EXISTS "Users can view students" ON students;
CREATE POLICY "Users can view students"
  ON students
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

-- Allow viewing course relationships
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;