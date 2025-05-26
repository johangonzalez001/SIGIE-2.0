import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Attendance } from '../../types';

interface AttendanceModalProps {
  mode: 'create' | 'edit';
  attendance: Attendance | null;
  onClose: () => void;
  onSave: (attendance: Attendance) => void;
}

const initialAttendance: Attendance = {
  id: 0,
  studentId: 0,
  studentName: '',
  subjectId: 0,
  subjectName: '',
  date: new Date().toISOString().split('T')[0],
  status: 'present',
  justification: ''
};

const AttendanceModal: React.FC<AttendanceModalProps> = ({ mode, attendance, onClose, onSave }) => {
  const [formData, setFormData] = useState<Attendance>(attendance || initialAttendance);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (attendance) {
      setFormData(attendance);
    }
  }, [attendance]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'El nombre del estudiante es requerido';
    }
    
    if (!formData.subjectName.trim()) {
      newErrors.subjectName = 'La asignatura es requerida';
    }
    
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {mode === 'create' ? 'Registrar Asistencia' : 'Editar Asistencia'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                    Estudiante
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                      ${errors.studentName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.studentName && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">
                    Asignatura
                  </label>
                  <input
                    type="text"
                    id="subjectName"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                      ${errors.subjectName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.subjectName && (
                    <p className="mt-1 text-sm text-red-600">{errors.subjectName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                      ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="present">Presente</option>
                    <option value="absent">Ausente</option>
                    <option value="late">Atrasado</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="justification" className="block text-sm font-medium text-gray-700 mb-1">
                  Justificación
                </label>
                <textarea
                  id="justification"
                  name="justification"
                  value={formData.justification}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ingrese la justificación si es necesaria..."
                />
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;