// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          {/* Add other routes here */}
          <Route path="*" element={<NotFound />} /> {/* <- Catch-all route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
