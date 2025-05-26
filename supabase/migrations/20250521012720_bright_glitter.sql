/*
  # Corrección de permisos RLS para actualización de estudiantes
  
  1. Cambios
    - Elimina todas las políticas existentes de actualización para estudiantes
    - Crea una nueva política extremadamente permisiva para actualizaciones
    
  2. Seguridad
    - Mantiene el requisito de autenticación
    - Permite todas las actualizaciones de estudiantes para usuarios autenticados
*/

-- Eliminar políticas existentes específicas de actualización para evitar conflictos
DROP POLICY IF EXISTS "Allow all update" ON students;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar estudiantes" ON students;
DROP POLICY IF EXISTS "Users can update students" ON students;

-- Crear política nueva y simplificada para actualizar estudiantes
CREATE POLICY "Super permissive update policy" ON students
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Verificar que los permisos estén correctamente configurados
GRANT ALL ON students TO authenticated;