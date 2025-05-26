/*
  # Corregir permisos para eliminación de estudiantes

  1. Cambios
    - Actualizar las políticas RLS para permitir eliminar y actualizar estudiantes
    - Simplificar las condiciones para evitar problemas con el soft delete
    
  2. Seguridad
    - Mantener la autenticación como requisito para todas las operaciones
    - Permitir explícitamente las operaciones necesarias para soft delete
*/

-- Eliminar políticas existentes relacionadas con la actualización y eliminación
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar estudiantes" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar estudiantes" ON students;

-- Crear política simplificada para actualizar estudiantes (incluyendo soft delete)
CREATE POLICY "Usuarios autenticados pueden actualizar estudiantes"
ON students
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Crear política para eliminar estudiantes (aunque usamos soft delete)
CREATE POLICY "Usuarios autenticados pueden eliminar estudiantes"
ON students
FOR DELETE
TO authenticated
USING (true);

-- Confirmar que todos los permisos están correctamente configurados
GRANT ALL ON students TO authenticated;
GRANT USAGE ON SEQUENCE students_id_seq TO authenticated;