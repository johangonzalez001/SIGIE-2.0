import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, School, GraduationCap, Download, RefreshCw, Plus, User } from 'lucide-react';
import { Course, School as SchoolType, Student } from '../../types';
import { fetchSchools } from '../../services/schoolService';
import { fetchCourses } from '../../services/courseService';
import { fetchCourseStudents } from '../../services/schoolService';
import { checkSupabaseConnection } from '../../lib/supabase';

const CoursesPage: React.FC = () => {
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; error?: string }>({ success: true });

  // Verificar conexión a Supabase al iniciar
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const status = await checkSupabaseConnection();
        setConnectionStatus(status);
        
        // Si la conexión es exitosa, cargar establecimientos
        if (status.success) {
          loadSchools();
        }
      } catch (error) {
        console.error('Error al verificar conexión:', error);
        setConnectionStatus({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Error desconocido al conectar con Supabase' 
        });
      }
    };
    
    checkConnection();
  }, []);

  // Cargar establecimientos
  const loadSchools = async () => {
    try {
      setLoading(true);
      const data = await fetchSchools();
      setSchools(data);
      
      // Si solo hay un establecimiento, seleccionarlo automáticamente
      if (data.length === 1) {
        setSelectedSchool(data[0]);
      }
    } catch (error) {
      console.error('Error al cargar establecimientos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar cursos cuando se selecciona un establecimiento
  useEffect(() => {
    if (selectedSchool) {
      loadCourses();
    }
  }, [selectedSchool]);

  // Cargar estudiantes cuando se selecciona un curso
  useEffect(() => {
    if (selectedCourse) {
      loadCourseStudents(selectedCourse.id);
    } else {
      setStudents([]);
    }
  }, [selectedCourse]);

  // Función para cargar cursos
  const loadCourses = async () => {
    if (!selectedSchool) return;
    
    try {
      setLoading(true);
      const data = await fetchCourses();
      // Filtrar cursos por escuela seleccionada
      const schoolCourses = data.filter(course => course.school_id === selectedSchool.id);
      setCourses(schoolCourses);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar estudiantes de un curso
  const loadCourseStudents = async (courseId: number) => {
    try {
      setLoadingStudents(true);
      const data = await fetchCourseStudents(courseId);
      setStudents(data);
    } catch (error) {
      console.error('Error al cargar estudiantes del curso:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Filtrar cursos por término de búsqueda
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.teacher && 
      (`${course.teacher.first_name} ${course.teacher.last_name}`).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Función para escapar valores CSV
  const escapeCSV = (value: any): string => {
    if (value == null) return '';
    let stringValue = String(value);
    
    // Si contiene comas, comillas o saltos de línea, lo encerramos entre comillas
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      // Escapar comillas duplicándolas
      stringValue = stringValue.replace(/"/g, '""');
      // Envolver en comillas
      return `"${stringValue}"`;
    }
    
    return stringValue;
  };

  // Función para exportar un curso a CSV
  const handleExportCourseCsv = (course: Course) => {
    if (!course) return;

    // Cargar estudiantes del curso para exportar
    const loadAndExport = async () => {
      try {
        setLoadingStudents(true);
        const students = await fetchCourseStudents(course.id);
        
        if (students.length === 0) {
          alert('El curso no tiene estudiantes para exportar');
          return;
        }

        // Crear el contenido CSV
        const headers = ['RUT', 'Nombre', 'Apellido', 'Fecha de Nacimiento', 'Género', 'Email', 'Teléfono', 'Dirección', 'Estado'];
        
        // Agregar BOM para mejor compatibilidad con Excel
        const BOM = '\uFEFF';
        
        // Construir el contenido CSV con valores escapados adecuadamente
        let csvContent = BOM + headers.map(escapeCSV).join(',') + '\n';
        
        for (const student of students) {
          const rowData = [
            student.rut,
            student.first_name,
            student.last_name,
            student.birth_date,
            student.gender === 'M' ? 'Masculino' : student.gender === 'F' ? 'Femenino' : 'Otro',
            student.email || '',
            student.phone || '',
            student.address || '',
            student.status
          ].map(escapeCSV);
          
          csvContent += rowData.join(',') + '\n';
        }

        // Crear y descargar el archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Nombre del archivo con la información del curso
        const fileName = `${selectedSchool?.name || 'Colegio'} - ${course.name}${course.level} (${course.year}).csv`;
        link.setAttribute('download', fileName);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error al exportar curso:', error);
        alert('Error al exportar el curso');
      } finally {
        setLoadingStudents(false);
      }
    };

    loadAndExport();
  };

  // Función para exportar todos los cursos de un establecimiento
  const handleExportAllCoursesCsv = async () => {
    if (!selectedSchool) return;
    
    try {
      setLoading(true);
      
      // Para cada curso, obtener sus estudiantes
      const allStudentsByClass: Record<string, Student[]> = {};
      const coursesWithStudents: Course[] = [];
      
      for (const course of courses) {
        const students = await fetchCourseStudents(course.id);
        if (students.length > 0) {
          allStudentsByClass[course.id] = students;
          coursesWithStudents.push(course);
        }
      }
      
      if (coursesWithStudents.length === 0) {
        alert('No hay estudiantes para exportar en ningún curso');
        return;
      }
      
      // Crear un único archivo CSV con todos los estudiantes, agrupados por curso
      const headers = ['Curso', 'RUT', 'Nombre', 'Apellido', 'Fecha de Nacimiento', 'Género', 'Email', 'Teléfono', 'Dirección', 'Estado'];
      
      // Agregar BOM para mejor compatibilidad con Excel
      const BOM = '\uFEFF';
      
      // Construir el contenido CSV con valores escapados adecuadamente
      let csvContent = BOM + headers.map(escapeCSV).join(',') + '\n';
      
      for (const course of coursesWithStudents) {
        const students = allStudentsByClass[course.id] || [];
        
        // Añadir cada estudiante con la información del curso
        for (const student of students) {
          const rowData = [
            `${course.name} ${course.level} (${course.year})`,
            student.rut,
            student.first_name,
            student.last_name,
            student.birth_date,
            student.gender === 'M' ? 'Masculino' : student.gender === 'F' ? 'Femenino' : 'Otro',
            student.email || '',
            student.phone || '',
            student.address || '',
            student.status
          ].map(escapeCSV);
          
          csvContent += rowData.join(',') + '\n';
        }
      }
      
      // Crear y descargar el archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nombre del archivo con la información del establecimiento
      const fileName = `${selectedSchool.name} - Todos los cursos.csv`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error al exportar todos los cursos:', error);
      alert('Error al exportar los cursos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
          <p className="text-gray-500 mt-1">Gestión de cursos por establecimiento</p>
        </div>
        
        {selectedSchool && (
          <div className="flex space-x-2">
            <button
              onClick={handleExportAllCoursesCsv}
              className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              disabled={loading}
            >
              <Download className="w-5 h-5 mr-2" />
              Exportar CSV
            </button>
            <button
              onClick={loadCourses}
              className="flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              disabled={loading}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Actualizar
            </button>
          </div>
        )}
      </div>
      
      {/* Selector de establecimiento */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <School className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Seleccionar Establecimiento</h2>
        </div>
        
        {loading && !selectedSchool ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {schools.map(school => (
              <div 
                key={school.id}
                onClick={() => setSelectedSchool(school)}
                className={`border p-4 rounded-lg cursor-pointer transition-all ${
                  selectedSchool?.id === school.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <School className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{school.name}</h3>
                    <p className="text-sm text-gray-500">{school.city}</p>
                    {school.director_name && (
                      <p className="text-xs text-gray-500 mt-1">Director: {school.director_name}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {schools.length === 0 && !loading && (
              <div className="col-span-full py-8 text-center text-gray-500">
                <p>No se encontraron establecimientos.</p>
                <button 
                  onClick={loadSchools}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Reintentar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de cursos */}
      {selectedSchool && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Cursos de {selectedSchool.name}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedSchool(null)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Cambiar establecimiento
              </button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por nivel, nombre de curso o profesor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No se encontraron cursos que coincidan con su búsqueda.</p>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map(course => (
                <div key={course.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <div className="bg-blue-50 px-4 py-3 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold">
                          {course.name} {course.level}
                        </h3>
                      </div>
                      <div className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {course.year}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {course.teacher && (
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <User className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Prof. {course.teacher.first_name} {course.teacher.last_name}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <button 
                        onClick={() => setSelectedCourse(course)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Ver estudiantes
                      </button>
                      
                      <button
                        onClick={() => handleExportCourseCsv(course)}
                        className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium"
                        title="Exportar curso a CSV"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Exportar CSV
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Estudiantes del curso seleccionado */}
      {selectedCourse && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Estudiantes de {selectedCourse.name} {selectedCourse.level} ({selectedCourse.year})
                </h2>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Volver a cursos
                </button>
                <button
                  onClick={() => handleExportCourseCsv(selectedCourse)}
                  className="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Exportar CSV
                </button>
              </div>
            </div>
          </div>

          {loadingStudents ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No hay estudiantes en este curso.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RUT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Género
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-800 font-medium text-sm">
                              {student.first_name[0]}
                              {student.last_name[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.first_name} {student.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.rut}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.gender === 'M'
                          ? 'Masculino'
                          : student.gender === 'F'
                          ? 'Femenino'
                          : 'Otro'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.email || '-'}</div>
                        <div className="text-sm text-gray-500">{student.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === 'Activo'
                              ? 'bg-green-100 text-green-800'
                              : student.status === 'Egresado'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;