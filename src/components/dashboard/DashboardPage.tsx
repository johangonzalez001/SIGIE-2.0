import React, { useState, useEffect } from 'react';
import { CalendarCheck, Users, Award, BookOpen, AlertCircle } from 'lucide-react';
import { DashboardData, DashboardFilters } from '../../types';
import { fetchDashboardData, fetchFilteredDashboardData } from '../../services/statsService';
import { checkSupabaseConnection } from '../../lib/supabase';
import StatCard from './StatCard';
import EnrollmentChart from './EnrollmentChart';
import AttendanceChart from './AttendanceChart';
import AcademicChart from './AcademicChart';
import SimceChart from './SimceChart';
import PisaChart from './PisaChart';
import DashboardFiltersComponent from './DashboardFilters';

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; error?: string }>({ success: true });
  const [filters, setFilters] = useState<DashboardFilters>({
    year: new Date().getFullYear(),
    schoolId: null,
    level: null,
    subject: null
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const status = await checkSupabaseConnection();
        setConnectionStatus(status);
        
        // Si la conexión es exitosa, cargar datos del dashboard
        if (status.success) {
          loadDashboardData();
        }
      } catch (error) {
        console.error('Error al verificar conexión:', error);
        setConnectionStatus({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Error desconocido al conectar con Supabase' 
        });
        setLoading(false);
      }
    };
    
    checkConnection();
  }, []);

  useEffect(() => {
    if (connectionStatus.success) {
      loadFilteredData();
    }
  }, [filters]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
      
      // Actualizar los filtros con el año más reciente disponible
      if (dashboardData.years.length > 0) {
        const latestYear = Math.max(...dashboardData.years);
        setFilters(prev => ({...prev, year: latestYear}));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };
  
  const loadFilteredData = async () => {
    if (!connectionStatus.success) return;
    
    try {
      setLoading(true);
      setError(null);
      const filteredData = await fetchFilteredDashboardData({
        year: filters.year,
        schoolId: filters.schoolId || undefined,
        level: filters.level || undefined
      });
      setData(filteredData);
    } catch (error) {
      console.error('Error loading filtered dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar datos filtrados');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };

  // Si hay un error de conexión con Supabase, mostrar un mensaje
  if (!connectionStatus.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Vista general de indicadores educativos</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 mr-2" />
            <div>
              <h2 className="text-xl font-semibold text-red-800">Error de conexión a la base de datos</h2>
              <p className="text-red-700 mt-2">{connectionStatus.error || 'No se pudo conectar con la base de datos Supabase. Verifique su conexión y las credenciales de acceso.'}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reintentar conexión
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Vista general de indicadores educativos</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 mr-2" />
            <div>
              <h2 className="text-xl font-semibold text-red-800">Error al cargar datos</h2>
              <p className="text-red-700 mt-2">{error}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              onClick={loadDashboardData}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No se pudo cargar la información del dashboard.</p>
        <button 
          onClick={loadDashboardData}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Vista general de indicadores educativos</p>
      </div>

      {/* Filtros del Dashboard */}
      <DashboardFiltersComponent 
        years={data.years}
        schools={data.schools}
        levels={data.levels}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Estudiantes" 
          value={data.enrollment.totalStudents.toFixed(2)} 
          icon={<Users className="w-6 h-6 text-blue-600" />}
          description="Estudiantes matriculados"
          trend={5.20}
        />
        
        <StatCard 
          title="Asistencia Promedio" 
          value={`${data.attendance.averageAttendanceRate.toFixed(2)}%`} 
          icon={<CalendarCheck className="w-6 h-6 text-green-600" />}
          description="Último mes"
          trend={1.80}
        />
        
        <StatCard 
          title="Deserción Escolar" 
          value={`${data.attendance.dropoutRate.toFixed(2)}%`} 
          icon={<BookOpen className="w-6 h-6 text-red-600" />}
          description="Tasa anual"
          trend={-0.70}
          invertTrend={true}
        />
        
        <StatCard 
          title="SIMCE Promedio" 
          value={Math.round((
            data.academic.averageSimceScore.language + 
            data.academic.averageSimceScore.math + 
            data.academic.averageSimceScore.science
          ) / 3).toFixed(2)} 
          icon={<Award className="w-6 h-6 text-yellow-600" />}
          description="Promedio general"
          trend={3.50}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Matrícula</h2>
          <EnrollmentChart data={data.enrollment} />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Asistencia</h2>
          <AttendanceChart data={data.attendance} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resultados SIMCE por Área</h2>
          <SimceChart data={data.academic} />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resultados PISA</h2>
          <PisaChart data={data.academic} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles Académicos</h2>
        <AcademicChart data={data.academic} />
      </div>
    </div>
  );
};

export default DashboardPage;