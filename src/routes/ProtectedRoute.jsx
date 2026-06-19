import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();

  // 1. Loading state (prevents early redirect bugs)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // 2. Not logged in → go home/login
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // 3. Normalize role (fixes "Student" vs "student" bug)
  const userRole = user?.role?.toLowerCase();

  const normalizedRequiredRole = Array.isArray(requiredRole)
    ? requiredRole.map((r) => r.toLowerCase())
    : requiredRole?.toLowerCase();

  const isAllowed =
    !requiredRole ||
    (Array.isArray(normalizedRequiredRole)
      ? normalizedRequiredRole.includes(userRole)
      : userRole === normalizedRequiredRole);

  // 4. If not allowed → safe fallback (NOT dashboard redirect loop)
  if (!isAllowed) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
}