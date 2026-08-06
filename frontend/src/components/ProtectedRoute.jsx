import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  const onCompleteProfilePage = location.pathname === "/doctor/complete-profile";

  if (user.role === "DOCTOR" && !user.doctorProfileCompleted && !onCompleteProfilePage) {
    return <Navigate to="/doctor/complete-profile" replace />;
  }

  return children;
}