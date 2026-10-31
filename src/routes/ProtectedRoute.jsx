import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Spinner from '../components/feedback/Spinner.jsx';

/**
 * Route Guard Wrapper for Protected & Role-Gated Views
 * Verifies user session and optional `roles` array before rendering children or <Outlet />
 */
export default function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F6F8FC]">
        <div className="fluent-card flex items-center gap-3 px-6 py-4">
          <Spinner size="md" variant="primary" />
          <span className="text-[14px] font-semibold text-[#474747]">
            Verifying your financial workspace...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (Array.isArray(roles) && roles.length > 0) {
    const userRole = user?.role || 'user';
    if (!roles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children ? children : <Outlet />;
}

