import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // Not authenticated → redirect to login
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Authenticated → allow access
  return children;
}