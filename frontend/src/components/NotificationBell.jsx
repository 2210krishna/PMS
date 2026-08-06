import { useEffect, useState, useRef } from "react";
import axiosClient from "../api/axiosClient";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const load = () => {
    axiosClient.get("/notifications/me").then((r) => setNotifications(r.data));
    axiosClient.get("/notifications/me/unread-count").then((r) => setUnread(r.data.count));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    await axiosClient.put("/notifications/me/read-all");
    load();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-teal-700 text-white"
        title="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <span className="font-semibold text-sm">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-teal-700 underline">Mark all read</button>
            )}
          </div>
          {notifications.length === 0 && (
            <p className="text-sm text-gray-400 px-4 py-6 text-center">No notifications yet.</p>
          )}
          {notifications.map((n) => (
            <div key={n.id} className={`px-4 py-3 text-sm border-b last:border-0 ${!n.read ? "bg-teal-50" : ""}`}>
              <p className="text-gray-700">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{n.createdAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}