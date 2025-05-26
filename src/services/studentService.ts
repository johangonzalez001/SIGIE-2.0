import { supabase } from '../lib/supabase';
import { Student } from '../types';

/**
 * Obtiene todos los estudiantes
 */
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(
        `
        *,
        course:course_id (
          id,
          name,
          year,
          level,
          teacher:teacher_id (
            id,
            first_name,
            last_name,
            email
          ),
          school:school_id (
            id,
            name,
            city
          )
        )
      `
      )
      .order('last_name', { ascending: true })
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Error al obtener estudiantes:', error);
      throw new Error(
        'No se pudieron cargar los estudiantes: ' + error.message
      );
    }

    return data || [];
  } catch (error) {
    console.error('Error en fetchStudents:', error);
    throw new Error(
      'No se pudieron cargar los estudiantes. Por favor, intente nuevamente.'
    );
  }
};

/**
 * Obtiene un estudiante por su ID
 */
export const fetchStudentById = async (id: number): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(
        `
        *,
        course:course_id (
          id,
          name,
          year,
          level,
          teacher:teacher_id (
            id,
            first_name,
            last_name,
            email
          ),
          school:school_id (
            id,
            name,
            city
          )
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener estudiante por ID:', error);
      throw new Error('No se pudo encontrar el estudiante: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en fetchStudentById:', error);
    throw new Error(
      'No se pudo cargar el estudiante. Por favor, intente nuevamente.'
    );
  }
};

/**
 * Busca estudiantes por término de búsqueda en diferentes campos
 */
export const searchStudents = async (searchTerm: string): Promise<Student[]> => {
  try {
    // Preparar el término de búsqueda para consulta ILIKE
    const searchPattern = `%${searchTerm.toLowerCase()}%`;
    
    // Búsqueda en múltiples campos con OR
    const { data, error } = await supabase
      .from('students')
      .select(
        `
        *,
        course:course_id (
          id,
          name,
          year,
          level,
          teacher:teacher_id (
            id,
            first_name,
            last_name,
            email
          ),
          school:school_id (
            id,
            name,
            city
          )
        )
      `
      )
      .or(`first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},rut.ilike.${searchPattern}`)
      .order('last_name', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error al buscar estudiantes:', error);
      throw new Error('No se pudieron buscar los estudiantes: ' + error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error en searchStudents:', error);
    throw new Error('No se pudo realizar la búsqueda. Por favor, intente nuevamente.');
  }
};

/**
 * Verifica si un RUT ya existe en la base de datos
 */
export const checkRutExists = async (rut: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id')
      .eq('rut', rut)
      .maybeSingle();

    if (error) {
      console.error('Error al verificar RUT:', error);
      throw new Error('Error al verificar el RUT: ' + error.message);
    }

    return data !== null;
  } catch (error) {
    console.error('Error en checkRutExists:', error);
    throw new Error(
      'No se pudo verificar el RUT. Por favor, intente nuevamente.'
    );
  }
};

/**
 * Crea un nuevo estudiante
 */
export const createStudent = async (
  student: Omit<Student, 'id' | 'created_at' | 'updated_at'>
): Promise<Student> => {
  try {
    // Preparar los datos para la inserción
    const studentData = {
      rut: student.rut,
      first_name: student.first_name,
      last_name: student.last_name,
      birth_date: student.birth_date,
      gender: student.gender,
      address: student.address || null,
      phone: student.phone || null,
      email: student.email || null,
      status: student.status,
      course_id: student.course_id || null,
      // Establecer deleted_at si el estado es 'Retirado'
      deleted_at:
        student.status === 'Retirado' ? new Date().toISOString() : null,
    };

    // Insertar el estudiante
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select(
        `
        *,
        course:course_id (
          id,
          name,
          year,
          level,
          teacher:teacher_id (
            id,
            first_name,
            last_name,
            email
          ),
          school:school_id (
            id,
            name,
            city
          )
        )
      `
      )
      .single();

    if (error) {
      console.error('Error al crear estudiante:', error);
      throw new Error('No se pudo crear el estudiante: ' + error.message);
    }

    if (!data) {
      throw new Error('No se pudo crear el estudiante: No se recibieron datos');
    }

    return data;
  } catch (error) {
    console.error('Error en createStudent:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'No se pudo crear el estudiante. Por favor, intente nuevamente.'
    );
  }
};

/**
 * Actualiza un estudiante existente
 */
export const updateStudent = async (
  id: number,
  student: Partial<Student>
): Promise<Student> => {
  try {
    // Preparar los datos para la actualización
    const updateData: any = {};

    // Solo incluir campos que se proporcionan
    if (student.rut !== undefined) updateData.rut = student.rut;
    if (student.first_name !== undefined)
      updateData.first_name = student.first_name;
    if (student.last_name !== undefined)
      updateData.last_name = student.last_name;
    if (student.birth_date !== undefined)
      updateData.birth_date = student.birth_date;
    if (student.gender !== undefined) updateData.gender = student.gender;
    if (student.address !== undefined) updateData.address = student.address;
    if (student.phone !== undefined) updateData.phone = student.phone;
    if (student.email !== undefined) updateData.email = student.email;
    if (student.status !== undefined) updateData.status = student.status;
    if (student.course_id !== undefined)
      updateData.course_id = student.course_id;

    // Si el estado es 'Retirado', establecer course_id a null y deleted_at a now
    if (student.status === 'Retirado') {
      updateData.deleted_at = new Date().toISOString();
      updateData.course_id = null;
    }

    // Si el estado no es 'Retirado', asegurar que deleted_at sea null
    if (student.status && student.status !== 'Retirado') {
      updateData.deleted_at = null;
    }

    // Actualizar el estudiante
    const { data, error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select(
        `
        *,
        course:course_id (
          id,
          name,
          year,
          level,
          teacher:teacher_id (
            id,
            first_name,
            last_name,
            email
          ),
          school:school_id (
            id,
            name,
            city
          )
        )
      `
      )
      .single();

    if (error) {
      console.error('Error al actualizar estudiante:', error);
      throw new Error(`No se pudo actualizar el estudiante: ${error.message}`);
    }

    if (!data) {
      throw new Error(
        'No se pudo actualizar el estudiante: no se recibieron datos'
      );
    }

    return data;
  } catch (error) {
    console.error('Error en updateStudent:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'No se pudo actualizar el estudiante. Por favor, intente nuevamente.'
    );
  }
};

/**
 * Elimina un estudiante (soft delete)
 */
export const deleteStudent = async (id: number): Promise<void> => {
  try {
    // Realizar soft delete actualizando el estado a 'Retirado'
    const { error } = await supabase
      .from('students')
      .update({
        status: 'Retirado',
        deleted_at: new Date().toISOString(),
        course_id: null,
      })
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar estudiante:', error);
      throw new Error(`No se pudo eliminar el estudiante: ${error.message}`);
    }
  } catch (error) {
    console.error('Error en deleteStudent:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'No se pudo eliminar el estudiante. Por favor, intente nuevamente.'
    );
  }
};