import { Outlet } from "react-router-dom";
import SidebarLayout from "../../components/SidebarLayout";

const links = [
  { to: "/admin", label: "Analytics & Alerts", end: true },
  { to: "/admin/patients", label: "Patient Verification" },
  { to: "/admin/doctors", label: "Manage Doctors" },
  { to: "/admin/departments", label: "Departments" },
  { to: "/admin/users", label: "All Users" },
  { to: "/admin/settings", label: "Change Password" },
];

export default function AdminLayout() {
  return (
    <SidebarLayout title="Admin Portal" links={links}>
      <Outlet />
    </SidebarLayout>
  );
}