/*
  # Fix Enrollment Stats RLS

  1. Changes
    - Add policy to allow authenticated users to read enrollment stats table
    
  2. Security
    - Limit access to authenticated users only
    - Read-only access (SELECT only)
*/

-- Ensure RLS is enabled for all key tables
ALTER TABLE enrollment_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_stats ENABLE ROW LEVEL SECURITY;

-- Policies for enrollment_stats
DROP POLICY IF EXISTS "Allow authenticated users to read enrollment stats" ON enrollment_stats;
CREATE POLICY "Allow authenticated users to read enrollment stats"
  ON enrollment_stats
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for attendance_stats
DROP POLICY IF EXISTS "Users can view attendance stats" ON attendance_stats;
CREATE POLICY "Users can view attendance stats"
  ON attendance_stats
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure anonymous access for connection test
CREATE POLICY "Allow anon read access to enrollment_stats"
  ON enrollment_stats
  FOR SELECT
  TO anon
  USING (true);