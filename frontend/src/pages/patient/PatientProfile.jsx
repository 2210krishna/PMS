import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    axiosClient.get("/patient/me")
      .then((res) => setProfile(res.data))
      .catch(() => showToast("Failed to load profile", "error"));
  };

  useEffect(load, []);

  const startEdit = () => {
    setForm({ phone: profile.phone, location: profile.location, bloodGroup: profile.bloodGroup });
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.put("/patient/me", form);
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

  const statusBanner = {
    PENDING: { text: "Your registration is pending admin verification. You cannot book appointments until you're verified.", cls: "bg-yellow-50 text-yellow-700 border-yellow-300" },
    VERIFIED: { text: "Your account is verified. You can book appointments at any participating clinic.", cls: "bg-green-50 text-green-700 border-green-300" },
    REJECTED: { text: "Your registration was rejected. Please contact an administrator.", cls: "bg-red-50 text-red-700 border-red-300" },
  }[profile.verificationStatus];

  return (
    <div>
      <div className="flex justify-between items-start mb-1 print:hidden">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <div className="flex gap-2">
          {!editing && (
            <button onClick={startEdit} className="border border-teal-700 text-teal-700 hover:bg-teal-50 text-sm px-4 py-1.5 rounded-md">
              Edit
            </button>
          )}
          <button onClick={() => window.print()} className="border border-teal-700 text-teal-700 hover:bg-teal-50 text-sm px-4 py-1.5 rounded-md">
            Print
          </button>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-6 print:hidden">Your registered health information.</p>

      {statusBanner && (
        <div className={`border rounded-lg p-3 text-sm mb-6 print:hidden ${statusBanner.cls}`}>
          {statusBanner.text}
        </div>
      )}

      {!editing ? (
        <div className="bg-white rounded-xl shadow-sm border p-6 grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm print:border-0 print:shadow-none">
          <Info label="Health ID" value={profile.healthId} />
          <Info label="Full Name" value={profile.fullName} />
          <Info label="Email" value={profile.email} />
          <Info label="Date of Birth" value={profile.dateOfBirth} />
          <Info label="Phone" value={profile.phone} />
          <Info label="Location" value={profile.location} />
          <Info label="Blood Group" value={profile.bloodGroup} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 max-w-md">
          <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500" />

          <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
          <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500" />

          <label className="block text-sm font-medium mb-1 text-gray-700">Blood Group</label>
          <select required value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            className="w-full border rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500">
            {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
          </select>

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