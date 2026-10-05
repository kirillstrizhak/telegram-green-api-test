import { Navigate, Outlet } from 'react-router';
import { loadAuth } from '../../features/auth/auth';

export function ProtectedRoute() {
  if (!loadAuth()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}