// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import PublicHome from './pages/PublicHome';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import CreateAddress from './pages/CreateAddress';
import { UserAccess } from './enums/UserAccess';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute allowedRoles={[UserAccess.STORE_OWNER, UserAccess.ADMIN]} />}>
            <Route path="/address" element={<CreateAddress />} />
          </Route>
          <Route path="/" element={<PublicHome />} />
          <Route path="*" element={<NotFound />} /> {/* <- Catch-all route */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
