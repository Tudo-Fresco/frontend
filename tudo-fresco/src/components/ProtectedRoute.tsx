import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserAccess } from '../enums/UserAccess';

interface ProtectedRouteProps {
  allowedRoles: UserAccess[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { role, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const hasAccess = isAuthenticated && allowedRoles.includes(role);

  return hasAccess ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;