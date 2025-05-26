import React, { useState } from 'react';
import { AttendanceKPI } from '../../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AttendanceChartProps {
  data: AttendanceKPI;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('month');
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-CL', { 
      day: '2-digit',
      month: 'short'
    }).format(date);
  };
  
  // Filtrar datos según el rango de tiempo seleccionado
  const filteredData = timeRange === 'week' 
    ? data.attendanceTrend.slice(-7) // Última semana
    : data.attendanceTrend;  // Mes completo
    
  // Format attendance rate to have exactly two decimal places
  const formattedData = filteredData.map(item => ({
    ...item,
    rate: parseFloat(item.rate.toFixed(2))
  }));
    
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="text-sm font-medium">{formatDate(label)}</p>
          <p className="text-sm text-blue-600">
            Asistencia: {payload[0].value.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'week' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Última semana
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 'month' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Mes completo
          </button>
        </div>
        
        <div className="text-sm font-medium text-blue-700">
          Promedio: {data.averageAttendanceRate.toFixed(2)}%
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={formatDate}
            />
            <YAxis 
              domain={[70, 100]} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(2)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Asistencia"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <p className="text-sm text-gray-700">Deserción:</p>
          </div>
          <p className="text-xl font-semibold text-red-600 mt-1">{data.dropoutRate.toFixed(2)}%</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <p className="text-sm text-gray-700">Retención:</p>
          </div>
          <p className="text-xl font-semibold text-green-600 mt-1">{data.retentionRate.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;