/*
  # Agregar más establecimientos educacionales
  
  1. Cambios
    - Agregar 5 nuevos establecimientos educacionales
    - Agregar cursos para cada establecimiento nuevo
    - Agregar estudiantes de muestra para los nuevos cursos
    
  2. Estructura
    - Usar WITH para capturar los IDs de los establecimientos creados
    - Usar tablas temporales para mantener las referencias entre entidades
    - Usar consultas dinámicas para construir las relaciones
*/

-- Insertar nuevos establecimientos educacionales y capturar sus IDs
WITH inserted_schools AS (
  INSERT INTO schools (name, address, city, phone, email, website, director_name)
  VALUES
    (
      'Colegio Santa María', 
      'Av. Los Leones 1250, Providencia', 
      'Santiago', 
      '+56 2 2345 6789', 
      'contacto@santamaria.cl', 
      'www.santamaria.cl', 
      'Carmen Valenzuela Fuentes'
    ),
    (
      'Liceo José Miguel Carrera', 
      'Av. Ricardo Lyon 3256, Ñuñoa', 
      'Santiago', 
      '+56 2 2456 7890', 
      'secretaria@liceojmc.cl', 
      'www.liceojmc.cl', 
      'Rodrigo Sepúlveda Morales'
    ),
    (
      'Instituto Nacional José Miguel Carrera', 
      'Arturo Prat 33, Santiago', 
      'Santiago', 
      '+56 2 2567 8901', 
      'contacto@institutonacional.cl', 
      'www.institutonacional.cl', 
      'Fernando Soto Concha'
    ),
    (
      'Liceo Carmela Carvajal de Prat', 
      'Av. Italia 980, Providencia', 
      'Santiago', 
      '+56 2 2678 9012', 
      'secretaria@liceocarmela.cl', 
      'www.liceocarmela.cl', 
      'Macarena Rojas Alcalde'
    ),
    (
      'Colegio Santo Tomás', 
      'Av. Américo Vespucio Norte 2045, Vitacura', 
      'Santiago', 
      '+56 2 2789 0123', 
      'contacto@santotomas.edu.cl', 
      'www.santotomas.edu.cl', 
      'Alberto Fuentes Contreras'
    )
  RETURNING id, name
)
-- Guardar los IDs y nombres en una tabla temporal
SELECT id, name INTO TEMP TABLE temp_new_schools FROM inserted_schools;

-- Insertar cursos para los nuevos establecimientos
WITH inserted_courses AS (
  INSERT INTO courses (name, year, level, teacher_id, school_id, active)
  SELECT curso.name, curso.year, curso.level, curso.teacher_id, esc.id, true
  FROM (
    VALUES
      -- Formatos de cursos por colegio
      ('Colegio Santa María', '1°', 2024, 'Básica', 1),
      ('Colegio Santa María', '2°', 2024, 'Básica', 2),
      ('Colegio Santa María', '8°', 2024, 'Básica', 3),
      ('Colegio Santa María', 'I°', 2024, 'Media', 4),
      ('Colegio Santa María', 'IV°', 2024, 'Media', 5),
      
      ('Liceo José Miguel Carrera', '7°', 2024, 'Básica', 1),
      ('Liceo José Miguel Carrera', '8°', 2024, 'Básica', 2),
      ('Liceo José Miguel Carrera', 'I°', 2024, 'Media', 3),
      ('Liceo José Miguel Carrera', 'II°', 2024, 'Media', 4),
      ('Liceo José Miguel Carrera', 'III°', 2024, 'Media', 5),
      
      ('Instituto Nacional José Miguel Carrera', '7°', 2024, 'Básica', 1),
      ('Instituto Nacional José Miguel Carrera', '8°', 2024, 'Básica', 2),
      ('Instituto Nacional José Miguel Carrera', 'I°', 2024, 'Media', 3),
      ('Instituto Nacional José Miguel Carrera', 'II°', 2024, 'Media', 4),
      ('Instituto Nacional José Miguel Carrera', 'III°', 2024, 'Media', 5),
      ('Instituto Nacional José Miguel Carrera', 'IV°', 2024, 'Media', 6),
      
      ('Liceo Carmela Carvajal de Prat', '7°', 2024, 'Básica', 1),
      ('Liceo Carmela Carvajal de Prat', '8°', 2024, 'Básica', 2),
      ('Liceo Carmela Carvajal de Prat', 'I°', 2024, 'Media', 3),
      ('Liceo Carmela Carvajal de Prat', 'II°', 2024, 'Media', 4),
      ('Liceo Carmela Carvajal de Prat', 'III°', 2024, 'Media', 5),
      ('Liceo Carmela Carvajal de Prat', 'IV°', 2024, 'Media', 6),
      
      ('Colegio Santo Tomás', '1°', 2024, 'Básica', 1),
      ('Colegio Santo Tomás', '2°', 2024, 'Básica', 2),
      ('Colegio Santo Tomás', '3°', 2024, 'Básica', 3),
      ('Colegio Santo Tomás', '4°', 2024, 'Básica', 4),
      ('Colegio Santo Tomás', '5°', 2024, 'Básica', 5),
      ('Colegio Santo Tomás', '6°', 2024, 'Básica', 6)
    ) AS curso(school_name, name, year, level, teacher_id)
    JOIN temp_new_schools esc ON curso.school_name = esc.name
  RETURNING id, name, level, school_id
)
-- Guardar los cursos en una tabla temporal
SELECT id, name, level, school_id INTO TEMP TABLE temp_new_courses FROM inserted_courses;

-- Agregar algunos estudiantes de muestra para los nuevos cursos
WITH student_data AS (
  SELECT 
    esc.id AS school_id,
    esc.name AS school_name,
    crso.id AS course_id,
    crso.name AS course_name,
    crso.level AS course_level,
    stud.rut,
    stud.first_name,
    stud.last_name,
    stud.birth_date,
    stud.gender,
    stud.address,
    stud.phone,
    stud.email
  FROM (
    VALUES
      -- Estudiantes Colegio Santa María
      ('Colegio Santa María', '1°', 'Básica', '21456789-0', 'Santiago', 'Reyes Molina', '2018-03-12', 'M', 'Los Alerces 345, Providencia', '+56941234567', 'santiago.reyes@gmail.com'),
      ('Colegio Santa María', '1°', 'Básica', '21567890-1', 'Josefina', 'Navarro Lagos', '2018-05-22', 'F', 'Lyon 2567, Ñuñoa', '+56942345678', 'josefina.navarro@gmail.com'),
      ('Colegio Santa María', '2°', 'Básica', '21678901-2', 'Felipe', 'Contreras Muñoz', '2016-08-10', 'M', 'Pedro de Valdivia 1245, Providencia', '+56943456789', 'felipe.contreras@gmail.com'),
      
      -- Estudiantes Liceo José Miguel Carrera
      ('Liceo José Miguel Carrera', '7°', 'Básica', '15789012-3', 'Ignacio', 'Pizarro Soto', '2010-01-15', 'M', 'Irarrázaval 2345, Ñuñoa', '+56944567890', 'ignacio.pizarro@gmail.com'),
      ('Liceo José Miguel Carrera', '7°', 'Básica', '15890123-4', 'Valentina', 'Castro Figueroa', '2010-04-23', 'F', 'Los Orientales 567, Ñuñoa', '+56945678901', 'valentina.castro@gmail.com'),
      ('Liceo José Miguel Carrera', 'II°', 'Media', '15901234-5', 'Rodrigo', 'Sepúlveda Rojas', '2006-11-05', 'M', 'Manuel Montt 1234, Providencia', '+56946789012', 'rodrigo.sepulveda@gmail.com'),
      
      -- Estudiantes Instituto Nacional
      ('Instituto Nacional José Miguel Carrera', '8°', 'Básica', '16012345-6', 'Martín', 'Fuentes Araya', '2009-07-18', 'M', 'Santa Isabel 890, Santiago', '+56947890123', 'martin.fuentes@gmail.com'),
      ('Instituto Nacional José Miguel Carrera', '8°', 'Básica', '16123456-7', 'Carolina', 'Muñoz Silva', '2009-09-30', 'F', 'Manuel Rodríguez 456, Santiago', '+56948901234', 'carolina.munoz@gmail.com'),
      ('Instituto Nacional José Miguel Carrera', 'I°', 'Media', '16234567-8', 'Diego', 'Vera Salazar', '2007-03-25', 'M', 'Curicó 789, Santiago', '+56949012345', 'diego.vera@gmail.com'),
      
      -- Estudiantes Liceo Carmela Carvajal
      ('Liceo Carmela Carvajal de Prat', 'I°', 'Media', '16345678-9', 'Macarena', 'Soto Jiménez', '2008-02-28', 'F', 'Pedro Lautaro 234, Providencia', '+56950123456', 'macarena.soto@gmail.com'),
      ('Liceo Carmela Carvajal de Prat', 'I°', 'Media', '16456789-0', 'Antonia', 'Vega Paredes', '2008-06-14', 'F', 'Antonio Varas 567, Providencia', '+56951234567', 'antonia.vega@gmail.com'),
      ('Liceo Carmela Carvajal de Prat', 'III°', 'Media', '16567890-1', 'Javiera', 'Riquelme Torres', '2006-10-22', 'F', 'Simón Bolívar 890, Ñuñoa', '+56952345678', 'javiera.riquelme@gmail.com'),
      
      -- Estudiantes Colegio Santo Tomás
      ('Colegio Santo Tomás', '1°', 'Básica', '21890123-4', 'Emilia', 'Rojas Aravena', '2018-11-10', 'F', 'Av. Kennedy 5678, Vitacura', '+56953456789', 'emilia.rojas@gmail.com'),
      ('Colegio Santo Tomás', '1°', 'Básica', '21901234-5', 'Tomás', 'Araya Mendoza', '2019-01-05', 'M', 'Alonso de Córdova 1234, Vitacura', '+56954567890', 'tomas.araya@gmail.com'),
      ('Colegio Santo Tomás', '2°', 'Básica', '21112345-6', 'Amanda', 'Bravo González', '2017-07-20', 'F', 'Vitacura 2468, Vitacura', '+56955678901', 'amanda.bravo@gmail.com')
    ) AS stud(school_name, course_name, course_level, rut, first_name, last_name, birth_date, gender, address, phone, email)
    JOIN temp_new_schools esc ON stud.school_name = esc.name
    JOIN temp_new_courses crso ON 
      crso.name = stud.course_name AND 
      crso.level = stud.course_level AND
      crso.school_id = esc.id
)
-- Insertar estudiantes
INSERT INTO students (
  rut, 
  first_name, 
  last_name, 
  birth_date, 
  gender, 
  address, 
  phone, 
  email, 
  status, 
  course_id
)
SELECT 
  sd.rut,
  sd.first_name,
  sd.last_name,
  sd.birth_date::date,
  sd.gender,
  sd.address,
  sd.phone,
  sd.email,
  'Activo',
  sd.course_id
FROM student_data sd
-- Evitar duplicados por RUT
WHERE NOT EXISTS (
  SELECT 1 FROM students WHERE rut = sd.rut
);

-- Limpiar tablas temporales
DROP TABLE IF EXISTS temp_new_schools;
DROP TABLE IF EXISTS temp_new_courses;

-- Actualizar las estadísticas para refrescar el caché del esquema
ANALYZE schools;
ANALYZE courses;
ANALYZE students;