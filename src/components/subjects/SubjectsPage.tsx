import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen, User, School, GraduationCap } from 'lucide-react';
import { Subject, Teacher, Course } from '../../types';
import { fetchSubjects, deleteSubject, assignSubjectToCourse, removeSubjectFromCourse, fetchCourseSubjects } from '../../services/subjectService';
import { fetchTeachers } from '../../services/teacherService';
import { fetchCourses } from '../../services/courseService';
import SubjectModal from './SubjectModal';
import SubjectCourseModal from './SubjectCourseModal';

const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseSubjects, setCourseSubjects] = useState<Subject[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingCourseSubjects, setLoadingCourseSubjects] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [courseSubjectModalOpen, setCourseSubjectModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSubjects();
    loadTeachers();
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseSubjects(selectedCourse.id);
    } else {
      setCourseSubjects([]);
    }
  }, [selectedCourse]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Error al cargar asignaturas:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar asignaturas');
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const data = await fetchTeachers();
      setTeachers(data);
    } catch (error) {
      console.error('Error al cargar profesores:', error);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      const data = await fetchCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadCourseSubjects = async (courseId: number) => {
    try {
      setLoadingCourseSubjects(true);
      const data = await fetchCourseSubjects(courseId);
      setCourseSubjects(data);
    } catch (error) {
      console.error('Error al cargar asignaturas del curso:', error);
    } finally {
      setLoadingCourseSubjects(false);
    }
  };

  const handleOpenSubjectModal = (mode: 'create' | 'edit', subject?: Subject) => {
    setModalMode(mode);
    setCurrentSubject(subject || null);
    setSubjectModalOpen(true);
  };

  const handleCloseSubjectModal = () => {
    setSubjectModalOpen(false);
    setCurrentSubject(null);
  };

  const handleOpenCourseSubjectModal = () => {
    if (!selectedCourse) {
      alert('Por favor, seleccione un curso primero');
      return;
    }
    setCourseSubjectModalOpen(true);
  };

  const handleCloseCourseSubjectModal = () => {
    setCourseSubjectModalOpen(false);
  };

  const handleSaveSubject = async () => {
    await loadSubjects();
    handleCloseSubjectModal();
    
    setSuccessMessage('Asignatura guardada correctamente');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteSubject = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta asignatura? Esta acción eliminará también todas las asociaciones con cursos.')) {
      try {
        setLoading(true);
        await deleteSubject(id);
        
        // Actualizar la lista de asignaturas
        await loadSubjects();
        
        // Si hay un curso seleccionado, actualizar sus asignaturas también
        if (selectedCourse) {
          await loadCourseSubjects(selectedCourse.id);
        }
        
        setSuccessMessage('Asignatura eliminada correctamente');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error('Error al eliminar asignatura:', error);
        setError(error instanceof Error ? error.message : 'Error al eliminar la asignatura');
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddSubjectToCourse = async (subjectId: number) => {
    if (!selectedCourse) return;
    
    try {
      setLoading(true);
      await assignSubjectToCourse(selectedCourse.id, subjectId);
      await loadCourseSubjects(selectedCourse.id);
      setCourseSubjectModalOpen(false);
      
      setSuccessMessage('Asignatura añadida al curso correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error al añadir asignatura al curso:', error);
      setError(error instanceof Error ? error.message : 'Error al añadir la asignatura al curso');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubjectFromCourse = async (subjectId: number) => {
    if (!selectedCourse) return;
    
    if (window.confirm('¿Estás seguro de que deseas quitar esta asignatura del curso? Esta acción no eliminará la asignatura del sistema.')) {
      try {
        setLoading(true);
        await removeSubjectFromCourse(selectedCourse.id, subjectId);
        await loadCourseSubjects(selectedCourse.id);
        
        setSuccessMessage('Asignatura removida del curso correctamente');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error('Error al quitar asignatura del curso:', error);
        setError(error instanceof Error ? error.message : 'Error al quitar la asignatura del curso');
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.teacher && 
      `${subject.teacher.first_name} ${subject.teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Obtener el profesor de una asignatura
  const getTeacherName = (teacherId?: number) => {
    if (!teacherId) return 'No asignado';
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'No encontrado';
  };

  // Función para determinar si una asignatura está asignada al curso seleccionado
  const isSubjectAssignedToCourse = (subjectId: number) => {
    return courseSubjects.some(subject => subject.id === subjectId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asignaturas</h1>
          <p className="text-gray-500 mt-1">Gestión de asignaturas y su asignación a cursos</p>
        </div>
        <button
          onClick={() => handleOpenSubjectModal('create')}
          className="flex items-center px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Asignatura
        </button>
      </div>

      {/* Mostrar mensajes de éxito o error */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                  Listado de Asignaturas
                </h2>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, código o profesor..."
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
            ) : filteredSubjects.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No se encontraron asignaturas.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profesor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubjects.map((subject) => (
                      <tr key={subject.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {subject.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subject.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subject.teacher ? `${subject.teacher.first_name} ${subject.teacher.last_name}` : getTeacherName(subject.teacher_id)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {subject.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenSubjectModal('edit', subject)}
                              className="text-yellow-600 hover:text-yellow-900 p-1 hover:bg-yellow-50 rounded"
                              title="Editar asignatura"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            {selectedCourse && (
                              <button
                                onClick={() => 
                                  isSubjectAssignedToCourse(subject.id)
                                    ? handleRemoveSubjectFromCourse(subject.id)
                                    : handleAddSubjectToCourse(subject.id)
                                }
                                className={`p-1 rounded ${
                                  isSubjectAssignedToCourse(subject.id)
                                    ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                    : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                }`}
                                title={isSubjectAssignedToCourse(subject.id) 
                                  ? `Quitar de ${selectedCourse.name} ${selectedCourse.level}` 
                                  : `Añadir a ${selectedCourse.name} ${selectedCourse.level}`}
                              >
                                {isSubjectAssignedToCourse(subject.id) ? (
                                  <Trash2 className="h-5 w-5" />
                                ) : (
                                  <Plus className="h-5 w-5" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteSubject(subject.id)}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                              title="Eliminar asignatura"
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
            )}
          </div>
        </div>
        
        {/* Panel lateral para seleccionar curso */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <School className="mr-2 h-5 w-5 text-blue-600" />
                Seleccionar Curso
              </h2>
            </div>
            
            <div className="p-4">
              {loadingCourses ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p>No hay cursos disponibles</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                  <p className="text-sm text-gray-500 mb-2">
                    Seleccione un curso para ver y gestionar sus asignaturas
                  </p>
                  
                  {courses.map(course => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`p-3 rounded-lg border cursor-pointer ${
                        selectedCourse?.id === course.id
                          ? 'bg-blue-50 border-blue-300'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <div className="font-medium">
                            {course.name} {course.level}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {course.school?.name || 'Sin establecimiento'} · {course.year}
                          </div>
                          {course.teacher && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              Prof. {course.teacher.first_name} {course.teacher.last_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {selectedCourse && (
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Asignaturas de {selectedCourse.name} {selectedCourse.level}
                </h3>
                
                {loadingCourseSubjects ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                  </div>
                ) : courseSubjects.length === 0 ? (
                  <div className="text-center py-2 text-gray-500 text-sm">
                    <p>No hay asignaturas asignadas</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {courseSubjects.map(subject => (
                      <div key={subject.id} className="p-2 border border-gray-200 rounded-md text-sm">
                        <div className="font-medium">{subject.name}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          <span className="font-medium">{subject.code}</span>
                          {subject.teacher && (
                            <div className="flex items-center mt-1">
                              <User className="h-3 w-3 mr-1" />
                              <span>{subject.teacher.first_name} {subject.teacher.last_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-center mt-4">
                  <button 
                    onClick={handleOpenCourseSubjectModal}
                    className="flex items-center justify-center w-full px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Asignatura
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {subjectModalOpen && (
        <SubjectModal
          mode={modalMode}
          subject={currentSubject}
          teachers={teachers}
          onClose={handleCloseSubjectModal}
          onSave={handleSaveSubject}
        />
      )}
      
      {courseSubjectModalOpen && selectedCourse && (
        <SubjectCourseModal
          course={selectedCourse}
          subjects={subjects.filter(subject => !isSubjectAssignedToCourse(subject.id))}
          onClose={handleCloseCourseSubjectModal}
          onAssign={handleAddSubjectToCourse}
        />
      )}
    </div>
  );
};

export default SubjectsPage;