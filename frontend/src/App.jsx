import React from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <Home />
      <footer className="footer">
        <p>Student Tech Recommender &bull; Phase 1: Project Initialization &bull; Full-Stack AI Architecture</p>
      </footer>
    </div>
  );
}

export default App;
