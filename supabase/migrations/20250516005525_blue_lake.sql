/*
  # Add test data to students table

  1. Changes
    - Insert sample student records with realistic Chilean data
    - Includes a mix of active and inactive students
    - Various birth dates and genders
    - Some with optional fields (address, phone, email) and some without
*/

INSERT INTO students (rut, first_name, last_name, birth_date, gender, address, phone, email, active) 
VALUES
  ('12345678-9', 'Juan', 'Pérez González', '2010-05-15', 'M', 'Av. Providencia 1234, Santiago', '+56912345678', 'juan.perez@ejemplo.cl', true),
  ('98765432-1', 'María', 'González Silva', '2011-03-20', 'F', 'Los Alerces 567, Ñuñoa', '+56987654321', 'maria.gonzalez@ejemplo.cl', true),
  ('11222333-4', 'Pedro', 'Soto Martínez', '2009-08-10', 'M', 'Las Condes 890, Las Condes', '+56911223344', 'pedro.soto@ejemplo.cl', true),
  ('44555666-7', 'Ana', 'Muñoz López', '2010-11-25', 'F', 'San Diego 432, Santiago', '+56944556677', 'ana.munoz@ejemplo.cl', true),
  ('77888999-0', 'Diego', 'Vargas Rojas', '2011-07-30', 'M', 'Irarrázaval 789, Ñuñoa', '+56977889990', 'diego.vargas@ejemplo.cl', false),
  ('10111213-4', 'Carla', 'Flores Díaz', '2009-04-05', 'F', NULL, NULL, NULL, true),
  ('14151617-8', 'Lucas', 'Castro Ruiz', '2010-09-12', 'M', 'Vicuña Mackenna 567, La Florida', NULL, 'lucas.castro@ejemplo.cl', true),
  ('18192021-2', 'Valentina', 'Torres Pinto', '2011-01-18', 'F', NULL, '+56918192021', NULL, true),
  ('22232425-6', 'Sebastián', 'Silva Morales', '2009-12-03', 'M', 'Gran Avenida 1234, San Miguel', '+56922232425', 'sebastian.silva@ejemplo.cl', true),
  ('26272829-0', 'Catalina', 'Rojas Vera', '2010-06-22', 'F', 'Pedro de Valdivia 890, Providencia', '+56926272829', 'catalina.rojas@ejemplo.cl', false);