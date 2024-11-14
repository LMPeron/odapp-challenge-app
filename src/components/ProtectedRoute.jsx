// ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return;
  if (!isAuthenticated) return <Navigate to="/entrar" state={{ from: location }} replace />;
  return children;
};
