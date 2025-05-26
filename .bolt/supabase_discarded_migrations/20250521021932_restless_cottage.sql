/*
  # Agregar más establecimientos, cursos y organizar estudiantes
  
  1. Cambios
    - Insertar más establecimientos educacionales
    - Crear nuevos cursos asignados a los establecimientos
    - Distribuir los estudiantes existentes entre los nuevos cursos
*/

-- Insertar más establecimientos educacionales
INSERT INTO schools (name, address, city, phone, email, website, director_name)
VALUES
  (
    'Liceo Manuel Barros Borgoño', 
    'San Diego 1547, Santiago', 
    'Santiago', 
    '+56 2 2556 4850', 
    'contacto@liceobarrosborgono.cl', 
    'www.liceobarrosborgono.cl', 
    'Alejandro Sánchez'
  ),
  (
    'Colegio Santa María de Santiago', 
    'Av. Departamental 4850, San Joaquín', 
    'Santiago', 
    '+56 2 2553 5208', 
    'contacto@santamariadesantiago.cl', 
    'www.santamariadesantiago.cl', 
    'Carmela Rodríguez'
  ),
  (
    'Instituto Alonso de Ercilla', 
    'Lira 363, Santiago', 
    'Santiago', 
    '+56 2 2635 4479', 
    'contacto@institutoercilla.cl', 
    'www.institutoercilla.cl', 
    'Francisco Javier Pérez'
  );

-- Crear cursos adicionales para los establecimientos
-- Para el tercer establecimiento (ID 3)
INSERT INTO courses (name, year, level, teacher_id, school_id)
VALUES
  ('1°', 2024, 'Básica', 1, 3),
  ('2°', 2024, 'Básica', 2, 3),
  ('3°', 2024, 'Básica', 3, 3),
  ('4°', 2024, 'Básica', 4, 3),
  ('I°', 2024, 'Media', 5, 3),
  ('II°', 2024, 'Media', 6, 3);

-- Para el cuarto establecimiento (ID 4)
INSERT INTO courses (name, year, level, teacher_id, school_id)
VALUES
  ('1°', 2024, 'Básica', 7, 4),
  ('2°', 2024, 'Básica', 8, 4),
  ('5°', 2024, 'Básica', 1, 4),
  ('6°', 2024, 'Básica', 2, 4),
  ('III°', 2024, 'Media', 3, 4);

-- Para el quinto establecimiento (ID 5)
INSERT INTO courses (name, year, level, teacher_id, school_id)
VALUES
  ('7°', 2024, 'Básica', 4, 5),
  ('8°', 2024, 'Básica', 5, 5),
  ('I°', 2024, 'Media', 6, 5),
  ('II°', 2024, 'Media', 7, 5),
  ('III°', 2024, 'Media', 8, 5),
  ('IV°', 2024, 'Media', 1, 5);

-- Crear más cursos para los establecimientos 1 y 2
INSERT INTO courses (name, year, level, teacher_id, school_id)
VALUES
  ('Pre-Kinder', 2024, 'Pre-Básica', 2, 1),
  ('Kinder', 2024, 'Pre-Básica', 3, 1),
  ('Pre-Kinder', 2024, 'Pre-Básica', 4, 2),
  ('Kinder', 2024, 'Pre-Básica', 5, 2);

-- Distribuir algunos estudiantes existentes en diferentes cursos
-- Esto lo hacemos para tener una mejor distribución en la demo
-- Curso de Pre-Kinder del establecimiento 1
UPDATE students
SET course_id = (
  SELECT id FROM courses 
  WHERE name = 'Pre-Kinder' AND school_id = 1
  LIMIT 1
)
WHERE id IN (11, 12) AND status = 'Activo';

-- Curso de Kinder del establecimiento 1
UPDATE students
SET course_id = (
  SELECT id FROM courses 
  WHERE name = 'Kinder' AND school_id = 1
  LIMIT 1
)
WHERE id IN (13, 14) AND status = 'Activo';

-- Curso de Pre-Kinder del establecimiento 2
UPDATE students
SET course_id = (
  SELECT id FROM courses 
  WHERE name = 'Pre-Kinder' AND school_id = 2
  LIMIT 1
)
WHERE id IN (15, 16) AND status = 'Activo';

-- Curso de Kinder del establecimiento 2
UPDATE students
SET course_id = (
  SELECT id FROM courses 
  WHERE name = 'Kinder' AND school_id = 2
  LIMIT 1
)
WHERE id IN (17, 18) AND status = 'Activo';

-- Asegurar que todos los estudiantes activos tengan un curso asignado
DO $$
DECLARE
  course_id_1 INTEGER;
  course_id_2 INTEGER;
  course_id_3 INTEGER;
BEGIN
  -- Obtener algunos IDs de cursos
  SELECT id INTO course_id_1 FROM courses WHERE school_id = 3 AND name = '1°' LIMIT 1;
  SELECT id INTO course_id_2 FROM courses WHERE school_id = 4 AND name = '5°' LIMIT 1;
  SELECT id INTO course_id_3 FROM courses WHERE school_id = 5 AND name = 'IV°' LIMIT 1;
  
  -- Asignar cursos a estudiantes que no tengan uno asignado
  UPDATE students
  SET course_id = course_id_1
  WHERE course_id IS NULL AND status = 'Activo' AND id % 3 = 0;
  
  UPDATE students
  SET course_id = course_id_2
  WHERE course_id IS NULL AND status = 'Activo' AND id % 3 = 1;
  
  UPDATE students
  SET course_id = course_id_3
  WHERE course_id IS NULL AND status = 'Activo' AND id % 3 = 2;
END
$$;