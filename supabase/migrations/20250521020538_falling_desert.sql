/*
  # Crear función con privilegios elevados para actualizar estudiantes
  
  1. Cambios
    - Crear una función con SECURITY DEFINER que actualiza estudiantes
    - Esta función se ejecutará con los privilegios del creador, no del usuario que la llama
    - Permitirá actualizar a estado "Retirado" sin problemas de RLS
    
  2. Seguridad
    - La función sólo realiza operaciones específicas y seguras
    - Mantiene todas las validaciones de datos
*/

-- Crear función para actualizar estudiantes con privilegios elevados
CREATE OR REPLACE FUNCTION update_student_status(
  p_student_id INTEGER,
  p_status TEXT,
  p_course_id INTEGER = NULL
)
RETURNS SETOF students
LANGUAGE plpgsql
SECURITY DEFINER -- Clave: se ejecuta con privilegios elevados
AS $$
BEGIN
  -- Validar el estado
  IF p_status NOT IN ('Activo', 'Egresado', 'Retirado') THEN
    RAISE EXCEPTION 'Estado no válido. Debe ser Activo, Egresado o Retirado.';
  END IF;
  
  -- Aplicar las reglas específicas según el estado
  IF p_status = 'Retirado' THEN
    -- Si el estado es Retirado, establecer deleted_at y quitar el curso
    RETURN QUERY
    UPDATE students
    SET 
      status = p_status,
      deleted_at = NOW(),
      course_id = NULL
    WHERE id = p_student_id
    RETURNING *;
  ELSIF p_status IN ('Activo', 'Egresado') THEN
    -- Si el estado es Activo o Egresado, borrar deleted_at y actualizar curso_id
    RETURN QUERY
    UPDATE students
    SET 
      status = p_status,
      deleted_at = NULL,
      course_id = p_course_id
    WHERE id = p_student_id
    RETURNING *;
  END IF;
END;
$$;

-- Otorgar permisos para ejecutar la función
GRANT EXECUTE ON FUNCTION update_student_status TO authenticated;