// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PlayfairCipherPage from './components/PlayfairCipherPage';
import About from './components/About';
import Profile from './components/Profile';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <div className="content">
          <Routes>
            <Route path="/" element={<PlayfairCipherPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>

        <nav className="bottom-nav">
          <ul>
            <li>
              <Link to="/">Playfair</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>
      </div>
    </Router>
  );
};

export default App;
