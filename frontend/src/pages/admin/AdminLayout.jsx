import { Outlet } from "react-router-dom";
import SidebarLayout from "../../components/SidebarLayout";

const links = [
  { to: "/admin", label: "Analytics & Alerts", end: true },
  { to: "/admin/today", label: "Today's Appointments" },
  { to: "/admin/patients", label: "Patient Verification" },
  { to: "/admin/doctors", label: "Manage Doctors" },
  { to: "/admin/departments", label: "Departments" },
  { to: "/admin/users", label: "All Users" },
];

export default function AdminLayout() {
  return (
    <SidebarLayout title="Admin Portal" links={links} profilePath="/admin/profile" settingsPath="/admin/settings">
      <Outlet />
    </SidebarLayout>
  );
}