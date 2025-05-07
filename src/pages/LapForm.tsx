import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { calculateEmissions, parseTime } from '../utils/calculations';
import { saveLap } from '../utils/storage';

const LapForm: React.FC = () => {
  const [lapTime, setLapTime] = useState('');
  const [completed, setCompleted] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const userDataString = sessionStorage.getItem('currentUser');
    if (!userDataString) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate lap time format
    if (!lapTime) {
      setError('Por favor, informe o tempo da volta.');
      return;
    }
    
    let timeInSeconds: number;
    
    // Check if input is in mm:ss.SSS format
    if (lapTime.includes(':')) {
      // Validate mm:ss.SSS format
      if (!/^\d{1,2}:\d{2}\.\d{1,3}$/.test(lapTime)) {
        setError('Formato de tempo inválido. Use mm:ss.SSS (ex: 1:30.091).');
        return;
      }
      timeInSeconds = parseTime(lapTime);
    } else {
      // Check if input is a valid number
      if (!/^\d+(\.\d+)?$/.test(lapTime)) {
        setError('Tempo inválido. Use segundos ou formato mm:ss.SSS.');
        return;
      }
      timeInSeconds = parseFloat(lapTime);
    }
    
    // Calculate emissions
    const { f1Emission, feEmission, difference } = calculateEmissions(completed);
    
    // Get current user
    const userData = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    // Create lap record
    const lapRecord = {
      userId: userData.userId || 'unknown',
      name: userData.name || 'Anonymous',
      email: userData.email || '',
      time: timeInSeconds,
      completed,
      emissionF1: f1Emission,
      emissionFE: feEmission,
      difference,
      date: new Date().toISOString()
    };
    
    // Save lap record
    saveLap(lapRecord);
    
    // Store current lap in sessionStorage
    sessionStorage.setItem('currentLap', JSON.stringify(lapRecord));
    
    // Navigate to results
    navigate('/results');
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-shadow">Registrar Volta</h1>
      
      <div className="racing-card card-f1">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="lapTime" className="block mb-2 flex items-center gap-2">
              <Clock size={18} />
              <span>Tempo da volta</span>
            </label>
            <input
              id="lapTime"
              type="text"
              value={lapTime}
              onChange={(e) => setLapTime(e.target.value)}
              className="racing-input"
              placeholder="Exemplo: 1:30.091 ou 90.091 (segundos)"
            />
            <div className="mt-1 text-sm text-gray-400">
              Formato: minutos:segundos.milissegundos (ex: 1:30.091) ou apenas segundos (ex: 90.091)
            </div>
          </div>
          
          <div className="mb-6">
            <span className="block mb-2">Completou a volta?</span>
            <div className="flex gap-4">
              <div
                className={`flex-1 p-4 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all ${
                  completed 
                    ? 'bg-fe-green bg-opacity-30 border-2 border-fe-green' 
                    : 'bg-racing-gray border-2 border-racing-gray hover:border-gray-500'
                }`}
                onClick={() => setCompleted(true)}
              >
                <CheckCircle size={20} className={completed ? 'text-fe-green' : 'text-gray-400'} />
                <span>Sim</span>
              </div>
              
              <div
                className={`flex-1 p-4 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all ${
                  !completed 
                    ? 'bg-f1-red bg-opacity-30 border-2 border-f1-red' 
                    : 'bg-racing-gray border-2 border-racing-gray hover:border-gray-500'
                }`}
                onClick={() => setCompleted(false)}
              >
                <XCircle size={20} className={!completed ? 'text-f1-red' : 'text-gray-400'} />
                <span>Não</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-f1-red bg-opacity-20 border border-f1-red text-white p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="racing-btn-red w-full flex items-center justify-center gap-2"
          >
            <span>Calcular emissão</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default LapForm;