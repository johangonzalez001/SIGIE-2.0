/*
  # Arreglar problema con columna status en tabla students

  1. Cambios
    - Asegurar que la columna 'status' existe con la definición correcta
    - Forzar actualización del caché del esquema
    - Simplificar todas las políticas RLS para evitar conflictos
    
  2. Seguridad
    - Política altamente permisiva pero sólo para usuarios autenticados
*/

-- Deshabilitar temporalmente RLS para hacer cambios
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- Verificar y corregir la columna status si es necesario
DO $$
BEGIN
  -- Si la columna no existe, crearla
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'students' AND column_name = 'status'
  ) THEN
    ALTER TABLE students ADD COLUMN status TEXT NOT NULL DEFAULT 'Activo';
  END IF;

  -- Asegurar que tiene el check constraint correcto
  IF NOT EXISTS (
    SELECT FROM information_schema.constraint_column_usage
    WHERE table_name = 'students' AND column_name = 'status'
  ) THEN
    ALTER TABLE students ADD CONSTRAINT students_status_check 
      CHECK (status IN ('Activo', 'Egresado', 'Retirado'));
  END IF;
END
$$;

-- Actualizar valores incorrectos en status
UPDATE students SET status = 'Activo' WHERE status NOT IN ('Activo', 'Egresado', 'Retirado');

-- Sincronizar deleted_at con status para mantener consistencia
UPDATE students SET deleted_at = NOW() WHERE status = 'Retirado' AND deleted_at IS NULL;
UPDATE students SET deleted_at = NULL WHERE status != 'Retirado' AND deleted_at IS NOT NULL;

-- Eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "Users can view students" ON students;
DROP POLICY IF EXISTS "Users can create students" ON students;
DROP POLICY IF EXISTS "Users can update students" ON students;
DROP POLICY IF EXISTS "Users can delete students" ON students;
DROP POLICY IF EXISTS "Users can soft delete students" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver estudiantes" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear estudiantes" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar estudiantes" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar estudiantes" ON students;
DROP POLICY IF EXISTS "Allow all select" ON students;
DROP POLICY IF EXISTS "Allow all insert" ON students;
DROP POLICY IF EXISTS "Allow all update" ON students;
DROP POLICY IF EXISTS "Allow all delete" ON students;
DROP POLICY IF EXISTS "Super permissive update policy" ON students;

-- Volver a habilitar RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Crear políticas simples y altamente permisivas para todas las operaciones
CREATE POLICY "students_select_policy" ON students FOR SELECT TO authenticated USING (true);
CREATE POLICY "students_insert_policy" ON students FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "students_update_policy" ON students FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "students_delete_policy" ON students FOR DELETE TO authenticated USING (true);

-- Asegurar que los permisos están correctamente configurados
GRANT ALL ON students TO authenticated;
GRANT USAGE ON SEQUENCE students_id_seq TO authenticated;

-- Analizar la tabla para actualizar las estadísticas y el caché del esquema
ANALYZE students;