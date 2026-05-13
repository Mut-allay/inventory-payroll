import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'outlet_manager' | 'staff')[];
  requireOutlet?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireOutlet = false 
}: ProtectedRouteProps) => {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access
  if (allowedRoles.length > 0 && userData && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Outlet requirement
  if (requireOutlet && !userData?.outletId && userData?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
