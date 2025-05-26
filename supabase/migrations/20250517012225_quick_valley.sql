/*
  # Add test data for teachers and courses

  1. Changes
    - Insert sample teacher records with realistic Chilean data
    - Insert sample course records following Chilean education system structure
    - Link courses with teachers as "profesores jefe" (homeroom teachers)
*/

-- Insert test data for teachers
INSERT INTO teachers (rut, first_name, last_name, email, active) 
VALUES
  ('15456789-0', 'María', 'González Soto', 'maria.gonzalez@colegio.cl', true),
  ('12345678-9', 'Juan', 'Pérez Muñoz', 'juan.perez@colegio.cl', true),
  ('14567890-1', 'Ana', 'Martínez Silva', 'ana.martinez@colegio.cl', true),
  ('13678901-2', 'Carlos', 'Rodríguez López', 'carlos.rodriguez@colegio.cl', true),
  ('16789012-3', 'Patricia', 'Sánchez Vera', 'patricia.sanchez@colegio.cl', true),
  ('11890123-4', 'Roberto', 'Fernández Díaz', 'roberto.fernandez@colegio.cl', true),
  ('17901234-5', 'Carmen', 'Torres Pinto', 'carmen.torres@colegio.cl', true),
  ('14012345-6', 'Diego', 'Castro Ruiz', 'diego.castro@colegio.cl', true);

-- Insert test data for courses
-- Following Chilean education system: 1° Básico to 8° Básico, I° Medio to IV° Medio
INSERT INTO courses (name, year, level, teacher_id, active)
VALUES
  -- Básica
  ('1°', 2024, 'Básica', 1, true),
  ('2°', 2024, 'Básica', 2, true),
  ('3°', 2024, 'Básica', 3, true),
  ('4°', 2024, 'Básica', 4, true),
  ('5°', 2024, 'Básica', 5, true),
  ('6°', 2024, 'Básica', 6, true),
  ('7°', 2024, 'Básica', 7, true),
  ('8°', 2024, 'Básica', 8, true),
  
  -- Media
  ('I°', 2024, 'Media', 1, true),
  ('II°', 2024, 'Media', 2, true),
  ('III°', 2024, 'Media', 3, true),
  ('IV°', 2024, 'Media', 4, true);

-- Update some existing students to assign them to courses
UPDATE students
SET course_id = (
  SELECT id FROM courses 
  WHERE name = '8°' 
  AND year = 2024 
  AND level = 'Básica'
  LIMIT 1
)
WHERE id IN (1, 2, 3);

UPDATE students
SET course_id = (
  SELECT id FROM courses 
  WHERE name = 'I°' 
  AND year = 2024 
  AND level = 'Media'
  LIMIT 1
)
WHERE id IN (4, 5, 6);

UPDATE students
SET course_id = (
  SELECT id FROM courses 
  WHERE name = 'II°' 
  AND year = 2024 
  AND level = 'Media'
  LIMIT 1
)
WHERE id IN (7, 8, 9, 10);