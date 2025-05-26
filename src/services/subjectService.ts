import { supabase } from '../lib/supabase';
import { Subject, CourseSubject } from '../types';

/**
 * Obtiene todas las asignaturas
 */
export const fetchSubjects = async (): Promise<Subject[]> => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        teacher:teacher_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error al obtener asignaturas:', error);
      throw new Error('No se pudieron cargar las asignaturas: ' + error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error en fetchSubjects:', error);
    throw new Error('No se pudieron cargar las asignaturas. Por favor, intente nuevamente.');
  }
};

/**
 * Obtiene una asignatura por su ID
 */
export const fetchSubjectById = async (id: number): Promise<Subject | null> => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        teacher:teacher_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Error al obtener asignatura por ID:', error);
      throw new Error('No se pudo encontrar la asignatura: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en fetchSubjectById:', error);
    throw new Error('No se pudo cargar la asignatura. Por favor, intente nuevamente.');
  }
};

/**
 * Obtiene las asignaturas de un curso específico
 */
export const fetchCourseSubjects = async (courseId: number): Promise<Subject[]> => {
  try {
    const { data, error } = await supabase
      .from('course_subjects')
      .select(`
        subject:subject_id (
          id,
          name,
          code,
          description,
          teacher_id,
          teacher:teacher_id (
            id,
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('course_id', courseId);

    if (error) {
      console.error('Error al obtener asignaturas del curso:', error);
      throw new Error('No se pudieron cargar las asignaturas del curso: ' + error.message);
    }

    // Extraer los objetos subject del resultado y filtrar los null
    const subjects = data
      .map(item => item.subject)
      .filter(subject => subject !== null) as Subject[];

    return subjects;
  } catch (error) {
    console.error('Error en fetchCourseSubjects:', error);
    throw new Error('No se pudieron cargar las asignaturas del curso. Por favor, intente nuevamente.');
  }
};

/**
 * Obtiene los cursos asignados a una asignatura específica
 */
export const fetchSubjectCourses = async (subjectId: number): Promise<number[]> => {
  try {
    const { data, error } = await supabase
      .from('course_subjects')
      .select('course_id')
      .eq('subject_id', subjectId);

    if (error) {
      console.error('Error al obtener cursos de la asignatura:', error);
      throw new Error('No se pudieron cargar los cursos de la asignatura: ' + error.message);
    }

    return data.map(item => item.course_id);
  } catch (error) {
    console.error('Error en fetchSubjectCourses:', error);
    throw new Error('No se pudieron cargar los cursos de la asignatura. Por favor, intente nuevamente.');
  }
};

/**
 * Crea una nueva asignatura
 */
export const createSubject = async (subject: Omit<Subject, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<Subject> => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subject])
      .select(`
        *,
        teacher:teacher_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Error al crear asignatura:', error);
      throw new Error('No se pudo crear la asignatura: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en createSubject:', error);
    throw new Error('No se pudo crear la asignatura. Por favor, intente nuevamente.');
  }
};

/**
 * Asigna una asignatura a un curso
 */
export const assignSubjectToCourse = async (courseId: number, subjectId: number): Promise<CourseSubject> => {
  try {
    // Verificar si ya existe esta asignación
    const { data: existing } = await supabase
      .from('course_subjects')
      .select()
      .eq('course_id', courseId)
      .eq('subject_id', subjectId)
      .maybeSingle();
      
    if (existing) {
      return existing; // Ya existe, devolver la asignación existente
    }
    
    // No existe, crear nueva asignación
    const { data, error } = await supabase
      .from('course_subjects')
      .insert([{ course_id: courseId, subject_id: subjectId }])
      .select()
      .single();

    if (error) {
      console.error('Error al asignar asignatura a curso:', error);
      throw new Error('No se pudo asignar la asignatura al curso: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en assignSubjectToCourse:', error);
    throw new Error('No se pudo asignar la asignatura al curso. Por favor, intente nuevamente.');
  }
};

/**
 * Elimina la asignación de una asignatura a un curso
 */
export const removeSubjectFromCourse = async (courseId: number, subjectId: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('course_subjects')
      .delete()
      .eq('course_id', courseId)
      .eq('subject_id', subjectId);

    if (error) {
      console.error('Error al eliminar asignatura del curso:', error);
      throw new Error('No se pudo eliminar la asignatura del curso: ' + error.message);
    }
  } catch (error) {
    console.error('Error en removeSubjectFromCourse:', error);
    throw new Error('No se pudo eliminar la asignatura del curso. Por favor, intente nuevamente.');
  }
};

/**
 * Actualiza una asignatura existente
 */
export const updateSubject = async (id: number, subject: Partial<Subject>): Promise<Subject> => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .update(subject)
      .eq('id', id)
      .select(`
        *,
        teacher:teacher_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Error al actualizar asignatura:', error);
      throw new Error('No se pudo actualizar la asignatura: ' + error.message);
    }

    return data;
  } catch (error) {
    console.error('Error en updateSubject:', error);
    throw new Error('No se pudo actualizar la asignatura. Por favor, intente nuevamente.');
  }
};

/**
 * Elimina una asignatura (soft delete)
 */
export const deleteSubject = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('subjects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar asignatura:', error);
      throw new Error('No se pudo eliminar la asignatura: ' + error.message);
    }
    
    // También eliminar todas las asignaciones de curso
    const { error: junctionError } = await supabase
      .from('course_subjects')
      .delete()
      .eq('subject_id', id);
      
    if (junctionError) {
      console.error('Error al eliminar asignaciones de curso:', junctionError);
      // No interrumpir el flujo, ya que la asignatura se eliminó correctamente
    }
  } catch (error) {
    console.error('Error en deleteSubject:', error);
    throw new Error('No se pudo eliminar la asignatura. Por favor, intente nuevamente.');
  }
};