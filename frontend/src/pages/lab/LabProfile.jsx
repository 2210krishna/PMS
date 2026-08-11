import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function LabProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    axiosClient.get("/lab/profile/me")
      .then((r) => setProfile(r.data))
      .catch(() => showToast("Failed to load profile", "error"));
  };

  useEffect(load, []);

  const startEdit = () => {
    setForm({ phone: profile.phone || "", location: profile.location || "" });
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.put("/lab/profile/me", form);
      showToast("Profile updated", "success");
      setEditing(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        {!editing && (
          <button onClick={startEdit} className="border border-teal-700 text-teal-700 hover:bg-teal-50 text-sm px-4 py-1.5 rounded-md">
            Edit
          </button>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-6">Your lab technician account details.</p>

      {!editing ? (
        <div className="bg-white rounded-xl shadow-sm border p-6 grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <Info label="Full Name" value={profile.fullName} />
          <Info label="Email" value={profile.email} />
          <Info label="Phone" value={profile.phone || "Not set"} />
          <Info label="Location" value={profile.location || "Not set"} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 max-w-md">
          <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500" />

          <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
          <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500" />

          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md flex-1 disabled:opacity-50">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="border px-4 py-2 rounded-md text-gray-600">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
}