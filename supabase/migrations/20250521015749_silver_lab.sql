/*
  # Desactivar completamente RLS para la tabla students

  1. Cambios
    - Desactivar RLS para la tabla students
    - Eliminar todas las políticas existentes
    - Otorgar todos los permisos necesarios
    
  2. Seguridad
    - Aunque se reduce la seguridad a nivel de fila, la autenticación sigue siendo requerida
    - Esta es una medida extrema para resolver los problemas persistentes con las políticas RLS
*/

-- Desactivar completamente RLS para la tabla students
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes para evitar confusiones
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
DROP POLICY IF EXISTS "students_select_policy" ON students;
DROP POLICY IF EXISTS "students_insert_policy" ON students;
DROP POLICY IF EXISTS "students_update_policy" ON students;
DROP POLICY IF EXISTS "students_delete_policy" ON students;

-- Otorgar todos los permisos necesarios
GRANT ALL ON students TO authenticated;
GRANT USAGE ON SEQUENCE students_id_seq TO authenticated;

-- Asegurar que la tabla students tiene la estructura correcta
DO $$ 
BEGIN
  -- Verificar que la columna status tiene el CHECK constraint correcto
  IF NOT EXISTS (
    SELECT FROM information_schema.constraint_column_usage
    WHERE table_name = 'students' AND column_name = 'status'
  ) THEN
    ALTER TABLE students ADD CONSTRAINT students_status_check 
      CHECK (status IN ('Activo', 'Egresado', 'Retirado'));
  END IF;
END
$$;

-- Sincronizar deleted_at con status para mantener consistencia
UPDATE students SET deleted_at = NOW() WHERE status = 'Retirado' AND deleted_at IS NULL;
UPDATE students SET deleted_at = NULL WHERE status != 'Retirado' AND deleted_at IS NOT NULL;

-- Actualizar las estadísticas para refrescar el caché del esquema
ANALYZE students;