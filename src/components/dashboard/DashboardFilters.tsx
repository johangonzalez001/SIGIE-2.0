import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { DashboardFilters } from '../../types';

interface DashboardFiltersProps {
  years: number[];
  schools: { id: number; name: string }[];
  levels: string[];
  filters: DashboardFilters;
  onFilterChange: (filters: DashboardFilters) => void;
}

const DashboardFiltersComponent: React.FC<DashboardFiltersProps> = ({
  years,
  schools,
  levels,
  filters,
  onFilterChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    onFilterChange({ ...filters, year });
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const schoolId = value === 'all' ? null : parseInt(value, 10);
    onFilterChange({ ...filters, schoolId });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value === 'all' ? null : e.target.value;
    onFilterChange({ ...filters, level });
  };

  const handleReset = () => {
    // Reset to defaults (use the first year in the list as default)
    const defaultYear = years.length > 0 ? years[years.length - 1] : new Date().getFullYear();
    onFilterChange({
      year: defaultYear,
      schoolId: null,
      level: null,
      subject: null
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
        >
          <Filter className="h-5 w-5 mr-2" />
          <span>Filtros de Dashboard</span>
        </button>
        
        {isExpanded && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Restablecer
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100">
          <div>
            <label htmlFor="yearFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Año
            </label>
            <select
              id="yearFilter"
              value={filters.year}
              onChange={handleYearChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="schoolFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Establecimiento
            </label>
            <select
              id="schoolFilter"
              value={filters.schoolId || 'all'}
              onChange={handleSchoolChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los establecimientos</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="levelFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Nivel Educativo
            </label>
            <select
              id="levelFilter"
              value={filters.level || 'all'}
              onChange={handleLevelChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los niveles</option>
              {levels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFiltersComponent;