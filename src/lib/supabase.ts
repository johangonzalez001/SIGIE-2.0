import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Verificar que las variables de entorno estén definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Crear el cliente de Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Función para verificar la conexión con Supabase
export const checkSupabaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validar que tenemos las variables de entorno
    if (!supabaseUrl || !supabaseAnonKey) {
      return { 
        success: false, 
        error: 'Las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no están configuradas' 
      };
    }

    // Intentar una operación simple para verificar la conexión
    const { error } = await supabase.from('students').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error al verificar la conexión con Supabase:', error);
      
      // Mensajes de error más específicos según el código de error
      if (error.code === 'PGRST301') {
        return { 
          success: false, 
          error: 'Error de permisos: Verifique las políticas RLS en Supabase (403 Forbidden)'
        };
      } else if (error.code === '22P02') {
        return {
          success: false,
          error: 'Error de tipo de datos: Hay un problema con los tipos de datos en la consulta'
        };
      } else if (error.code === 'PGRST116') {
        return {
          success: false,
          error: 'Tabla no encontrada: No existe la tabla o no tiene permisos para acceder'
        };
      } else if (error.code === 'TypeError') {
        return {
          success: false, 
          error: 'Error de red o CORS: Verifique su conexión a internet o la configuración CORS de Supabase'
        };
      }
      
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error inesperado al verificar la conexión con Supabase:', error);
    return { 
      success: false, 
      error: error instanceof Error 
        ? error.message 
        : 'Error desconocido al conectar con Supabase'
    };
  }
};