/*
  # Add soft delete support for students table

  1. Changes
    - Add deleted_at column to students table
    - Update RLS policies to exclude soft-deleted records
    - Add function to handle soft deletes
*/

-- Add deleted_at column
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Update RLS policies to exclude soft-deleted records
DROP POLICY IF EXISTS "Users can view students" ON students;
CREATE POLICY "Users can view students"
  ON students
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

-- Create soft delete function
CREATE OR REPLACE FUNCTION soft_delete_student(student_id INT)
RETURNS VOID AS $$
BEGIN
  UPDATE students
  SET deleted_at = NOW()
  WHERE id = student_id;
END;
$$ LANGUAGE plpgsql;