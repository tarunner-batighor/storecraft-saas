import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">
        যাচাই করা হচ্ছে (Authenticating)...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'super_admin' && user.role !== 'super_admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'store_admin' && user.role !== 'store_owner' && user.role !== 'store_staff' && user.role !== 'super_admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
