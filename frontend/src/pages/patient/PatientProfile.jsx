import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    axiosClient.get("/patient/me")
      .then((res) => setProfile(res.data))
      .catch(() => showToast("Failed to load profile", "error"));
  }, []);

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
        <button onClick={() => window.print()} className="border border-teal-700 text-teal-700 hover:bg-teal-50 text-sm px-4 py-1.5 rounded-md">
          Print
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-6 print:hidden">Your registered health information.</p>

      {statusBanner && (
        <div className={`border rounded-lg p-3 text-sm mb-6 print:hidden ${statusBanner.cls}`}>
          {statusBanner.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-6 grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm print:border-0 print:shadow-none">
        <Info label="Health ID" value={profile.healthId} />
        <Info label="Full Name" value={profile.fullName} />
        <Info label="Email" value={profile.email} />
        <Info label="Date of Birth" value={profile.dateOfBirth} />
        <Info label="Gender" value={profile.gender} />
        <Info label="Phone" value={profile.phone} />
        <Info label="State" value={profile.nativeState} />
        <Info label="District" value={profile.currentDistrict} />
        <Info label="Address" value={profile.campOrWorkLocation} />
        <Info label="Known Allergies" value={profile.knownAllergies || "None recorded"} />
        <Info label="Chronic Conditions" value={profile.chronicConditions || "None recorded"} />
      </div>
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