/*
  # Corregir política RLS para estudiantes
  
  1. Cambios
    - Modificar la política de actualización para estudiantes para permitir
      actualizaciones de todos los estudiantes, incluso aquellos con estado "Retirado"
    
  2. Motivo
    - La política anterior impedía la actualización de estudiantes cuando se intentaba
      cambiar su estado a "Retirado" (soft delete)
*/

-- Eliminar la política existente
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar estudiantes" ON students;

-- Crear una nueva política más permisiva para la actualización
CREATE POLICY "Usuarios autenticados pueden actualizar estudiantes"
ON students FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);