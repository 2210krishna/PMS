import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useToast } from "../context/ToastContext";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords don't match", "error");
      return;
    }
    setLoading(true);
    try {
      await axiosClient.put("/auth/change-password", { currentPassword, newPassword });
      showToast("Password updated successfully", "success");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Change Password</h1>
      <p className="text-gray-500 text-sm mb-6">Update your account password.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 max-w-md">
        <label className="block text-sm font-medium mb-1 text-gray-700">Current Password</label>
        <input required type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500" />

        <label className="block text-sm font-medium mb-1 text-gray-700">New Password</label>
        <input required minLength={6} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500" />

        <label className="block text-sm font-medium mb-1 text-gray-700">Confirm New Password</label>
        <input required minLength={6} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500" />

        <button type="submit" disabled={loading}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-md font-semibold disabled:opacity-50">
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}