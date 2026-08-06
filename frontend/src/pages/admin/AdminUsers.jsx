import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const { showToast } = useToast();

  const load = () => axiosClient.get("/admin/users").then((r) => setUsers(r.data));
  useEffect(load, []);

  const toggleUser = async (id) => {
    try {
      await axiosClient.put(`/admin/users/${id}/toggle`);
      showToast("User status updated", "success");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update user", "error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">All Users</h1>
      <p className="text-gray-500 text-sm mb-6">Every account on the platform, across all roles.</p>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-800">{u.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 text-gray-600">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${u.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {u.enabled ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.role !== "ADMIN" ? (
                    <button onClick={() => toggleUser(u.id)} className="text-teal-700 text-xs underline">
                      {u.enabled ? "Disable" : "Enable"}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}