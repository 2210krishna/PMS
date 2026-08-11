import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LabCompleteProfile() {
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.put("/lab/profile/me", { phone, location });
      refreshUser({ labProfileCompleted: true });
      showToast("Profile completed", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border w-full max-w-sm">
        <h1 className="text-2xl font-bold text-teal-800 mb-1">Complete Your Profile</h1>
        <p className="text-gray-500 text-sm mb-6">A few details before you can start attaching lab reports.</p>

        <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
        <input required value={phone} onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500" />

        <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
        <input required value={location} onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500" />

        <button type="submit" disabled={loading}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-md font-semibold disabled:opacity-50">
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
}