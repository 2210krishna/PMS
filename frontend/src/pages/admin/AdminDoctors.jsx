import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [docName, setDocName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [newCreds, setNewCreds] = useState(null);
  const { showToast } = useToast();

  const load = () => {
    axiosClient.get("/doctor/directory").then((r) => setDoctors(r.data));
  };

  useEffect(load, []);

  const downloadCreds = (creds) => {
    const text = `HealthNest Doctor Login Credentials\n\nName: ${creds.fullName || ""}\nEmail: ${creds.email}\nTemporary Password: ${creds.temporaryPassword}\n\nPlease change this password after first login.`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${creds.email}-credentials.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addDoctor = async (e) => {
    e.preventDefault();
    setNewCreds(null);
    try {
      const res = await axiosClient.post("/admin/doctors", { fullName: docName, email: docEmail });
      setNewCreds({ ...res.data, fullName: docName });
      showToast("Doctor account created", "success");
      setDocName(""); setDocEmail("");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create doctor", "error");
    }
  };

  const resetPassword = async (userId, email) => {
    try {
      const res = await axiosClient.post(`/admin/doctors/${userId}/reset-password`);
      setNewCreds({ ...res.data, fullName: email });
      showToast("Password reset — download new credentials below", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to reset password", "error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Manage Doctors</h1>
      <p className="text-gray-500 text-sm mb-6">Onboard new doctors and manage existing accounts.</p>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Add New Doctor</h2>

        {newCreds && (
          <div className="bg-teal-50 border border-teal-300 rounded-md p-3 mb-3 text-sm flex justify-between items-center flex-wrap gap-2">
            <div>
              Credentials ready — share securely:<br />
              <b>Email:</b> {newCreds.email}<br />
              <b>Temporary Password:</b> <code className="bg-white px-1 rounded">{newCreds.temporaryPassword}</code>
            </div>
            <button
              onClick={() => downloadCreds(newCreds)}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap"
            >
              Download as .txt
            </button>
          </div>
        )}

        <form onSubmit={addDoctor} className="flex gap-2 flex-wrap">
          <input required value={docName} onChange={(e) => setDocName(e.target.value)}
            placeholder="Doctor full name" className="flex-1 min-w-[180px] border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <input required type="email" value={docEmail} onChange={(e) => setDocEmail(e.target.value)}
            placeholder="Doctor email" className="flex-1 min-w-[180px] border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <button className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md whitespace-nowrap">
            Create Doctor
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Specialization</th>
              <th className="text-left px-4 py-3">Location</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.userId} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-800">Dr. {d.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{d.email}</td>
                <td className="px-4 py-3 text-gray-600">{d.specialization}</td>
                <td className="px-4 py-3 text-gray-600">{d.location}</td>
                <td className="px-4 py-3 text-gray-600">{d.phone}</td>
                <td className="px-4 py-3">
                  <button onClick={() => resetPassword(d.userId, d.email)} className="text-teal-700 text-xs underline">
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No doctors with completed profiles yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}