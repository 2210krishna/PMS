import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import NotificationBell from "./NotificationBell";

export default function SidebarLayout({ title, links, children }) {
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
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-bold text-lg">HealthNest</span>
            <span className="text-xs text-teal-200 border-l border-teal-600 pl-3 hidden sm:inline">{title}</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition ${
                    isActive ? "bg-teal-600 text-white" : "text-teal-100 hover:bg-teal-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <NotificationBell />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-tight">{user?.fullName}</p>
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
                `px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition ${
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