/*
  # Add courses and teachers tables

  1. New Tables
    - `teachers`
      - `id` (serial, primary key)
      - `rut` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `deleted_at` (timestamptz)

    - `courses`
      - `id` (serial, primary key)
      - `name` (text)
      - `year` (integer)
      - `level` (text)
      - `teacher_id` (integer, foreign key)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `deleted_at` (timestamptz)

  2. Changes
    - Add `course_id` to students table
    - Add foreign key constraints
    
  3. Security
    - Enable RLS on new tables
    - Add policies for CRUD operations
*/

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  rut TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  level TEXT NOT NULL,
  teacher_id INTEGER REFERENCES teachers(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Add course_id to students
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS course_id INTEGER REFERENCES courses(id);

-- Enable RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Policies for teachers
CREATE POLICY "Users can view teachers"
  ON teachers
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Users can create teachers"
  ON teachers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update teachers"
  ON teachers
  FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

-- Policies for courses
CREATE POLICY "Users can view courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Users can create courses"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update courses"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

-- Create updated_at triggers
CREATE TRIGGER teachers_updated_at
  BEFORE UPDATE ON teachers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();