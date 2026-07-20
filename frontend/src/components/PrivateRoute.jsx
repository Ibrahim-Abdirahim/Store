import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protects pages that require login, and optionally checks a required role.
export default function PrivateRoute({ children, role }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Save the page the user wanted, then send them to login.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Some pages, like Admin, need a specific role.
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
