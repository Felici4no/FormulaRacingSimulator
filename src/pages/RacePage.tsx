import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, ArrowRight } from 'lucide-react';

const RacePage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [animating, setAnimating] = useState(false);
  
  useEffect(() => {
    // Get current user from sessionStorage
    const userDataString = sessionStorage.getItem('currentUser');
    if (!userDataString) {
      // If no user data, redirect to registration
      navigate('/');
      return;
    }
    
    const userData = JSON.parse(userDataString);
    setUserName(userData.name);
  }, [navigate]);
  
  const handleRace = () => {
    setAnimating(true);
    
    // Simulate race start animation
    setTimeout(() => {
      navigate('/lap');
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-shadow">
          Hora de correr!
        </h1>
        {userName && (
          <p className="text-xl text-gray-300">
            Bem-vindo(a), <span className="text-f1-red font-semibold">{userName}</span>!
          </p>
        )}
      </div>
      
      <div className="racing-card card-f1 mb-8">
        <div className="flex justify-center mb-4">
          <Flag className="text-f1-red" size={64} />
        </div>
        
        <p className="mb-6 text-lg">
          Prepare-se para testar suas habilidades na pista e descobrir o impacto ambiental da sua corrida!
        </p>
        
        <button 
          onClick={handleRace} 
          className={`racing-btn-red w-full flex items-center justify-center gap-2 ${animating ? 'animate-pulse' : ''}`}
          disabled={animating}
        >
          <span>Correr</span>
          <ArrowRight size={20} />
        </button>
      </div>
      
      <div className="racing-card card-fe">
        <h3 className="font-bold mb-2 flex items-center gap-2 justify-center">
          <Flag className="text-fe-green" size={20} /> 
          <span>Você sabia?</span>
        </h3>
        <p className="text-sm">
          Um carro de Fórmula E emite até <span className="text-fe-green font-bold">98% menos</span> CO₂ 
          por volta quando comparado a um carro de Fórmula 1.
        </p>
      </div>
    </div>
  );
};

export default RacePage;