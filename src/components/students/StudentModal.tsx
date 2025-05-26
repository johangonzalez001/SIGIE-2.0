import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Student } from '../../types';
import { Course } from '../../types';
import { calculateVerificationDigit, formatRut, validateRut, cleanRutInput } from '../../utils/rutUtils';
import { createStudent, updateStudent, checkRutExists } from '../../services/studentService';
import { fetchCourses } from '../../services/courseService';

interface StudentModalProps {
  mode: 'create' | 'edit';
  student: Student | null;
  onClose: () => void;
  onSave: () => void;
}

const initialStudent: Omit<Student, 'id' | 'created_at' | 'updated_at'> = {
  rut: '',
  first_name: '',
  last_name: '',
  birth_date: '',
  gender: '',
  address: '',
  phone: '',
  email: '',
  course_id: undefined,
  status: 'Activo'
};

const StudentModal: React.FC<StudentModalProps> = ({ mode, student, onClose, onSave }) => {
  const [formData, setFormData] = useState<any>(student || initialStudent);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rutInput, setRutInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [previousStatus, setPreviousStatus] = useState<string>(student?.status || 'Activo');
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  useEffect(() => {
    if (student) {
      // Create a clean copy for the form
      const cleanStudent = {
        ...student,
        // Make sure we're using the ID, not the full object
        course_id: student.course_id || (student.course ? student.course.id : null)
      };
      console.log('Loading student for modal:', cleanStudent);
      setFormData(cleanStudent);
      setRutInput(student.rut);
      setPreviousStatus(student.status);
    }
  }, [student]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const data = await fetchCourses();
      console.log('Cursos cargados:', data); // Debugging
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = cleanRutInput(e.target.value);
    setRutInput(value);
    
    setFormData(prev => ({
      ...prev,
      rut: value
    }));
    
    if (errors.rut) {
      setErrors(prev => ({ ...prev, rut: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let newFormData = { ...formData };
    
    if (name === 'status') {
      newFormData.status = value;
      
      // Si cambia a "Retirado", eliminar el curso
      if (value === 'Retirado') {
        newFormData.course_id = null;
      }
    } else if (name === 'course_id') {
      // Handle course_id as a number or null
      newFormData.course_id = value ? Number(value) : null;
    } else {
      newFormData[name] = value;
    }
    
    setFormData(newFormData);
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Only validate these fields for new students or when they're being modified
    if (mode === 'create' || (mode === 'edit' && formData.status !== 'Retirado')) {
      if (!formData.rut) {
        newErrors.rut = 'El RUT es requerido';
      } else if (!validateRut(formData.rut)) {
        newErrors.rut = 'RUT inválido';
      }
      
      if (!formData.first_name) {
        newErrors.first_name = 'El nombre es requerido';
      }
      if (!formData.last_name) {
        newErrors.last_name = 'El apellido es requerido';
      }
      if (!formData.birth_date) {
        newErrors.birth_date = 'La fecha de nacimiento es requerida';
      }
      if (!formData.gender) {
        newErrors.gender = 'El género es requerido';
      }
      if (formData.status === 'Activo' && !formData.course_id) {
        newErrors.course_id = 'El curso es requerido para estudiantes activos';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSaving(true);
    setSaveMessage(null);
    
    try {
      // Format RUT before checking and saving
      const formattedRut = formatRut(formData.rut);
      
      // Check for duplicate RUT only when creating a new student
      // or when editing a student and the RUT has changed
      if (mode === 'create' || (mode === 'edit' && student?.rut !== formattedRut)) {
        const rutExists = await checkRutExists(formattedRut);
        if (rutExists) {
          setSaveMessage({
            type: 'error',
            text: 'El RUT ingresado ya está registrado en el sistema'
          });
          setSaving(false);
          return;
        }
      }
      
      // Clean up the data before sending to the server
      const cleanedData = {
        ...formData,
        rut: formattedRut,
        // Ensure course_id is a number or null, not a string
        course_id: formData.course_id ? Number(formData.course_id) : null,
        // Ensure address, phone, and email are not undefined
        address: formData.address || null,
        phone: formData.phone || null,
        email: formData.email || null
      };
      
      console.log('Datos a guardar:', cleanedData);

      if (mode === 'create') {
        await createStudent(cleanedData);
      } else if (student?.id) {
        await updateStudent(student.id, cleanedData);
      }
      
      setSaveMessage({
        type: 'success',
        text: `Estudiante ${mode === 'create' ? 'creado' : 'actualizado'} exitosamente`
      });
      
      // Wait a moment to show the success message before closing
      setTimeout(() => {
        onSave();
      }, 1500);
      
    } catch (error: any) {
      setSaveMessage({
        type: 'error',
        text: error.message || 'Error al guardar el estudiante. Por favor intente nuevamente.'
      });
      console.error('Error al guardar estudiante:', error);
    } finally {
      setSaving(false);
    }
  };

  // Organizar cursos por establecimiento para el selector
  const coursesBySchool = courses.reduce((acc: Record<string, Course[]>, course) => {
    const schoolName = course.school?.name || 'Sin establecimiento';
    if (!acc[schoolName]) {
      acc[schoolName] = [];
    }
    acc[schoolName].push(course);
    return acc;
  }, {});

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
                {mode === 'create' ? 'Nuevo Estudiante' : 'Editar Estudiante'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>

            {saveMessage && (
              <div className={`mb-4 p-4 rounded-md ${
                saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {saveMessage.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="rut" className="block text-sm font-medium text-gray-700">
                  RUT
                </label>
                <input
                  type="text"
                  id="rut"
                  name="rut"
                  value={rutInput}
                  onChange={handleRutChange}
                  maxLength={9}
                  placeholder="Ingrese RUT sin puntos ni guión"
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.rut ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.rut && (
                  <p className="mt-1 text-sm text-red-600">{errors.rut}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Formato: 12345678K (sin puntos ni guión)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    id="birth_date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.birth_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.birth_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Género
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="Activo">Activo</option>
                  <option value="Egresado">Egresado</option>
                  <option value="Retirado">Retirado</option>
                </select>
                {formData.status === 'Retirado' && previousStatus !== 'Retirado' && (
                  <p className="mt-1 text-xs text-red-600">
                    ¡Atención! Al cambiar el estado a "Retirado", el estudiante quedará sin asignación de curso.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="course_id" className="block text-sm font-medium text-gray-700">
                  Curso
                </label>
                <select
                  id="course_id"
                  name="course_id"
                  value={formData.course_id || ''}
                  onChange={handleChange}
                  disabled={formData.status === 'Retirado'}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.course_id ? 'border-red-500' : 'border-gray-300'
                  } disabled:opacity-50 disabled:bg-gray-100`}
                >
                  <option value="">Seleccionar curso...</option>
                  
                  {isLoadingCourses ? (
                    <option disabled>Cargando cursos...</option>
                  ) : (
                    Object.entries(coursesBySchool).map(([schoolName, schoolCourses]) => (
                      <optgroup key={schoolName} label={schoolName}>
                        {schoolCourses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name} {course.level} ({course.year}) {course.teacher ? `- Prof. ${course.teacher.last_name}` : ''}
                          </option>
                        ))}
                      </optgroup>
                    ))
                  )}
                </select>
                {errors.course_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>
                )}
                {formData.status === 'Retirado' && (
                  <p className="mt-1 text-xs text-gray-500">
                    No se puede asignar curso a estudiantes con estado "Retirado"
                  </p>
                )}
                {Object.keys(coursesBySchool).length === 0 && !isLoadingCourses && (
                  <p className="mt-1 text-xs text-yellow-600">
                    No se encontraron cursos. Por favor, verifique la conexión con la base de datos.
                  </p>
                )}
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;