import { Outlet } from "react-router-dom";
import SidebarLayout from "../../components/SidebarLayout";

const links = [
  { to: "/patient", label: "My Profile", end: true },
  { to: "/patient/qr", label: "My QR Code" },
  { to: "/patient/appointments", label: "Appointments" },
  { to: "/patient/history", label: "Visit History" },
  { to: "/patient/settings", label: "Change Password" },
];

export default function PatientLayout() {
  return (
    <SidebarLayout title="Patient Portal" links={links}>
      <Outlet />
    </SidebarLayout>
  );
}