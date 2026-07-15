import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any page that requires login. Pass adminOnly to also require role==='admin'.
// Non-adminOnly pages (Dashboard, Careers, Profile, Recommendations) are for
// regular users only — if an admin lands here, bounce them to their dashboard.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={adminOnly ? "/admin-login" : "/login"} replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (!adminOnly && user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
