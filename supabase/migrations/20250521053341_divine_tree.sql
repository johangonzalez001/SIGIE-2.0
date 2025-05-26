/*
  # Corregir relación entre cursos y escuelas

  1. Cambios
    - Verificar si existe la tabla schools y crearla si es necesario
    - Verificar si existe la columna school_id en la tabla courses y crearla si no existe
    - Establecer la restricción de clave foránea entre courses y schools
    - Insertar datos de ejemplo si es necesario

  2. Seguridad
    - Configurar permisos para usuarios autenticados
*/

-- Primero verificamos si la tabla schools existe y tiene la estructura correcta
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'schools'
  ) THEN
    -- Crear la tabla schools si no existe
    CREATE TABLE schools (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      director_name TEXT,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ DEFAULT NULL
    );
    
    -- Habilitar RLS
    ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
    
    -- Políticas básicas
    CREATE POLICY "Allow authenticated users to read schools"
      ON schools FOR SELECT TO authenticated
      USING (deleted_at IS NULL);
  END IF;
END $$;

-- Verificar y agregar la columna school_id a la tabla courses si no existe
DO $$ 
BEGIN
  -- Verificar si existe la columna school_id en la tabla courses
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'school_id'
  ) THEN
    -- Agregar la columna si no existe
    ALTER TABLE courses ADD COLUMN school_id INTEGER;
  END IF;
END $$;

-- Verificar y corregir la relación entre courses y schools
DO $$ 
BEGIN
  -- Eliminar la restricción foreign key si existe
  IF EXISTS (
    SELECT FROM information_schema.table_constraints 
    WHERE constraint_name = 'courses_school_id_fkey'
  ) THEN
    ALTER TABLE courses DROP CONSTRAINT courses_school_id_fkey;
  END IF;
  
  -- Agregar la restricción correcta
  IF NOT EXISTS (
    SELECT FROM information_schema.table_constraints 
    WHERE constraint_name = 'courses_school_id_fkey'
  ) THEN
    ALTER TABLE courses
    ADD CONSTRAINT courses_school_id_fkey
    FOREIGN KEY (school_id) REFERENCES schools(id);
  END IF;
END $$;

-- Insertar datos de prueba en schools si está vacía
INSERT INTO schools (name, address, city, director_name)
SELECT 'Colegio de Muestra', 'Av. Principal 123', 'Santiago', 'Director de Prueba'
WHERE NOT EXISTS (SELECT 1 FROM schools LIMIT 1);

-- Asignar escuela a cursos que no tengan una asignada
UPDATE courses 
SET school_id = (SELECT id FROM schools ORDER BY id LIMIT 1)
WHERE school_id IS NULL;

-- Asegurar que los permisos están correctamente configurados
GRANT ALL ON schools TO authenticated;
GRANT USAGE ON SEQUENCE schools_id_seq TO authenticated;
GRANT ALL ON courses TO authenticated;
GRANT USAGE ON SEQUENCE courses_id_seq TO authenticated;

-- Refrescar el esquema
ANALYZE schools;
ANALYZE courses;