import { Outlet } from "react-router-dom";
import SidebarLayout from "../../components/SidebarLayout";

const links = [
  { to: "/lab", label: "Patient Lookup", end: true },
];

export default function LabLayout() {
  return (
    <SidebarLayout title="Lab Portal" links={links} profilePath="/lab/profile" settingsPath="/lab/settings">
      <Outlet />
    </SidebarLayout>
  );
}