import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user || !roles.includes(user?.role)) {
    return <Navigate to="/accessdenied" replace />;
  }
  return children;
};

export default ProtectedRoute;
