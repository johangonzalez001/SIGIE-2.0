import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  trend: number;
  invertTrend?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  invertTrend = false 
}) => {
  // Si invertTrend es true, un valor negativo de trend se considera positivo (bueno)
  // Por ejemplo, para la tasa de deserción, una disminución (trend negativo) es algo positivo
  const isPositiveTrend = invertTrend ? trend <= 0 : trend >= 0;
  
  // Format numerical values to have exactly two decimal places
  const formattedValue = typeof value === 'number' 
    ? value.toFixed(2) 
    : typeof value === 'string' && !isNaN(parseFloat(value)) && value.includes('.') 
      ? parseFloat(value).toFixed(2) 
      : value;
  
  // Format trend to have exactly two decimal places
  const formattedTrend = Math.abs(trend).toFixed(2);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{formattedValue}</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-50">
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <div className={`flex items-center text-sm ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
          {isPositiveTrend ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          <span>{formattedTrend}%</span>
        </div>
        <span className="text-gray-500 text-sm ml-2">vs. mes anterior</span>
      </div>
      
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
};

export default StatCard;