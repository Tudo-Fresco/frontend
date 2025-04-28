import { Navigate, Outlet } from 'react-router-dom';
import { hasAccess } from '../services/AuthService';
import { UserAccess } from '../enums/UserAccess';

interface ProtectedRouteProps {
  allowedRoles: UserAccess[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  return hasAccess(allowedRoles) ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;