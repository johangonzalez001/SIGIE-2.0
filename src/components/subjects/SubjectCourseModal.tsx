import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Subject, Course } from '../../types';

interface SubjectCourseModalProps {
  course: Course;
  subjects: Subject[];
  onClose: () => void;
  onAssign: (subjectId: number) => void;
}

const SubjectCourseModal: React.FC<SubjectCourseModalProps> = ({ 
  course, 
  subjects, 
  onClose, 
  onAssign 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.teacher && 
      `${subject.teacher.first_name} ${subject.teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-4 mb-2 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Agregar Asignatura a {course.name} {course.level}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar asignatura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {filteredSubjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm 
                    ? `No se encontraron asignaturas que coincidan con "${searchTerm}"` 
                    : "No hay asignaturas disponibles para asignar"}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredSubjects.map(subject => (
                    <div 
                      key={subject.id}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                      onClick={() => onAssign(subject.id)}
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {subject.code}: {subject.name}
                        </div>
                        {subject.teacher && (
                          <div className="text-xs text-gray-500 mt-1">
                            Profesor: {subject.teacher.first_name} {subject.teacher.last_name}
                          </div>
                        )}
                        {subject.description && (
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                            {subject.description}
                          </div>
                        )}
                      </div>
                      <button 
                        className="p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                        title="Agregar esta asignatura al curso"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCourseModal;