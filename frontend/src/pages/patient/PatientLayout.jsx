import { Outlet } from "react-router-dom";
import SidebarLayout from "../../components/SidebarLayout";

const links = [
  { to: "/patient/book", label: "Book Appointment", end: true },
  { to: "/patient/appointments", label: "My Appointments" },
  { to: "/patient/history", label: "Prescriptions" },
];

const extraLinks = [
  { to: "/patient/qr", label: "My QR Code" },
];

export default function PatientLayout() {
  return (
    <SidebarLayout title="Patient Portal" links={links} profilePath="/patient" settingsPath="/patient/settings" extraLinks={extraLinks}>
      <Outlet />
    </SidebarLayout>
  );
}