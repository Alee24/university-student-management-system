import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects routes by ensuring the user is authenticated and optionally has
 * one of the allowed roles.  If not authenticated, redirects to the
 * login page.  If authenticated but not authorized, redirects to
 * dashboard based on role or shows a message.
 */
const ProtectedRoute = ({ roles }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    // If user is not allowed, redirect to their dashboard
    return <Navigate to={`/${user.role}`} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;