import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import About from './pages/About';
import SquatPage from './pages/exercises/SquatPage';
import Menubar from './components/Menubar';

function App() {
  return (
    <Router>
      <Menubar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/home" element={<Home />} />
        <Route path="/squat" element={<SquatPage />} />
      </Routes>
    </Router >
  );
}

export default App;
