import { SystemLog } from '../types';

// Datos de ejemplo para el registro de actividades del sistema
// En una aplicación real, estos datos vendrían de una base de datos
const MOCK_LOGS: SystemLog[] = [
  {
    id: 1,
    userId: 1,
    userName: 'Admin User',
    userRole: 'administrator',
    action: 'CREATE',
    module: 'students',
    description: 'Nuevo estudiante registrado',
    timestamp: '2024-03-20T10:30:00Z',
    ipAddress: '192.168.1.100',
    browser: 'Chrome 122.0.0',
    platform: 'Windows 10',
    details: {
      after: {
        studentName: 'Juan Pérez',
        grade: '8° Básico',
        email: 'juan.perez@ejemplo.cl',
        rut: '12.345.678-9'
      },
      additionalInfo: {
        enrollmentNumber: 'E2024001',
        academicYear: '2024'
      }
    },
    severity: 'info',
    status: 'success'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Teacher User',
    userRole: 'teacher',
    action: 'UPDATE',
    module: 'grades',
    description: 'Calificación actualizada',
    timestamp: '2024-03-20T11:15:00Z',
    ipAddress: '192.168.1.101',
    browser: 'Firefox 123.0',
    platform: 'macOS 14.3',
    details: {
      before: {
        score: 5.5,
        comments: 'Evaluación parcial'
      },
      after: {
        score: 6.0,
        comments: 'Evaluación parcial con corrección'
      },
      changes: ['score', 'comments'],
      additionalInfo: {
        evaluationType: 'Prueba escrita',
        subject: 'Matemáticas',
        unit: 'Álgebra básica'
      }
    },
    severity: 'info',
    status: 'success'
  },
  {
    id: 3,
    userId: 1,
    userName: 'Admin User',
    userRole: 'administrator',
    action: 'LOGIN',
    module: 'system',
    description: 'Inicio de sesión exitoso',
    timestamp: '2024-03-20T09:00:00Z',
    ipAddress: '192.168.1.100',
    browser: 'Chrome 122.0.0',
    platform: 'Windows 10',
    details: {
      additionalInfo: {
        loginMethod: 'credentials',
        sessionDuration: '8 hours'
      }
    },
    severity: 'info',
    status: 'success'
  },
  {
    id: 4,
    userId: 1,
    userName: 'Admin User',
    userRole: 'administrator',
    action: 'DELETE',
    module: 'attendance',
    description: 'Registro de asistencia eliminado',
    timestamp: '2024-03-20T14:30:00Z',
    ipAddress: '192.168.1.100',
    browser: 'Chrome 122.0.0',
    platform: 'Windows 10',
    details: {
      before: {
        studentName: 'María González',
        date: '2024-03-19',
        status: 'absent',
        justification: 'Certificado médico'
      },
      additionalInfo: {
        reason: 'Registro duplicado',
        approvedBy: 'Admin User'
      }
    },
    severity: 'warning',
    status: 'success'
  }
];

// Función para obtener todos los registros del sistema
// Simula una llamada a API y ordena los registros por fecha descendente
export const fetchSystemLogs = async (): Promise<SystemLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [...MOCK_LOGS].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Función para crear un nuevo registro en el sistema
// En una app real, esto enviaría los datos a una API
export const createSystemLog = async (log: Omit<SystemLog, 'id' | 'timestamp'>): Promise<SystemLog> => {
  const newLog: SystemLog = {
    ...log,
    id: MOCK_LOGS.length + 1,
    timestamp: new Date().toISOString()
  };
  
  MOCK_LOGS.push(newLog);
  return newLog;
};

// Función para obtener estadísticas de los registros
// Agrupa los registros por diferentes criterios
export const getSystemLogStats = async () => {
  const logs = await fetchSystemLogs();
  
  return {
    totalLogs: logs.length,
    // Agrupa por módulo
    byModule: logs.reduce((acc, log) => {
      acc[log.module] = (acc[log.module] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    // Agrupa por tipo de acción
    byAction: logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    // Agrupa por nivel de severidad
    bySeverity: logs.reduce((acc, log) => {
      acc[log.severity] = (acc[log.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    // Agrupa por estado
    byStatus: logs.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
};