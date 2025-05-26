import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Subject, Teacher } from '../../types';
import { createSubject, updateSubject } from '../../services/subjectService';

interface SubjectModalProps {
  mode: 'create' | 'edit';
  subject: Subject | null;
  teachers: Teacher[];
  onClose: () => void;
  onSave: () => void;
}

const initialSubject: Omit<Subject, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> = {
  name: '',
  code: '',
  description: '',
  teacher_id: 0
};

const SubjectModal: React.FC<SubjectModalProps> = ({ mode, subject, teachers, onClose, onSave }) => {
  const [formData, setFormData] = useState<any>(subject || initialSubject);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (subject) {
      setFormData(subject);
    }
  }, [subject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'teacher_id' ? (value ? parseInt(value, 10) : null) : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'El código es requerido';
    }
    
    if (!formData.teacher_id) {
      newErrors.teacher_id = 'El profesor es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      if (mode === 'create') {
        await createSubject(formData);
      } else if (subject?.id) {
        await updateSubject(subject.id, formData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error al guardar asignatura:', error);
      setSaveError(error instanceof Error ? error.message : 'Error al guardar la asignatura.');
    } finally {
      setIsSaving(false);
    }
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
                {mode === 'create' ? 'Nueva Asignatura' : 'Editar Asignatura'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {saveError && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-800 text-sm">
                {saveError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Código <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                    ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Ejemplo: MAT101, LENG2, CS304
                </p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                    ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Profesor <span className="text-red-500">*</span>
                </label>
                <select
                  id="teacher_id"
                  name="teacher_id"
                  value={formData.teacher_id || ''}
                  onChange={handleChange}
                  className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                    ${errors.teacher_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Seleccionar profesor</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </select>
                {errors.teacher_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.teacher_id}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-70"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectModal;