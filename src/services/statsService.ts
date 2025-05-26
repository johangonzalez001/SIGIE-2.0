import { supabase } from '../lib/supabase';
import { EnrollmentStats, AttendanceStats, DashboardData } from '../types';

/**
 * Obtiene todas las estadísticas de matrícula
 */
export const fetchEnrollmentStats = async (): Promise<EnrollmentStats[]> => {
  try {
    const { data, error } = await supabase
      .from('enrollment_stats')
      .select('*')
      .order('month', { ascending: true });

    if (error) {
      console.error('Error al obtener estadísticas de matrícula:', error);
      throw new Error('No se pudieron cargar las estadísticas de matrícula: ' + error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error en fetchEnrollmentStats:', error);
    throw new Error('No se pudieron cargar las estadísticas de matrícula. Por favor, intente nuevamente.');
  }
};

/**
 * Obtiene todas las estadísticas de asistencia
 */
export const fetchAttendanceStats = async (): Promise<AttendanceStats[]> => {
  try {
    const { data, error } = await supabase
      .from('attendance_stats')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error al obtener estadísticas de asistencia:', error);
      throw new Error('No se pudieron cargar las estadísticas de asistencia: ' + error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error en fetchAttendanceStats:', error);
    throw new Error('No se pudieron cargar las estadísticas de asistencia. Por favor, intente nuevamente.');
  }
};

/**
 * Obtiene los datos para el dashboard
 * Combina las estadísticas de matrícula y asistencia
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    // Obtener las estadísticas de matrícula
    const { data: enrollmentData, error: enrollmentError } = await supabase
      .from('enrollment_stats')
      .select('*')
      .order('month', { ascending: false })
      .limit(1);

    if (enrollmentError) {
      throw new Error('Error al cargar estadísticas de matrícula: ' + enrollmentError.message);
    }

    // Obtener las estadísticas de asistencia
    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(1);

    if (attendanceError) {
      throw new Error('Error al cargar estadísticas de asistencia: ' + attendanceError.message);
    }

    // Obtener escuelas para los filtros
    const { data: schoolsData, error: schoolsError } = await supabase
      .from('schools')
      .select('id, name')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (schoolsError) {
      throw new Error('Error al cargar escuelas: ' + schoolsError.message);
    }

    // Si no hay datos, usar valores por defecto
    const latestEnrollment = enrollmentData?.[0] || {
      total_students: 0,
      new_enrollments: 0,
      withdrawals: 0
    };

    const latestAttendance = attendanceData?.[0] || {
      present_count: 0,
      absent_count: 0,
      late_count: 0,
      attendance_rate: 0
    };

    // Datos simulados de tendencias para los gráficos
    const enrollmentTrend = generateEnrollmentTrendData();
    const attendanceTrend = generateAttendanceTrendData();
    const simceTrend = generateSimceTrendData();
    const pisaTrend = generatePisaTrendData();

    // Datos de años para filtros
    const years = [2021, 2022, 2023, 2024, 2025];

    // Niveles educativos para filtros
    const levels = ['Prebásica', 'Básica', 'Media'];

    // Datos simulados para las demás métricas del dashboard
    return {
      enrollment: {
        totalStudents: latestEnrollment.total_students,
        preBasicRate: 12.5,
        basicRate: 55.3,
        highSchoolRate: 32.2,
        kindergartenCoverage: 92.1,
        enrollmentTrend
      },
      attendance: {
        averageAttendanceRate: latestAttendance.attendance_rate,
        dropoutRate: 2.8,
        retentionRate: 97.2,
        attendanceTrend
      },
      academic: {
        averageSimceScore: {
          language: 265,
          math: 258,
          science: 270
        },
        averagePaesScore: 625,
        pisaResults: {
          reading: 452,
          math: 423,
          science: 444
        },
        simceTrend,
        pisaTrend
      },
      years,
      schools: schoolsData || [],
      levels
    };
  } catch (error) {
    console.error('Error en fetchDashboardData:', error);
    throw new Error('No se pudieron cargar los datos del dashboard. Por favor, intente nuevamente.');
  }
};

// Función auxiliar para generar datos de tendencia de matrícula
const generateEnrollmentTrendData = () => {
  // Generar datos de los últimos 12 meses
  const now = new Date();
  const data = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    // Base count de 1200 estudiantes con variación aleatoria
    const baseCount = 1200;
    // Añadir variación para mostrar tendencias más realistas
    const monthVariation = Math.sin(i / 3) * 25; // Variación sinusoidal
    const randomVariation = Math.floor(Math.random() * 30) - 15; // Variación aleatoria
    
    data.push({
      date: date.toISOString().slice(0, 7), // formato YYYY-MM
      count: baseCount + Math.round(monthVariation + randomVariation)
    });
  }
  
  return data;
};

// Función auxiliar para generar datos de tendencia de asistencia
const generateAttendanceTrendData = () => {
  // Generar datos de los últimos 30 días
  const now = new Date();
  const data = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Base rate del 90% con variación
    const baseRate = 90;
    // Añadir variación por día de la semana (más baja los lunes y viernes)
    const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado
    let dayVariation = 0;
    
    // Fin de semana tiene menos asistencia
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dayVariation = -5;
    } 
    // Lunes y viernes tienen menos asistencia que el resto de la semana
    else if (dayOfWeek === 1 || dayOfWeek === 5) {
      dayVariation = -2;
    }
    
    // Variación aleatoria pequeña
    const randomVariation = Math.floor(Math.random() * 3) - 1;
    
    data.push({
      date: date.toISOString().slice(0, 10), // formato YYYY-MM-DD
      rate: Math.min(100, Math.max(80, baseRate + dayVariation + randomVariation))
    });
  }
  
  return data;
};

// Función auxiliar para generar datos de tendencia SIMCE
const generateSimceTrendData = () => {
  const baseScores = {
    language: 260,
    math: 250,
    science: 265
  };
  
  const data = [];
  
  // Generar datos para los últimos 5 años
  for (let i = 0; i < 5; i++) {
    const year = 2020 + i;
    // Incrementar puntajes cada año con pequeñas variaciones
    data.push({
      year,
      language: baseScores.language + (i * 3) + Math.floor(Math.random() * 5),
      math: baseScores.math + (i * 2) + Math.floor(Math.random() * 6),
      science: baseScores.science + (i * 2.5) + Math.floor(Math.random() * 5)
    });
  }
  
  return data;
};

// Función auxiliar para generar datos de tendencia PISA
const generatePisaTrendData = () => {
  // Los resultados PISA son cada 3 años
  const pisaYears = [2012, 2015, 2018, 2021, 2024];
  const baseScores = {
    reading: 440,
    math: 420,
    science: 430
  };
  
  return pisaYears.map((year, index) => {
    // Incrementar puntajes con cada medición, con variaciones aleatorias
    return {
      year,
      reading: baseScores.reading + (index * 3) + Math.floor(Math.random() * 8),
      math: baseScores.math + (index * 4) + Math.floor(Math.random() * 7),
      science: baseScores.science + (index * 3.5) + Math.floor(Math.random() * 8)
    };
  });
};

// Función para obtener datos filtrados del dashboard
export const fetchFilteredDashboardData = async (filters: {
  year?: number;
  schoolId?: number;
  level?: string;
}) => {
  // En una implementación real, aquí se enviarían los filtros a la API
  // Para este ejemplo, simplemente modificamos los datos simulados
  
  const data = await fetchDashboardData();
  
  // Simular el efecto de los filtros
  if (filters.year) {
    // Filtrar tendencias por año
    data.enrollment.enrollmentTrend = data.enrollment.enrollmentTrend.filter(item => 
      item.date.startsWith(filters.year?.toString() || '')
    );
    
    // Ajustar métricas según el año
    const yearIndex = data.years.indexOf(filters.year);
    if (yearIndex !== -1) {
      // Ajustar valores basado en el índice del año (valores más pequeños para años anteriores)
      const yearFactor = 1 + (yearIndex * 0.05);
      data.enrollment.totalStudents = Math.round(data.enrollment.totalStudents * yearFactor);
      data.attendance.averageAttendanceRate = Math.min(100, data.attendance.averageAttendanceRate * yearFactor);
      data.attendance.dropoutRate = Math.max(0, data.attendance.dropoutRate * (2 - yearFactor));
    }
  }
  
  if (filters.schoolId) {
    // Simular variaciones por escuela
    // En una implementación real, se consultaría a la base de datos con el filtro
    const schoolIndex = data.schools.findIndex(s => s.id === filters.schoolId);
    if (schoolIndex !== -1) {
      const schoolVariation = (schoolIndex % 3 - 1) * 10; // Variación entre -10 y 10
      data.academic.averageSimceScore.language = Math.max(200, data.academic.averageSimceScore.language + schoolVariation);
      data.academic.averageSimceScore.math = Math.max(200, data.academic.averageSimceScore.math + schoolVariation);
      data.academic.averageSimceScore.science = Math.max(200, data.academic.averageSimceScore.science + schoolVariation);
    }
  }
  
  if (filters.level) {
    // Simular variaciones por nivel educativo
    switch(filters.level) {
      case 'Prebásica':
        data.enrollment.totalStudents = Math.round(data.enrollment.totalStudents * 0.2);
        data.attendance.averageAttendanceRate = Math.min(100, data.attendance.averageAttendanceRate * 0.95);
        break;
      case 'Básica':
        data.enrollment.totalStudents = Math.round(data.enrollment.totalStudents * 0.5);
        data.attendance.averageAttendanceRate = Math.min(100, data.attendance.averageAttendanceRate * 1.02);
        break;
      case 'Media':
        data.enrollment.totalStudents = Math.round(data.enrollment.totalStudents * 0.3);
        data.attendance.averageAttendanceRate = Math.min(100, data.attendance.averageAttendanceRate * 0.98);
        data.attendance.dropoutRate = data.attendance.dropoutRate * 1.5;
        break;
    }
  }
  
  return data;
};