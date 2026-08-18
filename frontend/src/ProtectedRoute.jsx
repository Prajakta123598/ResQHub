import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch (error) {
    console.error("Invalid user data in localStorage");
  }

  // ==========================================
  // USER IS NOT LOGGED IN
  // ==========================================

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // ==========================================
  // ADMIN-ONLY ROUTE PROTECTION
  // ==========================================

  if (adminOnly && user?.role !== "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // ==========================================
  // ACCESS GRANTED
  // ==========================================

  return children;
}

export default ProtectedRoute;