/*
  # Create students table

  1. New Tables
    - `students`
      - `id` (serial, primary key)
      - `rut` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `birth_date` (date)
      - `gender` (text)
      - `address` (text)
      - `phone` (text)
      - `email` (text, unique)
      - `active` (boolean)
  
  2. Security
    - Enable RLS on `students` table
    - Add policies for authenticated users to perform CRUD operations
*/

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  rut TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view students"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create students"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update students"
  ON students
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete students"
  ON students
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();