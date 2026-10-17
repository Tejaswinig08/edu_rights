import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

// ==========================================
// ADMIN ROUTE
// Guards routes that require admin role.
// - Not authenticated  → /login
// - Authenticated but not admin → /dashboard
// - Admin → render children
// ==========================================

function AdminRoute({ children }) {

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default AdminRoute;
