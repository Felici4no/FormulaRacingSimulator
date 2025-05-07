import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LapRecord } from '../types';
import { ArrowLeft, TrendingUp, RotateCcw, Zap, Droplets, Leaf } from 'lucide-react';
import { formatTime, getEnvironmentalImpact } from '../utils/calculations';
import { getRankedLaps } from '../utils/storage';

const EmissionResults: React.FC = () => {
  const [lapData, setLapData] = useState<LapRecord | null>(null);
  const [completedLaps, setCompletedLaps] = useState<number>(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get current lap from sessionStorage
    const lapDataString = sessionStorage.getItem('currentLap');
    if (!lapDataString) {
      navigate('/lap');
      return;
    }
    
    const lapData = JSON.parse(lapDataString);
    setLapData(lapData);
    
    // Count completed laps for environmental impact message
    const rankedLaps = getRankedLaps();
    setCompletedLaps(rankedLaps.length);
  }, [navigate]);
  
  const handleNewLap = () => {
    navigate('/lap');
  };
  
  const viewRanking = () => {
    navigate('/ranking');
  };
  
  const startNewSession = () => {
    // Clear session data but keep localStorage
    sessionStorage.removeItem('currentLap');
    navigate('/');
  };

  if (!lapData) {
    return <div className="text-center">Carregando...</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-shadow">Resultados</h1>
      
      {lapData.completed ? (
        <div className="space-y-6">
          <div className="racing-card card-f1">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="text-f1-red" size={20} />
              <span>Resultados da sua volta</span>
            </h2>
            
            <div className="bg-racing-black bg-opacity-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span>Tempo:</span>
                <span className="text-xl font-bold">{formatTime(lapData.time)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span className="text-fe-green font-bold">Completada</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-f1-red bg-opacity-20 border border-f1-red">
                <div className="flex justify-between">
                  <span>Emissão F1:</span>
                  <span className="font-bold">{lapData.emissionF1.toFixed(2)} kg CO₂</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-fe-green bg-opacity-20 border border-fe-green">
                <div className="flex justify-between">
                  <span>Emissão Fórmula E:</span>
                  <span className="font-bold">{lapData.emissionFE.toFixed(2)} kg CO₂</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-racing-gray">
                <div className="flex justify-between">
                  <span>Diferença:</span>
                  <span className="font-bold text-fe-green">{lapData.difference.toFixed(2)} kg CO₂</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="racing-card card-fe">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Leaf className="text-fe-green" size={20} />
              <span>Impacto Ambiental</span>
            </h2>
            
            <p className="mb-4">
              Sua volta gerou <span className="text-f1-red font-bold">{lapData.emissionF1.toFixed(2)} kg</span> de CO₂. 
              Se fosse com um carro da Fórmula E, seria apenas 
              <span className="text-fe-green font-bold"> {lapData.emissionFE.toFixed(2)} kg</span>. 
            </p>
            
            <p className="text-fe-green font-bold">
              Você poderia ter poupado {lapData.difference.toFixed(2)} kg de CO₂!
            </p>
            
            {completedLaps > 0 && (
              <div className="mt-4 p-3 bg-fe-green bg-opacity-10 rounded-lg border border-fe-green border-opacity-30">
                <span className="text-sm">{getEnvironmentalImpact(completedLaps)}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="racing-card card-f1">
          <h2 className="text-xl font-bold mb-4">Volta não completada</h2>
          <p className="mb-4">
            Como a volta não foi completada, não houve cálculo de emissão de CO₂.
          </p>
          <div className="flex justify-center">
            <Droplets className="text-blue-400" size={48} />
          </div>
        </div>
      )}
      
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button 
          onClick={handleNewLap} 
          className="racing-btn-dark flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>Nova Volta</span>
        </button>
        
        <button 
          onClick={viewRanking} 
          className="racing-btn-green flex items-center justify-center gap-2"
        >
          <TrendingUp size={18} />
          <span>Ranking</span>
        </button>
        
        <button 
          onClick={startNewSession} 
          className="racing-btn-red flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          <span>Nova Sessão</span>
        </button>
      </div>
    </div>
  );
};

export default EmissionResults;