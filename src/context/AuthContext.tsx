import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccess } from '../enums/UserAccess';
import { getUserRoles } from '../services/AuthService';

interface AuthContextType {
  role: UserAccess;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserAccess>(UserAccess.GUEST);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = () => {
      try {
        const userRole = getUserRoles();
        setRole(userRole);
        setIsAuthenticated(userRole !== UserAccess.GUEST);
      } catch {
        setRole(UserAccess.GUEST);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRole();
  }, []);

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};