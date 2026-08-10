import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function AdminPatients() {
  const [pending, setPending] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    setLoadError("");
    axiosClient.get("/admin/patients/pending")
      .then((r) => setPending(r.data))
      .catch((err) => setLoadError(err.response ? `${err.response.status}: ${err.response.data?.message}` : err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const verify = async (patientId, status) => {
    try {
      await axiosClient.put(`/admin/patients/${patientId}/verify?status=${status}`);
      showToast(`Patient ${status.toLowerCase()}`, "success");
      load();
    } catch {
      showToast("Action failed", "error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Patient Verification</h1>
      <p className="text-gray-500 text-sm mb-6">Review and approve pending patient registrations.</p>

      {loadError && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm p-3 rounded-md mb-6">
          <strong>Failed to load:</strong> {loadError}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Health ID</th>
              <th className="text-left px-4 py-3">Location</th>
              <th className="text-left px-4 py-3">Blood Group</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>}
            {!loading && pending.map((w) => (
              <tr key={w.patientId} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-800">{w.fullName}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{w.healthId}</td>
                <td className="px-4 py-3 text-gray-600">{w.location}</td>
                <td className="px-4 py-3 text-gray-600">{w.bloodGroup}</td>
                <td className="px-4 py-3 text-gray-600">{w.phone}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => verify(w.patientId, "VERIFIED")} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-md">Verify</button>
                    <button onClick={() => verify(w.patientId, "REJECTED")} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !loadError && pending.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No pending verifications.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}