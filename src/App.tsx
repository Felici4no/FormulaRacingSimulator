import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Registration from './pages/Registration';
import RacePage from './pages/RacePage';
import LapForm from './pages/LapForm';
import EmissionResults from './pages/EmissionResults';
import Ranking from './pages/Ranking';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/race" element={<RacePage />} />
          <Route path="/lap" element={<LapForm />} />
          <Route path="/results" element={<EmissionResults />} />
          <Route path="/ranking" element={<Ranking />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;