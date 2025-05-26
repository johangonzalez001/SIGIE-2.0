/*
  # Fix courses-schools relationship

  1. Changes
    - Ensure proper foreign key relationship between courses and schools
    - Temporarily drop existing foreign key if it exists
    - Recreate foreign key with explicit naming
    - Ensure school_id references schools(id) correctly
*/

-- First, drop the existing foreign key if it exists
DO $$ 
BEGIN
  -- Check if the foreign key constraint exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY' 
    AND table_name = 'courses'
    AND constraint_name LIKE '%school_id%'
  ) THEN
    -- Drop the constraint
    EXECUTE (
      SELECT 'ALTER TABLE courses DROP CONSTRAINT ' || constraint_name
      FROM information_schema.table_constraints
      WHERE constraint_type = 'FOREIGN KEY' 
      AND table_name = 'courses'
      AND constraint_name LIKE '%school_id%'
      LIMIT 1
    );
  END IF;
END $$;

-- Recreate the foreign key with an explicit name
ALTER TABLE courses
DROP CONSTRAINT IF EXISTS courses_school_id_fkey,
ADD CONSTRAINT courses_school_id_fkey 
FOREIGN KEY (school_id) 
REFERENCES schools(id);

-- Make sure all existing courses have a valid school_id
UPDATE courses 
SET school_id = (SELECT id FROM schools LIMIT 1)
WHERE school_id IS NULL;