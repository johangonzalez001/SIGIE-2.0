import { supabase } from '../lib/supabase';
import { Teacher } from '../types';

/**
 * Obtiene todos los profesores
 */
export const fetchTeachers = async (): Promise<Teacher[]> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .is('deleted_at', null)
      .order('last_name', { ascending: true })
      .order('first_name', { ascending: true });

    if (error) {
      console.error('Error al obtener profesores:', error);
      throw new Error('No se pudieron cargar los profesores: ' + error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error en fetchTeachers:', error);
    throw new Error('No se pudieron cargar los profesores. Por favor, intente nuevamente.');
  }
};

/**
 * Obtiene un profesor por su ID
 */
export const fetchTeacherById = async (id: number): Promise<Teacher | null> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Error al obtener profesor por ID:', error);
      throw new Error('No se pudo encontrar el profesor: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en fetchTeacherById:', error);
    throw new Error('No se pudo cargar el profesor. Por favor, intente nuevamente.');
  }
};

/**
 * Verifica si un RUT ya existe en la tabla de profesores
 */
export const checkTeacherRutExists = async (rut: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('id')
      .eq('rut', rut)
      .maybeSingle();

    if (error) {
      console.error('Error al verificar RUT de profesor:', error);
      throw new Error('Error al verificar el RUT: ' + error.message);
    }

    return data !== null;
  } catch (error) {
    console.error('Error en checkTeacherRutExists:', error);
    throw new Error('No se pudo verificar el RUT. Por favor, intente nuevamente.');
  }
};

/**
 * Crea un nuevo profesor
 */
export const createTeacher = async (teacher: Omit<Teacher, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<Teacher> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .insert([teacher])
      .select()
      .single();

    if (error) {
      console.error('Error al crear profesor:', error);
      throw new Error('No se pudo crear el profesor: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en createTeacher:', error);
    throw new Error('No se pudo crear el profesor. Por favor, intente nuevamente.');
  }
};

/**
 * Actualiza un profesor existente
 */
export const updateTeacher = async (id: number, teacher: Partial<Teacher>): Promise<Teacher> => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .update(teacher)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar profesor:', error);
      throw new Error('No se pudo actualizar el profesor: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en updateTeacher:', error);
    throw new Error('No se pudo actualizar el profesor. Por favor, intente nuevamente.');
  }
};

/**
 * Elimina un profesor (soft delete)
 */
export const deleteTeacher = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('teachers')
      .update({ deleted_at: new Date().toISOString(), active: false })
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar profesor:', error);
      throw new Error('No se pudo eliminar el profesor: ' + error.message);
    }
  } catch (error) {
    console.error('Error en deleteTeacher:', error);
    throw new Error('No se pudo eliminar el profesor. Por favor, intente nuevamente.');
  }
};