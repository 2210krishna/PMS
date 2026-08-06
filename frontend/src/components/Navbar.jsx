import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-teal-700 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold">HealthNest</Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm opacity-90">
              {user.fullName} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-teal-900 hover:bg-teal-950 px-3 py-1.5 rounded text-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}