import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  const onDoctorCompletePage = location.pathname === "/doctor/complete-profile";
  if (user.role === "DOCTOR" && !user.doctorProfileCompleted && !onDoctorCompletePage) {
    return <Navigate to="/doctor/complete-profile" replace />;
  }

  const onPatientCompletePage = location.pathname === "/patient/complete-profile";
  if (user.role === "PATIENT" && !user.healthId && !onPatientCompletePage) {
    return <Navigate to="/patient/complete-profile" replace />;
  }

  return children;
}