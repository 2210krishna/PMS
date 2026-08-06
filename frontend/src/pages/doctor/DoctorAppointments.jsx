import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    setLoadError("");
    axiosClient.get("/appointments/me/as-doctor")
      .then((r) => setAppointments(r.data))
      .catch((err) => {
        setLoadError(
          err.response
            ? `Server responded ${err.response.status}: ${err.response.data?.message || "Unknown error"}`
            : `Could not reach backend: ${err.message}`
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markCompleted = async (id) => {
    try {
      await axiosClient.put(`/appointments/${id}/status?status=COMPLETED`);
      showToast("Marked as completed", "success");
      load();
    } catch {
      showToast("Failed to update", "error");
    }
  };

  const cancel = async (id) => {
    try {
      await axiosClient.put(`/appointments/${id}/status?status=CANCELLED`);
      showToast("Appointment cancelled", "success");
      load();
    } catch {
      showToast("Failed to update", "error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">My Appointments</h1>
      <p className="text-gray-500 text-sm mb-6">Appointments booked with you by patients.</p>

      {loadError && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm p-3 rounded-md mb-6">
          <strong>Failed to load appointments:</strong> {loadError}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Patient</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Time</th>
              <th className="text-left px-4 py-3">Reason</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>}
            {!loading && appointments.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-800">{a.patientName}</td>
                <td className="px-4 py-3 text-gray-600">{a.appointmentDate}</td>
                <td className="px-4 py-3 text-gray-600">{a.timeSlot}</td>
                <td className="px-4 py-3 text-gray-600">{a.reason}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    a.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                    a.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>{a.status}</span>
                </td>
                <td className="px-4 py-3">
                  {a.status === "CONFIRMED" && (
                    <div className="flex gap-2">
                      <button onClick={() => markCompleted(a.id)} className="text-green-700 text-xs underline">Complete</button>
                      <button onClick={() => cancel(a.id)} className="text-red-600 text-xs underline">Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!loading && !loadError && appointments.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No appointments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}