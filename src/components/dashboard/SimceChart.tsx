import React, { useState } from 'react';
import { AcademicKPI } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SimceChartProps {
  data: AcademicKPI;
}

const SimceChart: React.FC<SimceChartProps> = ({ data }) => {
  const [selectedSubjects, setSelectedSubjects] = useState<{
    language: boolean;
    math: boolean;
    science: boolean;
  }>({
    language: true,
    math: true,
    science: true
  });
  
  // Format SIMCE trend data to have exactly two decimal places
  const formattedTrendData = data.simceTrend.map(item => ({
    ...item,
    language: parseFloat(item.language.toFixed(2)),
    math: parseFloat(item.math.toFixed(2)),
    science: parseFloat(item.science.toFixed(2))
  }));
  
  const toggleSubject = (subject: keyof typeof selectedSubjects) => {
    setSelectedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="text-sm font-medium">Año: {label}</p>
          {payload.map((entry: any) => (
            <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'language' ? 'Lenguaje' : 
               entry.dataKey === 'math' ? 'Matemáticas' : 'Ciencias'}: {entry.value.toFixed(2)} pts
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => toggleSubject('language')}
          className={`px-3 py-1 text-xs rounded-full ${
            selectedSubjects.language 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          Lenguaje
        </button>
        <button
          onClick={() => toggleSubject('math')}
          className={`px-3 py-1 text-xs rounded-full ${
            selectedSubjects.math
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          Matemáticas
        </button>
        <button
          onClick={() => toggleSubject('science')}
          className={`px-3 py-1 text-xs rounded-full ${
            selectedSubjects.science
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          Ciencias
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedTrendData}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[220, 320]} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedSubjects.language && (
              <Line
                type="monotone"
                dataKey="language"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Lenguaje"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {selectedSubjects.math && (
              <Line
                type="monotone"
                dataKey="math"
                stroke="#10b981"
                strokeWidth={2}
                name="Matemáticas"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            {selectedSubjects.science && (
              <Line
                type="monotone"
                dataKey="science"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Ciencias"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="border-t border-gray-100 pt-3 mt-2">
        <div className="text-xs text-gray-500">
          <p>Los puntajes SIMCE son medidas estandarizadas que evalúan los logros de aprendizaje en diferentes asignaturas. El puntaje promedio nacional es de aproximadamente 250.00 puntos.</p>
        </div>
      </div>
    </div>
  );
};

export default SimceChart;