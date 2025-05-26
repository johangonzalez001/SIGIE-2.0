import { supabase } from '../lib/supabase';
import { School, Course, Student } from '../types';

/**
 * Obtiene todos los establecimientos educacionales
 */
export const fetchSchools = async (): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error al obtener establecimientos:', error);
      throw new Error('No se pudieron cargar los establecimientos: ' + error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error en fetchSchools:', error);
    throw new Error('No se pudieron cargar los establecimientos. Por favor, intente nuevamente.');
  }
};

/**
 * Obtiene un establecimiento por su ID
 */
export const fetchSchoolById = async (id: number): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Error al obtener establecimiento por ID:', error);
      throw new Error('No se pudo encontrar el establecimiento: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en fetchSchoolById:', error);
    throw new Error('No se pudo cargar el establecimiento. Por favor, intente nuevamente.');
  }
};

/**
 * Obtiene los cursos asociados a un establecimiento
 */
export const fetchSchoolCourses = async (schoolId: number): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        teacher:teacher_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('school_id', schoolId)
      .is('deleted_at', null)
      .order('year', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error al obtener cursos del establecimiento:', error);
      throw new Error('No se pudieron cargar los cursos del establecimiento: ' + error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error en fetchSchoolCourses:', error);
    throw new Error('No se pudieron cargar los cursos del establecimiento. Por favor, intente nuevamente.');
  }
};

/**
 * Obtiene los estudiantes de un curso
 */
export const fetchCourseStudents = async (courseId: number): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('course_id', courseId)
      .is('deleted_at', null)
      .order('last_name', { ascending: true })
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Error al obtener estudiantes del curso:', error);
      throw new Error('No se pudieron cargar los estudiantes del curso: ' + error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error en fetchCourseStudents:', error);
    throw new Error('No se pudieron cargar los estudiantes del curso. Por favor, intente nuevamente.');
  }
};

/**
 * Crea un nuevo establecimiento
 */
export const createSchool = async (school: Omit<School, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .insert([school])
      .select()
      .single();

    if (error) {
      console.error('Error al crear establecimiento:', error);
      throw new Error('No se pudo crear el establecimiento: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en createSchool:', error);
    throw new Error('No se pudo crear el establecimiento. Por favor, intente nuevamente.');
  }
};

/**
 * Actualiza un establecimiento existente
 */
export const updateSchool = async (id: number, school: Partial<School>): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update(school)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar establecimiento:', error);
      throw new Error('No se pudo actualizar el establecimiento: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en updateSchool:', error);
    throw new Error('No se pudo actualizar el establecimiento. Por favor, intente nuevamente.');
  }
};

/**
 * Elimina un establecimiento (soft delete)
 */
export const deleteSchool = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('schools')
      .update({ deleted_at: new Date().toISOString(), active: false })
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar establecimiento:', error);
      throw new Error('No se pudo eliminar el establecimiento: ' + error.message);
    }
  } catch (error) {
    console.error('Error en deleteSchool:', error);
    throw new Error('No se pudo eliminar el establecimiento. Por favor, intente nuevamente.');
  }
};