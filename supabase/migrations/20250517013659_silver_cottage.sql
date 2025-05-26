/*
  # Update student status options

  1. Changes
    - Add status column to students table
    - Update existing records to use new status
    - Modify RLS policies to handle status
*/

-- Add status column with check constraint
ALTER TABLE students 
DROP COLUMN IF EXISTS active;

ALTER TABLE students
ADD COLUMN status TEXT NOT NULL DEFAULT 'Activo'
CHECK (status IN ('Activo', 'Egresado', 'Retirado'));

-- Update existing records
UPDATE students
SET status = 'Activo'
WHERE deleted_at IS NULL;

UPDATE students
SET status = 'Retirado'
WHERE deleted_at IS NOT NULL;