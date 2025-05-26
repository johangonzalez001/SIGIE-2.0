import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, School, GraduationCap, Calendar, User } from 'lucide-react';
import { Student } from '../../../types';

interface StudentSearchModalProps {
  students: Student[];
  loading: boolean;
  initialSearchTerm?: string;
  onClose: () => void;
  onStudentSelected: (student: Student) => void;
}

const StudentSearchModal: React.FC<StudentSearchModalProps> = ({ 
  students, 
  loading, 
  initialSearchTerm = '', 
  onClose, 
  onStudentSelected 
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [searchResults, setSearchResults] = useState<Student[]>([]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, students]);

  const performSearch = () => {
    const filteredStudents = students.filter(student =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setSearchResults(filteredStudents.slice(0, 50)); // Limitar a 50 resultados para mejor rendimiento
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Búsqueda Global de Estudiantes
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, apellido, RUT o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : searchTerm.length < 2 ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                  <p>Ingrese al menos 2 caracteres para buscar</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                  <p>No se encontraron estudiantes que coincidan con "{searchTerm}"</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {searchResults.map((student) => (
                    <div 
                      key={student.id}
                      onClick={() => onStudentSelected(student)}
                      className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg flex justify-between items-start"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-800 font-medium text-sm">
                            {student.first_name[0]}
                            {student.last_name[0]}
                          </span>
                        </div>
                        
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                          
                          <div className="text-xs text-gray-500 mt-1">
                            <div className="flex items-center">
                              <User className="h-3.5 w-3.5 mr-1 inline" />
                              <span>{student.rut}</span>
                            </div>
                            
                            {student.course && (
                              <div className="flex items-center mt-1">
                                <GraduationCap className="h-3.5 w-3.5 mr-1 inline" />
                                <span>{student.course.name} {student.course.level}</span>
                              </div>
                            )}
                            
                            {student.course?.school && (
                              <div className="flex items-center mt-1">
                                <School className="h-3.5 w-3.5 mr-1 inline" />
                                <span>{student.course.school.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <span
                        className={`px-2 py-1 text-xs leading-none font-semibold rounded-full ${
                          student.status === 'Activo'
                            ? 'bg-green-100 text-green-800'
                            : student.status === 'Egresado'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {student.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {searchResults.length > 0 && 
                  `Mostrando ${Math.min(searchResults.length, 50)} ${searchResults.length === 1 ? 'resultado' : 'resultados'}`
                }
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSearchModal;