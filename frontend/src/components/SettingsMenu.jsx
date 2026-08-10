import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SettingsMenu({ profilePath, settingsPath }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-teal-700 text-white"
        title="Settings"
      >
        ⚙️
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg border z-50 overflow-hidden">
          <Link to={profilePath} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50">
            My Profile
          </Link>
          <Link to={settingsPath} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 border-t">
            Change Password
          </Link>
        </div>
      )}
    </div>
  );
}