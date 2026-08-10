import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    axiosClient.get("/auth/me")
      .then((r) => setProfile(r.data))
      .catch(() => showToast("Failed to load profile", "error"));
  }, []);

  if (!profile) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">My Profile</h1>
      <p className="text-gray-500 text-sm mb-6">Your administrator account details.</p>

      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-md grid gap-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-0.5">Full Name</p>
          <p className="text-gray-800 font-medium">{profile.fullName}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-0.5">Email</p>
          <p className="text-gray-800 font-medium">{profile.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-0.5">Role</p>
          <p className="text-gray-800 font-medium">{profile.role}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Need to change your password? Use the gear icon in the top bar → Change Password.
      </p>
    </div>
  );
}