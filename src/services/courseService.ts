import { supabase } from '../lib/supabase';
import { Course } from '../types';

/**
 * Obtiene todos los cursos
 */
export const fetchCourses = async (): Promise<Course[]> => {
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
        ),
        school:school_id (
          id,
          name,
          city
        )
      `)
      .is('deleted_at', null)
      .order('year', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error al obtener cursos:', error);
      throw new Error('No se pudieron cargar los cursos: ' + error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error en fetchCourses:', error);
    throw new Error('No se pudieron cargar los cursos. Por favor, intente nuevamente.');
  }
};

/**
 * Obtiene un curso por su ID
 */
export const fetchCourseById = async (id: number): Promise<Course | null> => {
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
        ),
        school:school_id (
          id,
          name,
          city
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Error al obtener curso por ID:', error);
      throw new Error('No se pudo encontrar el curso: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en fetchCourseById:', error);
    throw new Error('No se pudo cargar el curso. Por favor, intente nuevamente.');
  }
};

/**
 * Crea un nuevo curso
 */
export const createCourse = async (course: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<Course> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([course])
      .select(`
        *,
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
      `)
      .single();

    if (error) {
      console.error('Error al crear curso:', error);
      throw new Error('No se pudo crear el curso: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en createCourse:', error);
    throw new Error('No se pudo crear el curso. Por favor, intente nuevamente.');
  }
};

/**
 * Actualiza un curso existente
 */
export const updateCourse = async (id: number, course: Partial<Course>): Promise<Course> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(course)
      .eq('id', id)
      .select(`
        *,
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
      `)
      .single();

    if (error) {
      console.error('Error al actualizar curso:', error);
      throw new Error('No se pudo actualizar el curso: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en updateCourse:', error);
    throw new Error('No se pudo actualizar el curso. Por favor, intente nuevamente.');
  }
};

/**
 * Elimina un curso (soft delete)
 */
export const deleteCourse = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('courses')
      .update({ deleted_at: new Date().toISOString(), active: false })
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar curso:', error);
      throw new Error('No se pudo eliminar el curso: ' + error.message);
    }
  } catch (error) {
    console.error('Error en deleteCourse:', error);
    throw new Error('No se pudo eliminar el curso. Por favor, intente nuevamente.');
  }
};