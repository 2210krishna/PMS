import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function AdminTodayAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { showToast } = useToast();

  useEffect(() => {
    axiosClient.get("/appointments/today")
      .then((r) => setAppointments(r.data))
      .catch(() => showToast("Failed to load today's appointments", "error"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter((a) => {
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q) || a.departmentName.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Today's Appointments</h1>
      <p className="text-gray-500 text-sm mb-6">Every appointment scheduled for today, across all doctors.</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient, doctor, or department..."
          className="flex-1 min-w-[220px] border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="ALL">All statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Time</th>
              <th className="text-left px-4 py-3">Patient</th>
              <th className="text-left px-4 py-3">Doctor</th>
              <th className="text-left px-4 py-3">Department</th>
              <th className="text-left px-4 py-3">Reason</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>}
            {!loading && filtered.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-800">{a.timeSlot}</td>
                <td className="px-4 py-3 text-gray-600">{a.patientName}</td>
                <td className="px-4 py-3 text-gray-600">Dr. {a.doctorName}</td>
                <td className="px-4 py-3 text-gray-600">{a.departmentName}</td>
                <td className="px-4 py-3 text-gray-600">{a.reason}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    a.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                    a.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>{a.status}</span>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No appointments match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}