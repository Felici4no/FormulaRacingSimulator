import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Medal, Clock, Users, Download } from 'lucide-react';
import { LapRecord } from '../types';
import { getRankedLaps } from '../utils/storage';
import { formatTime, getEnvironmentalImpact } from '../utils/calculations';
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Ranking: React.FC = () => {
  const [rankedLaps, setRankedLaps] = useState<LapRecord[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const navigate = useNavigate();
  
  useEffect(() => {
    const laps = getRankedLaps();
    setRankedLaps(laps);
  }, []);
  
  const handleBack = () => {
    const hasCurrentLap = sessionStorage.getItem('currentLap');
    if (hasCurrentLap) {
      navigate('/results');
    } else {
      navigate('/');
    }
  };
  
  const getMedalColor = (index: number): string => {
    switch (index) {
      case 0: return 'text-yellow-400';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-600';
      default: return 'text-white';
    }
  };

  const downloadJSON = () => {
    try {
      const dataStr = JSON.stringify(rankedLaps, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'corridas.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    }
  };

  const chartData = rankedLaps.map((lap, index) => ({
    name: lap.name,
    tempo: lap.time,
    posicao: index + 1
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-shadow">Ranking</h1>
        <div className="flex gap-4">
          <button 
            onClick={downloadJSON}
            className="racing-btn-green flex items-center justify-center gap-2"
          >
            <Download size={18} />
            <span>JSON</span>
          </button>
          
          <button 
            onClick={handleBack} 
            className="racing-btn-dark flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      {rankedLaps.length > 0 ? (
        <div className="space-y-6">
          <div className="racing-card card-f1">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Medal className="text-yellow-400" size={20} />
              <span>Melhores Tempos</span>
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-racing-gray">
                    <th className="py-2 px-4 text-left">#</th>
                    <th className="py-2 px-4 text-left">Piloto</th>
                    <th className="py-2 px-4 text-right">Tempo</th>
                    <th className="py-2 px-4 text-right hidden sm:table-cell">CO₂ Poupado</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedLaps.map((lap, index) => (
                    <tr key={index} className="border-b border-racing-black hover:bg-racing-black hover:bg-opacity-30 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-racing-black ${getMedalColor(index)}`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">{lap.name}</td>
                      <td className="py-3 px-4 text-right font-bold">{formatTime(lap.time)}</td>
                      <td className="py-3 px-4 text-right text-fe-green font-semibold hidden sm:table-cell">
                        {lap.difference.toFixed(2)} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="racing-card card-fe">
            <h2 className="text-xl font-bold mb-4">Análise de Tempos</h2>
            
            <div className="flex gap-2 mb-4">
              <button onClick={() => setChartType('line')} className={`racing-btn-dark ${chartType === 'line' ? 'bg-fe-green' : ''}`}>Linha</button>
              <button onClick={() => setChartType('bar')} className={`racing-btn-dark ${chartType === 'bar' ? 'bg-fe-green' : ''}`}>Barra</button>
              <button onClick={() => setChartType('area')} className={`racing-btn-dark ${chartType === 'area' ? 'bg-fe-green' : ''}`}>Área</button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' && (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip contentStyle={{ backgroundColor: '#2c2c2c', border: 'none' }} labelStyle={{ color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="tempo" name="Tempo (s)" stroke="#e10600" strokeWidth={2} />
                  </LineChart>
                )}
                {chartType === 'bar' && (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip contentStyle={{ backgroundColor: '#2c2c2c', border: 'none' }} labelStyle={{ color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="tempo" name="Tempo (s)" fill="#e10600" />
                  </BarChart>
                )}
                {chartType === 'area' && (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorTempo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e10600" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#e10600" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip contentStyle={{ backgroundColor: '#2c2c2c', border: 'none' }} labelStyle={{ color: '#fff' }} />
                    <Legend />
                    <Area type="monotone" dataKey="tempo" name="Tempo (s)" stroke="#e10600" fillOpacity={1} fill="url(#colorTempo)" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="racing-card card-fe">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-racing-black flex items-center justify-center">
                  <Users size={24} className="text-fe-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total de Pilotos</p>
                  <p className="text-2xl font-bold">
                    {new Set(rankedLaps.map(lap => lap.email)).size}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-racing-black flex items-center justify-center">
                  <Clock size={24} className="text-fe-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Voltas Completadas</p>
                  <p className="text-2xl font-bold">
                    {rankedLaps.length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-fe-green bg-opacity-10 rounded-lg border border-fe-green border-opacity-30">
              <span className="text-sm">{getEnvironmentalImpact(rankedLaps.length)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="racing-card card-f1 text-center">
          <Clock className="mx-auto text-f1-red mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Nenhuma volta registrada</h2>
          <p>Complete voltas para aparecer no ranking!</p>
        </div>
      )}
    </div>
  );
};

export default Ranking;
