import React, { useState } from 'react';
import { EnrollmentKPI } from '../../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface EnrollmentChartProps {
  data: EnrollmentKPI;
}

const EnrollmentChart: React.FC<EnrollmentChartProps> = ({ data }) => {
  const [view, setView] = useState<'trend' | 'distribution'>('trend');
  
  // Format percentage values to have exactly two decimal places
  const distributionData = [
    { name: 'Prebásica', value: parseFloat(data.preBasicRate.toFixed(2)), fill: '#8884d8' },
    { name: 'Básica', value: parseFloat(data.basicRate.toFixed(2)), fill: '#82ca9d' },
    { name: 'Media', value: parseFloat(data.highSchoolRate.toFixed(2)), fill: '#ffc658' },
  ];

  // Format enrollment trend data to have exactly two decimal places
  const formattedTrendData = data.enrollmentTrend.map(item => ({
    ...item,
    count: parseFloat(item.count.toFixed(2))
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + '-01'); // Append day for full date
    return new Intl.DateTimeFormat('es-CL', { 
      month: 'short',
      year: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setView('trend')}
            className={`px-3 py-1 text-sm rounded-md ${
              view === 'trend' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tendencia
          </button>
          <button
            onClick={() => setView('distribution')}
            className={`px-3 py-1 text-sm rounded-md ${
              view === 'distribution' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Distribución
          </button>
        </div>
        
        <div className="text-sm font-medium text-blue-700">
          Total: {data.totalStudents.toFixed(2)} estudiantes
        </div>
      </div>

      {view === 'trend' ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedTrendData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={formatDate}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[(dataMin: number) => Math.max(0, dataMin * 0.95), (dataMax: number) => dataMax * 1.05]}
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)} estudiantes`, 'Matrícula']}
                labelFormatter={(label) => `Fecha: ${formatDate(label)}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorCount)" 
                name="Matrícula"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="space-y-4">
          {distributionData.map(item => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-semibold">{item.value.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${item.value}%`, 
                    backgroundColor: item.fill 
                  }}
                ></div>
              </div>
            </div>
          ))}
          
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cobertura Parvularia</span>
              <span className="text-sm font-semibold">{data.kindergartenCoverage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${data.kindergartenCoverage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentChart;