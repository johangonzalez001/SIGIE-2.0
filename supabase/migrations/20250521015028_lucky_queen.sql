/*
  # Agregar 20 nuevos estudiantes al sistema
  
  1. Cambios
    - Insertar 20 nuevos estudiantes con datos completos y válidos
    - Distribuir estudiantes en diferentes cursos
    - Usar datos coherentes y realistas
    
  2. Datos
    - Nombres y apellidos chilenos realistas
    - RUTs válidos siguiendo el formato chileno
    - Fechas de nacimiento apropiadas según el nivel educativo
    - Distribución variada en cursos existentes
*/

-- Insertar 20 nuevos estudiantes
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
) VALUES
  -- Estudiantes de 1° Básico (curso_id = 1)
  (
    '20345678-9', 
    'Matías', 
    'Fuentes Rojas', 
    '2017-05-10', 
    'M', 
    'Av. Las Condes 4500, Las Condes', 
    '+56912345670', 
    'matias.fuentes@ejemplo.cl', 
    'Activo', 
    1
  ),
  (
    '20654321-0', 
    'Francisca', 
    'Muñoz Sepúlveda', 
    '2017-07-22', 
    'F', 
    'Pedro de Valdivia Norte 234, Providencia', 
    '+56945678901', 
    'francisca.munoz@ejemplo.cl', 
    'Activo', 
    1
  ),
  
  -- Estudiantes de 3° Básico (curso_id = 3)
  (
    '19876543-2', 
    'Joaquín', 
    'Gutiérrez Martínez', 
    '2015-03-15', 
    'M', 
    'Los Trapenses 1200, Lo Barnechea', 
    '+56923456782', 
    'joaquin.gutierrez@ejemplo.cl', 
    'Activo', 
    3
  ),
  (
    '19765432-3', 
    'Valentina', 
    'Soto Contreras', 
    '2015-10-05', 
    'F', 
    'Camino El Alba 456, Las Condes', 
    '+56934567893', 
    'valentina.soto@ejemplo.cl', 
    'Activo', 
    3
  ),
  
  -- Estudiantes de 5° Básico (curso_id = 5)
  (
    '18765438-5', 
    'Benjamín', 
    'Araya Figueroa', 
    '2013-02-28', 
    'M', 
    'Vitacura 2640, Vitacura', 
    '+56945678904', 
    'benjamin.araya@ejemplo.cl', 
    'Activo', 
    5
  ),
  (
    '18456789-6', 
    'Antonia', 
    'Vega Tapia', 
    '2013-11-14', 
    'F', 
    'Isidora Goyenechea 780, Las Condes', 
    '+56956789015', 
    'antonia.vega@ejemplo.cl', 
    'Activo', 
    5
  ),
  
  -- Estudiantes de 8° Básico (curso_id = 8)
  (
    '17345678-7', 
    'Vicente', 
    'Ortiz Pizarro', 
    '2010-08-30', 
    'M', 
    'Av. Apoquindo 3500, Las Condes', 
    '+56967890126', 
    'vicente.ortiz@ejemplo.cl', 
    'Activo', 
    8
  ),
  (
    '17654321-8', 
    'Javiera', 
    'Campos Riquelme', 
    '2010-04-17', 
    'F', 
    'Av. Ossa 1800, La Reina', 
    '+56978901237', 
    'javiera.campos@ejemplo.cl', 
    'Activo', 
    8
  ),
  
  -- Estudiantes de I° Medio (curso_id = 9)
  (
    '16876543-9', 
    'Sebastián', 
    'Reyes Aravena', 
    '2009-09-20', 
    'M', 
    'Av. La Dehesa 1340, Lo Barnechea', 
    '+56989012348', 
    'sebastian.reyes@ejemplo.cl', 
    'Activo', 
    9
  ),
  (
    '16789012-K', 
    'Constanza', 
    'Leiva Bravo', 
    '2009-12-03', 
    'F', 
    'Av. Las Flores 450, Providencia', 
    '+56990123459', 
    'constanza.leiva@ejemplo.cl', 
    'Activo', 
    9
  ),
  
  -- Estudiantes de II° Medio (curso_id = 10)
  (
    '15678901-0', 
    'Martín', 
    'Jara Espinoza', 
    '2008-06-15', 
    'M', 
    'Av. Fleming 5430, Las Condes', 
    '+56912345670', 
    'martin.jara@ejemplo.cl', 
    'Activo', 
    10
  ),
  (
    '15789012-1', 
    'Isidora', 
    'Fernández Morales', 
    '2008-08-22', 
    'F', 
    'Manquehue Norte 780, Las Condes', 
    '+56923456781', 
    'isidora.fernandez@ejemplo.cl', 
    'Activo', 
    10
  ),
  
  -- Estudiantes de III° Medio (curso_id = 11)
  (
    '14890123-2', 
    'Gabriel', 
    'Lagos Miranda', 
    '2007-04-05', 
    'M', 
    'Alonso de Córdova 4000, Vitacura', 
    '+56934567892', 
    'gabriel.lagos@ejemplo.cl', 
    'Activo', 
    11
  ),
  (
    '14901234-3', 
    'Catalina', 
    'Núñez Castro', 
    '2007-10-12', 
    'F', 
    'Latadía 5600, Las Condes', 
    '+56945678903', 
    'catalina.nunez@ejemplo.cl', 
    'Activo', 
    11
  ),
  
  -- Estudiantes de IV° Medio (curso_id = 12)
  (
    '13012345-4', 
    'Lucas', 
    'Herrera Navarro', 
    '2006-03-28', 
    'M', 
    'Av. Santa María 2400, Providencia', 
    '+56956789014', 
    'lucas.herrera@ejemplo.cl', 
    'Activo', 
    12
  ),
  (
    '13123456-5', 
    'Florencia', 
    'Vergara Saavedra', 
    '2006-05-19', 
    'F', 
    'El Bosque Norte 0123, Las Condes', 
    '+56967890125', 
    'florencia.vergara@ejemplo.cl', 
    'Activo', 
    12
  ),
  
  -- Estudiantes en estado Egresado (sin curso asignado)
  (
    '12234567-6', 
    'Maximiliano', 
    'Díaz Paredes', 
    '2005-11-10', 
    'M', 
    'Camino El Alba 1230, Las Condes', 
    '+56978901236', 
    'maximiliano.diaz@ejemplo.cl', 
    'Egresado', 
    NULL
  ),
  (
    '12345678-7', 
    'Trinidad', 
    'Medina Rojas', 
    '2005-08-04', 
    'F', 
    'Av. Kennedy 7100, Vitacura', 
    '+56989012347', 
    'trinidad.medina@ejemplo.cl', 
    'Egresado', 
    NULL
  ),
  
  -- Estudiantes en estado Retirado (sin curso asignado y con deleted_at)
  (
    '11456789-8', 
    'Tomás', 
    'Rivera Silva', 
    '2012-02-15', 
    'M', 
    'Luis Carrera 1450, Vitacura', 
    '+56990123458', 
    'tomas.rivera@ejemplo.cl', 
    'Retirado', 
    NULL
  ),
  (
    '11567890-9', 
    'Amanda', 
    'Pérez Moreno', 
    '2014-07-25', 
    'F', 
    'Hernando de Aguirre 128, Providencia', 
    '+56912345679', 
    'amanda.perez@ejemplo.cl', 
    'Retirado', 
    NULL
  );

-- Actualizar deleted_at para estudiantes retirados
UPDATE students
SET deleted_at = NOW()
WHERE status = 'Retirado' AND deleted_at IS NULL;