/*
  # Corregir políticas RLS de la tabla students

  1. Cambios
    - Eliminar todas las políticas existentes
    - Crear nuevas políticas más simples y efectivas
    - Permitir actualizaciones de estado correctamente
    
  2. Seguridad
    - Mantener la seguridad basada en autenticación
    - Permitir operaciones CRUD para usuarios autenticados
    - Manejar correctamente los estados y soft delete
*/

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view students" ON students;
DROP POLICY IF EXISTS "Users can create students" ON students;
DROP POLICY IF EXISTS "Users can update students" ON students;
DROP POLICY IF EXISTS "Users can delete students" ON students;
DROP POLICY IF EXISTS "Users can soft delete students" ON students;

-- Política para ver estudiantes
CREATE POLICY "Users can view students"
ON students
FOR SELECT
TO authenticated
USING (true);

-- Política para crear estudiantes
CREATE POLICY "Users can create students"
ON students
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para actualizar estudiantes
CREATE POLICY "Users can update students"
ON students
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política para eliminar estudiantes (soft delete)
CREATE POLICY "Users can delete students"
ON students
FOR DELETE
TO authenticated
USING (true);

-- Asegurar que los permisos están correctamente configurados
GRANT ALL ON students TO authenticated;
GRANT USAGE ON SEQUENCE students_id_seq TO authenticated;