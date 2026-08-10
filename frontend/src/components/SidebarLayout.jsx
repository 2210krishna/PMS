import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import NotificationBell from "./NotificationBell";
import SettingsMenu from "./SettingsMenu";

export default function SidebarLayout({ title, links, children, profilePath, settingsPath }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-800 text-white print:hidden sticky top-0 z-40 shadow">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-bold text-lg whitespace-nowrap">HealthNest</span>
            <span className="text-xs text-teal-200 border-l border-teal-600 pl-3 hidden lg:inline whitespace-nowrap">{title}</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition shrink-0 ${
                    isActive ? "bg-teal-600 text-white" : "text-teal-100 hover:bg-teal-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <NotificationBell />
            <SettingsMenu profilePath={profilePath} settingsPath={settingsPath} />
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium leading-tight whitespace-nowrap">{user?.fullName}</p>
              <p className="text-xs text-teal-300 leading-tight">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-teal-900 hover:bg-black/30 text-white text-sm px-3 py-1.5 rounded-md whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition shrink-0 ${
                  isActive ? "bg-teal-600 text-white" : "text-teal-100 hover:bg-teal-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}