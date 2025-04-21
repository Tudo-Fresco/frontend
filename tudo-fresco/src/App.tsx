// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import PublicHome from './pages/PublicHome';
import NotFound from './pages/NotFound';
import Register from './pages/Register';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PublicHome />} />
          {/* Add other routes here */}
          <Route path="*" element={<NotFound />} /> {/* <- Catch-all route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
