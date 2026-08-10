import { Outlet } from "react-router-dom";
import SidebarLayout from "../../components/SidebarLayout";

const links = [
  { to: "/patient", label: "My Profile", end: true },
  { to: "/patient/qr", label: "My QR Code" },
  { to: "/patient/book", label: "Book Appointment" },
  { to: "/patient/appointments", label: "My Appointments" },
  { to: "/patient/history", label: "Prescriptions" },
];

export default function PatientLayout() {
  return (
    <SidebarLayout title="Patient Portal" links={links} profilePath="/patient" settingsPath="/patient/settings">
      <Outlet />
    </SidebarLayout>
  );
}