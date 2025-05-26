import React, { useState } from 'react';
import { AcademicKPI } from '../../types';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PisaChartProps {
  data: AcademicKPI;
}

const PisaChart: React.FC<PisaChartProps> = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    data.pisaTrend.length > 0 ? data.pisaTrend[data.pisaTrend.length - 1].year : 2021
  );
  
  // Format PISA results to have exactly two decimal places
  const formattedPisaResults = {
    reading: parseFloat(data.pisaResults.reading.toFixed(2)),
    math: parseFloat(data.pisaResults.math.toFixed(2)),
    science: parseFloat(data.pisaResults.science.toFixed(2))
  };
  
  // Preparar datos para la vista de comparación
  const comparisonData = [
    {
      name: 'Lectura',
      Chile: formattedPisaResults.reading,
      OECD: 487.00,
      Latinoamérica: 408.00
    },
    {
      name: 'Matemáticas',
      Chile: formattedPisaResults.math,
      OECD: 489.00,
      Latinoamérica: 388.00
    },
    {
      name: 'Ciencias',
      Chile: formattedPisaResults.science,
      OECD: 489.00,
      Latinoamérica: 406.00
    }
  ];
  
  // Format PISA trend data to have exactly two decimal places
  const formattedPisaTrend = data.pisaTrend.map(item => ({
    ...item,
    reading: parseFloat(item.reading.toFixed(2)),
    math: parseFloat(item.math.toFixed(2)),
    science: parseFloat(item.science.toFixed(2))
  }));
  
  // Encontrar los datos del año seleccionado
  const selectedYearData = formattedPisaTrend.find(item => item.year === selectedYear) || formattedPisaTrend[formattedPisaTrend.length - 1];
  
  // Preparar datos para la vista de evolución histórica
  const historicalData = selectedYearData ? [
    { name: 'Lectura', puntaje: selectedYearData.reading },
    { name: 'Matemáticas', puntaje: selectedYearData.math },
    { name: 'Ciencias', puntaje: selectedYearData.science }
  ] : [];
  
  const [view, setView] = useState<'comparison' | 'historical'>('comparison');
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.dataKey} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)} pts
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const getBarFills = () => {
    return {
      Chile: '#3b82f6',    // Azul
      OECD: '#10b981',     // Verde
      Latinoamérica: '#f59e0b'  // Amarillo
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setView('comparison')}
            className={`px-3 py-1 text-sm rounded-md ${
              view === 'comparison' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Comparativo
          </button>
          <button
            onClick={() => setView('historical')}
            className={`px-3 py-1 text-sm rounded-md ${
              view === 'historical' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Por Año
          </button>
        </div>
        
        {view === 'historical' && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            {formattedPisaTrend.map((item) => (
              <option key={item.year} value={item.year}>
                {item.year}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'comparison' ? (
            <BarChart
              layout="vertical"
              data={comparisonData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                domain={[300, 550]} 
                tickFormatter={(value) => value.toFixed(2)}
              />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Chile" fill={getBarFills().Chile} />
              <Bar dataKey="OECD" fill={getBarFills().OECD} />
              <Bar dataKey="Latinoamérica" fill={getBarFills().Latinoamérica} />
            </BarChart>
          ) : (
            <BarChart
              data={historicalData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis 
                domain={[300, 550]} 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(2) + " pts", `PISA ${selectedYear}`]}
              />
              <Legend />
              <Bar 
                dataKey="puntaje" 
                fill="#3b82f6" 
                name={`PISA ${selectedYear}`}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="border-t border-gray-100 pt-3 mt-2">
        <div className="text-xs text-gray-500">
          <p>PISA (Programme for International Student Assessment) es un estudio realizado por la OECD que evalúa competencias en lectura, matemáticas y ciencias en estudiantes de 15 años.</p>
        </div>
      </div>
    </div>
  );
};

export default PisaChart;