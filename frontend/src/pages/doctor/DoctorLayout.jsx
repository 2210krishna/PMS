import { Outlet } from "react-router-dom";
import SidebarLayout from "../../components/SidebarLayout";

const links = [
  { to: "/doctor", label: "Patient Lookup", end: true },
  { to: "/doctor/appointments", label: "My Appointments" },
  { to: "/doctor/directory", label: "Doctor Directory" },
  { to: "/doctor/settings", label: "Change Password" },
];

export default function DoctorLayout() {
  return (
    <SidebarLayout title="Doctor Portal" links={links}>
      <Outlet />
    </SidebarLayout>
  );
}