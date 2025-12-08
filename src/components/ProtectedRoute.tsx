import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'superadmin' | 'viewer';
  requireSubscription?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole,
  requireSubscription = false 
}: ProtectedRouteProps) => {
  const { user, role, loading, hasActiveSubscription, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    if (requiredRole === 'superadmin' && !isSuperAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    if (requiredRole === 'admin' && !isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (requireSubscription && !hasActiveSubscription && !isAdmin) {
    return <Navigate to="/subscribe" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
