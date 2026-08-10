import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientCompleteProfile from "./pages/PatientCompleteProfile";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorCompleteProfile from "./pages/DoctorCompleteProfile";
import ChangePassword from "./pages/ChangePassword";

import PatientLayout from "./pages/patient/PatientLayout";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientQr from "./pages/patient/PatientQr";
import PatientHistory from "./pages/patient/PatientHistory";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientBookAppointment from "./pages/patient/PatientBookAppointment";

import DoctorLayout from "./pages/doctor/DoctorLayout";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorDirectory from "./pages/doctor/DoctorDirectory";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminUsers from "./pages/admin/AdminUsers";


import AdminTodayAppointments from "./pages/admin/AdminTodayAppointments";
import AdminProfile from "./pages/admin/AdminProfile";
import DoctorProfile from "./pages/doctor/DoctorProfile";

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "PATIENT") return <Navigate to="/patient" replace />;
  if (user.role === "DOCTOR") return <Navigate to="/doctor" replace />;
  return <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardRouter />} />

            <Route path="/doctor/complete-profile" element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}><DoctorCompleteProfile /></ProtectedRoute>
            } />
                      <Route path="/patient/complete-profile" element={
            <ProtectedRoute allowedRoles={["PATIENT"]}><PatientCompleteProfile /></ProtectedRoute>
          } />

            <Route path="/patient" element={
              <ProtectedRoute allowedRoles={["PATIENT"]}><PatientLayout /></ProtectedRoute>
            }>
              <Route index element={<PatientProfile />} />
              <Route path="qr" element={<PatientQr />} />
              <Route path="book" element={<PatientBookAppointment />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="history" element={<PatientHistory />} />
              <Route path="settings" element={<ChangePassword />} />
            </Route>

            <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={["DOCTOR", "ADMIN"]}><DoctorLayout /></ProtectedRoute>
            }>
            <Route index element={<DoctorPatients />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="directory" element={<DoctorDirectory />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="settings" element={<ChangePassword />} />
          </Route>

            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}><AdminLayout /></ProtectedRoute>
            }>
              <Route index element={<AdminAnalytics />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="departments" element={<AdminDepartments />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<ChangePassword />} />
              <Route path="today" element={<AdminTodayAppointments />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}