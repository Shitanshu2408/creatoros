import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const location = useLocation();

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  let user = null;

  try {
    user = userString ? JSON.parse(userString) : null;
  } catch {
    user = null;
  }

  const isAuthenticated = !!token && !!user;

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
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