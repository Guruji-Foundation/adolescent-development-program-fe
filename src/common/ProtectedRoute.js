import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  // Show nothing while loading
  if (loading) {
    return null; // Or return a loading spinner component
  }

  // Check if user has required role
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/accessdenied" />;
  }

  return children;
};

export default ProtectedRoute;
