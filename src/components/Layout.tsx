import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flag, TrendingUp, RotateCcw } from 'lucide-react';
import { getRankedLaps } from '../utils/storage';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const startNewSession = () => {
    // We don't clear localStorage to maintain the ranking
    // Just redirect to home page
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-racing-black border-b border-racing-gray">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Flag className="text-f1-red" size={24} />
            <h1 className="text-xl font-bold">Formula Racing Simulator</h1>
          </div>
          
          {!isHomePage && (
            <div className="flex gap-4">
              <Link 
                to="/ranking" 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-racing-gray hover:bg-gray-700 transition-colors"
              >
                <TrendingUp size={16} />
                <span className="hidden sm:inline">Ranking</span>
              </Link>
              
              <button 
                onClick={startNewSession}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-racing-gray hover:bg-gray-700 transition-colors"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Nova Sessão</span>
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-racing-black border-t border-racing-gray py-4 text-center text-gray-400 text-sm">
        <div className="container mx-auto px-4">
          <p>Formula Racing Emissions Simulator &copy; 2025</p>
          <p className="mt-1">
            {getRankedLaps().length > 0 && (
              <span>Total de voltas registradas: {getRankedLaps().length}</span>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;