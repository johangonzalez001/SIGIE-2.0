import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, School, GraduationCap, Users, AlertCircle } from 'lucide-react';
import { Student, School as SchoolType, Course } from '../../types';
import { fetchSchools, fetchSchoolCourses, fetchCourseStudents } from '../../services/schoolService';
import { deleteStudent } from '../../services/studentService';
import { checkSupabaseConnection } from '../../lib/supabase';
import StudentModal from './StudentModal';

const ITEMS_PER_PAGE = 10;

const StudentsPage: React.FC = () => {
  // Estados para la jerarquía: Establecimiento > Curso > Estudiantes
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Estados para la interfaz
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  // Estado para la conexión a Supabase
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
      setLoadingError(null);
      const data = await fetchSchools();
      setSchools(data);
      
      // Si solo hay un establecimiento, seleccionarlo automáticamente
      if (data.length === 1) {
        setSelectedSchool(data[0]);
      }
    } catch (error) {
      console.error('Error al cargar establecimientos:', error);
      setLoadingError(error instanceof Error ? error.message : 'Error al cargar establecimientos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar cursos cuando se selecciona un establecimiento
  useEffect(() => {
    if (selectedSchool) {
      loadCourses(selectedSchool.id);
      setSelectedCourse(null);
      setStudents([]);
    }
  }, [selectedSchool]);

  // Cargar estudiantes cuando se selecciona un curso
  useEffect(() => {
    if (selectedCourse) {
      loadStudents(selectedCourse.id);
    }
  }, [selectedCourse]);

  // Función para cargar cursos de un establecimiento
  const loadCourses = async (schoolId: number) => {
    try {
      setLoading(true);
      setLoadingError(null);
      const data = await fetchSchoolCourses(schoolId);
      setCourses(data);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      setLoadingError(error instanceof Error ? error.message : 'Error al cargar cursos');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar estudiantes de un curso
  const loadStudents = async (courseId: number) => {
    try {
      setLoading(true);
      setLoadingError(null);
      const data = await fetchCourseStudents(courseId);
      setStudents(data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      setLoadingError(error instanceof Error ? error.message : 'Error al cargar estudiantes');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode: 'create' | 'edit', student?: Student) => {
    setModalMode(mode);
    setCurrentStudent(student || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentStudent(null);
  };

  const handleDeleteStudent = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      try {
        setIsDeleting(true);
        setDeleteError(null);
        setDeleteSuccess(null);
        
        await deleteStudent(id);
        
        // Mostrar mensaje de éxito
        setDeleteSuccess('Estudiante eliminado correctamente');
        
        // Recargar la lista de estudiantes si tenemos un curso seleccionado
        if (selectedCourse) {
          await loadStudents(selectedCourse.id);
        }
        
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setDeleteSuccess(null);
        }, 3000);
      } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        setDeleteError(error instanceof Error ? error.message : 'Error al eliminar el estudiante');
        setTimeout(() => setDeleteError(null), 5000);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Filtrar estudiantes por término de búsqueda
  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginación
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Si hay un error de conexión con Supabase, mostrar un mensaje
  if (!connectionStatus.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
          <p className="text-gray-500 mt-1">Gestión de estudiantes por establecimiento y curso</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 mr-2" />
            <div>
              <h2 className="text-xl font-semibold text-red-800">Error de conexión a la base de datos</h2>
              <p className="text-red-700 mt-2">{connectionStatus.error || 'No se pudo conectar con la base de datos Supabase. Verifique su conexión y las credenciales de acceso.'}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded border border-red-200 text-sm mt-4">
            <p className="mb-2 font-medium">Verifique lo siguiente:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Que las variables de entorno estén correctamente configuradas en el archivo <code>.env</code></li>
              <li>Que su proyecto Supabase esté activo y accesible</li>
              <li>Que las tablas necesarias existan en su base de datos</li>
              <li>Que las políticas RLS estén correctamente configuradas</li>
            </ul>
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

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
            <p className="text-gray-500 mt-1">Gestión de estudiantes por establecimiento y curso</p>
          </div>
          
          {selectedCourse && (
            <button
              onClick={() => handleOpenModal('create')}
              className="flex items-center px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Agregar Estudiante
            </button>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar estudiante por nombre, RUT, correo o curso..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Mensajes de error y éxito */}
      {loadingError && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
            <div>
              <p className="font-medium">Error</p>
              <p>{loadingError}</p>
            </div>
          </div>
          <button 
            onClick={() => selectedCourse ? loadStudents(selectedCourse.id) : loadSchools()}
            className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Reintentar
          </button>
        </div>
      )}

      {deleteError && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md border border-red-200">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
            <div>
              <p className="font-medium">Error al eliminar estudiante</p>
              <p>{deleteError}</p>
            </div>
          </div>
        </div>
      )}

      {deleteSuccess && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md border border-green-200">
          <p className="font-medium">{deleteSuccess}</p>
        </div>
      )}

      {/* Selector de Establecimiento */}
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

      {/* Selector de Curso (visible solo si hay un establecimiento seleccionado) */}
      {selectedSchool && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Cursos de {selectedSchool.name}</h2>
            </div>
            <button 
              onClick={() => setSelectedSchool(null)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Cambiar establecimiento
            </button>
          </div>
          
          {loading && !selectedCourse ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No hay cursos disponibles para este establecimiento</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
              {courses.map(course => (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`border p-4 rounded-lg cursor-pointer transition-all ${
                    selectedCourse?.id === course.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{course.name}</div>
                    <div className="text-sm text-gray-600">{course.level}</div>
                    <div className="text-xs text-gray-500 mt-1">{course.year}</div>
                    {course.teacher && (
                      <div className="text-xs text-gray-500 mt-2">
                        Prof. {course.teacher.first_name} {course.teacher.last_name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lista de Estudiantes (visible solo si hay un curso seleccionado) */}
      {selectedCourse && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Estudiantes de {selectedCourse.name} {selectedCourse.level} {selectedCourse.year}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedCourse(null)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Cambiar curso
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No hay estudiantes en este curso</p>
              <button
                onClick={() => handleOpenModal('create')}
                className="mt-4 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800"
              >
                Agregar estudiante
              </button>
            </div>
          ) : (
            <>
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
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedStudents.map((student) => (
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
                              <div className="text-sm text-gray-500">
                                {student.gender === 'M'
                                  ? 'Masculino'
                                  : student.gender === 'F'
                                  ? 'Femenino'
                                  : 'Otro'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.rut}
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenModal('edit', student)}
                              className="text-yellow-600 hover:text-yellow-900"
                              disabled={isDeleting}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Mostrando {startIndex + 1} a {Math.min(startIndex + ITEMS_PER_PAGE, filteredStudents.length)} de {filteredStudents.length} registros
                    </div>
                    <div className="flex space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {modalOpen && (
        <StudentModal
          mode={modalMode}
          student={currentStudent}
          onClose={handleCloseModal}
          onSave={() => {
            if (selectedCourse) {
              loadStudents(selectedCourse.id);
            }
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
};

export default StudentsPage;