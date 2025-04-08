import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  // Show loading spinner while checking authentication
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  // If no token exists, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If we have user data and roles match, render the protected content
  if (user && (!roles || roles.includes(user.role))) {
    return children;
  }

  // If we get here, user is logged in but doesn't have the required role
  return <Navigate to="/accessdenied" replace />;
};

export default ProtectedRoute;
