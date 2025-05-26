/*
  # Crear tabla de establecimientos y relacionarla con cursos

  1. Nuevas Tablas
    - `schools` (establecimientos educacionales)
      - `id` (serial, primary key)
      - `name` (text, nombre del establecimiento)
      - `address` (text, dirección)
      - `city` (text, ciudad)
      - `phone` (text, teléfono de contacto)
      - `email` (text, correo electrónico)
      - `website` (text, sitio web)
      - `director_name` (text, nombre del director)
      - `active` (boolean, estado activo/inactivo)
      - `created_at` (timestamptz, fecha de creación)
      - `updated_at` (timestamptz, fecha de actualización)
      - `deleted_at` (timestamptz, fecha de eliminación - soft delete)
  
  2. Cambios
    - Agregar columna `school_id` a la tabla `courses` para relacionarla con escuelas
    - Crear datos de ejemplo de escuelas
    - Actualizar cursos existentes para asignarlos a escuelas
    
  3. Relaciones
    - Un establecimiento tiene muchos cursos
    - Un curso pertenece a un establecimiento
*/

-- Crear tabla de establecimientos educacionales
CREATE TABLE IF NOT EXISTS schools (
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

-- Agregar columna school_id a la tabla courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS school_id INTEGER REFERENCES schools(id);

-- Crear función update_updated_at si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at') THEN
    CREATE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END $$;

-- Crear trigger para schools
CREATE TRIGGER schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insertar establecimientos de ejemplo
INSERT INTO schools (name, address, city, phone, email, website, director_name)
VALUES
  (
    'Colegio San Ignacio', 
    'Av. Presidente Errázuriz 3868, Las Condes', 
    'Santiago', 
    '+56 2 2207 5000', 
    'contacto@sanignacio.cl', 
    'www.sanignacio.cl', 
    'Juan Ignacio Venegas'
  ),
  (
    'Liceo Bicentenario República de Brasil', 
    'Compañía 1484, Santiago', 
    'Santiago', 
    '+56 2 2698 5467', 
    'contacto@liceobrasil.cl', 
    'www.liceobrasil.cl', 
    'María Luisa Torres'
  ),
  (
    'Colegio Alexander Fleming', 
    'Av. Fleming 7630, Las Condes', 
    'Santiago', 
    '+56 2 2242 1300', 
    'contacto@fleming.cl', 
    'www.fleming.cl', 
    'Roberto Fernández'
  ),
  (
    'Instituto Nacional', 
    'Arturo Prat 33, Santiago', 
    'Santiago', 
    '+56 2 2639 8623', 
    'contacto@institutonacional.cl', 
    'www.institutonacional.cl', 
    'Alejandro Arratia'
  ),
  (
    'Colegio Villa María Academy', 
    'Av. Presidente Errázuriz 3753, Las Condes', 
    'Santiago', 
    '+56 2 2213 5500', 
    'contacto@villamaria.cl', 
    'www.villamaria.cl', 
    'Francisca Pacheco'
  );

-- Asignar cursos existentes a las escuelas
-- Primero asignamos la mitad de los cursos a la primera escuela
UPDATE courses 
SET school_id = 1 
WHERE id IN (1, 2, 3, 4, 5, 6);

-- La otra mitad de los cursos a la segunda escuela
UPDATE courses 
SET school_id = 2 
WHERE id IN (7, 8, 9, 10, 11, 12);

-- Hacer school_id NOT NULL después de asignar valores
ALTER TABLE courses 
ALTER COLUMN school_id SET NOT NULL;

-- Asegurar que los permisos están correctamente configurados
GRANT ALL ON schools TO authenticated;
GRANT USAGE ON SEQUENCE schools_id_seq TO authenticated;