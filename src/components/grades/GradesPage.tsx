import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { Grade } from '../../types';
import { fetchGrades, deleteGrade, createGrade, updateGrade } from '../../services/gradeService';
import GradeModal from './GradeModal';

const GradesPage: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<Grade | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      const data = await fetchGrades();
      setGrades(data);
    } catch (error) {
      console.error('Error al cargar notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode: 'create' | 'edit', grade?: Grade) => {
    setModalMode(mode);
    setCurrentGrade(grade || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentGrade(null);
  };

  const handleSaveGrade = async (grade: Grade) => {
    try {
      if (modalMode === 'create') {
        const newGrade = await createGrade(grade);
        setGrades(prev => [...prev, newGrade]);
      } else {
        const updatedGrade = await updateGrade(grade);
        setGrades(prev => prev.map(g => g.id === grade.id ? updatedGrade : g));
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar nota:', error);
    }
  };

  const handleDeleteGrade = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
      try {
        await deleteGrade(id);
        setGrades(prev => prev.filter(grade => grade.id !== id));
      } catch (error) {
        console.error('Error al eliminar nota:', error);
      }
    }
  };

  const filteredGrades = grades.filter(grade =>
    grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notas</h1>
          <p className="text-gray-500 mt-1">Gestiona las calificaciones de los estudiantes</p>
        </div>
        <button
          onClick={() => handleOpenModal('create')}
          className="flex items-center px-4 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Nota
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por estudiante o asignatura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="w-5 h-5 mr-2 text-gray-500" />
              Filtros
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
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
                    Asignatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semestre
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{grade.studentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{grade.subjectName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{grade.score}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(grade.date).toLocaleDateString('es-CL')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{grade.semester}° Semestre</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenModal('edit', grade)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGrade(grade.id)}
                          className="text-red-600 hover:text-red-900"
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

      {modalOpen && (
        <GradeModal
          mode={modalMode}
          grade={currentGrade}
          onClose={handleCloseModal}
          onSave={handleSaveGrade}
        />
      )}
    </div>
  );
};

export default GradesPage;