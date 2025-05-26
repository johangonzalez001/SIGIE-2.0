/*
  # Implementar relación muchos a muchos entre cursos y asignaturas
  
  1. Cambios:
    - Reestructurar la tabla subjects para eliminar el campo credits
    - Asegurar que cada asignatura tenga un profesor asignado (teacher_id)
    - Crear tabla de unión course_subjects para la relación muchos a muchos
    - Actualizar RLS políticas para las nuevas tablas
    
  2. Detalles:
    - Una asignatura puede estar en múltiples cursos
    - Un curso puede tener múltiples asignaturas
    - Cada asignatura tiene un profesor específico
    - Pueden existir múltiples instancias de la misma asignatura con distintos profesores
*/

-- Primero verificar si la tabla subjects ya existe
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'subjects') THEN
    -- La tabla existe, modifiquemos su estructura
    
    -- Eliminar campo credits si existe
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name = 'subjects' AND column_name = 'credits') THEN
      ALTER TABLE subjects DROP COLUMN credits;
    END IF;
    
    -- Asegurar que teacher_id referencia a la tabla teachers
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name = 'subjects' AND column_name = 'teacher_id') THEN
      -- Existe pero posiblemente con otro nombre, renombrarlo
      ALTER TABLE subjects RENAME COLUMN teacher_id TO old_teacher_id;
      ALTER TABLE subjects ADD COLUMN teacher_id INTEGER REFERENCES teachers(id);
      
      -- Intentar migrar datos si hay valores en la columna antigua
      UPDATE subjects 
      SET teacher_id = old_teacher_id::integer 
      WHERE old_teacher_id IS NOT NULL;
      
      -- Eliminar columna antigua
      ALTER TABLE subjects DROP COLUMN old_teacher_id;
    ELSE
      -- No existe, agregarlo
      ALTER TABLE subjects ADD COLUMN teacher_id INTEGER REFERENCES teachers(id);
    END IF;
    
  ELSE
    -- La tabla no existe, crearla desde cero
    CREATE TABLE subjects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      teacher_id INTEGER REFERENCES teachers(id) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ DEFAULT NULL
    );
    
    -- Trigger para updated_at
    CREATE TRIGGER subjects_updated_at
      BEFORE UPDATE ON subjects
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- Ahora crear la tabla de unión entre cursos y asignaturas
CREATE TABLE IF NOT EXISTS course_subjects (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id),
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Restricción única para evitar duplicados
  UNIQUE(course_id, subject_id)
);

-- Habilitar RLS en las tablas
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_subjects ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS para subjects
DROP POLICY IF EXISTS "Users can view subjects" ON subjects;
CREATE POLICY "Users can view subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can create subjects" ON subjects;
CREATE POLICY "Users can create subjects"
  ON subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update subjects" ON subjects;
CREATE POLICY "Users can update subjects"
  ON subjects
  FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete subjects" ON subjects;
CREATE POLICY "Users can delete subjects"
  ON subjects
  FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL)
  WITH CHECK (deleted_at IS NULL);

-- Crear políticas RLS para course_subjects
CREATE POLICY "Users can view course_subjects"
  ON course_subjects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create course_subjects"
  ON course_subjects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete course_subjects"
  ON course_subjects
  FOR DELETE
  TO authenticated
  USING (true);

-- Asegurar que los permisos están correctamente configurados
GRANT ALL ON subjects TO authenticated;
GRANT USAGE ON SEQUENCE subjects_id_seq TO authenticated;
GRANT ALL ON course_subjects TO authenticated;
GRANT USAGE ON SEQUENCE course_subjects_id_seq TO authenticated;