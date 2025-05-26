import React from 'react';
import { AcademicKPI } from '../../types';

interface AcademicChartProps {
  data: AcademicKPI;
}

const AcademicChart: React.FC<AcademicChartProps> = ({ data }) => {
  const maxScore = 500; // Assuming maximum SIMCE score is 500 for the progress bar
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">SIMCE: Puntajes Actuales</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Lenguaje</span>
                <span className="font-medium">{data.averageSimceScore.language.toFixed(2)} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(data.averageSimceScore.language / maxScore) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Matemáticas</span>
                <span className="font-medium">{data.averageSimceScore.math.toFixed(2)} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(data.averageSimceScore.math / maxScore) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Ciencias</span>
                <span className="font-medium">{data.averageSimceScore.science.toFixed(2)} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-yellow-600 h-2.5 rounded-full" 
                  style={{ width: `${(data.averageSimceScore.science / maxScore) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-md font-medium text-gray-700 mb-3">PAES</h3>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-purple-600 h-4 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${(data.averagePaesScore / 1000) * 100}%` }}
              >
                <span className="text-xs font-medium text-white">{data.averagePaesScore.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Promedio general en la Prueba de Acceso a la Educación Superior</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">PISA: Resultados Comparativos</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <span className="text-xs text-gray-500 block">Lectura</span>
              <p className="text-xl font-semibold text-blue-800 mt-1">{data.pisaResults.reading.toFixed(2)}</p>
              <span className="text-xs text-blue-600">OECD: 487.00</span>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <span className="text-xs text-gray-500 block">Matemática</span>
              <p className="text-xl font-semibold text-green-800 mt-1">{data.pisaResults.math.toFixed(2)}</p>
              <span className="text-xs text-green-600">OECD: 489.00</span>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <span className="text-xs text-gray-500 block">Ciencias</span>
              <p className="text-xl font-semibold text-yellow-800 mt-1">{data.pisaResults.science.toFixed(2)}</p>
              <span className="text-xs text-yellow-600">OECD: 489.00</span>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-md font-medium text-gray-700 mb-3">Análisis Comparativo</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">SIMCE vs. Promedio Nacional</span>
              <span className="text-sm font-medium text-green-600">+15.00 pts</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">PISA vs. Promedio Latinoamérica</span>
              <span className="text-sm font-medium text-green-600">+32.00 pts</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">PISA vs. Promedio OECD</span>
              <span className="text-sm font-medium text-red-600">-47.00 pts</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">PAES vs. Promedio Nacional</span>
              <span className="text-sm font-medium text-green-600">+76.00 pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicChart;