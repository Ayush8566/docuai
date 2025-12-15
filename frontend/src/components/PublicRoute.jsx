import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function PublicRoute({ children }) {
  const { token } = useAuth();

  // If logged in → go to landing page
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
