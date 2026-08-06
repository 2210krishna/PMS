import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const { showToast } = useToast();

  const load = () => {
    axiosClient.get("/admin/dashboard-stats").then((r) => setStats(r.data)).catch(() => showToast("Failed to load stats", "error"));
    axiosClient.get("/admin/outbreaks?status=OPEN").then((r) => setAlerts(r.data));
  };

  useEffect(load, []);

  const resolveAlert = async (id) => {
    try {
      await axiosClient.put(`/admin/outbreaks/${id}/resolve`);
      showToast("Outbreak alert resolved", "success");
      load();
    } catch {
      showToast("Failed to resolve alert", "error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">Real-time overview of the platform.</p>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard label="Doctors" value={stats.totalDoctors} />
          <StatCard label="Patients" value={stats.totalPatients} />
          <StatCard label="Appointments Today" value={stats.appointmentsToday} />
          <StatCard label="Completed Today" value={stats.appointmentsCompletedToday} />
          <StatCard label="Patients Booked Today" value={stats.patientsBookedToday} />
        </div>
      )}

      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-red-700 mb-2">🚨 Active Outbreak Alerts</h2>
          {alerts.map((a) => (
            <div key={a.id} className="flex justify-between items-center border-b border-red-200 last:border-0 py-2 text-sm">
              <span>
                <b>{a.diseaseType}</b> at <b>{a.district}</b> — {a.caseCount} cases (window {a.windowStart} → {a.windowEnd})
              </span>
              <button onClick={() => resolveAlert(a.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md">
                Resolve
              </button>
            </div>
          ))}
        </div>
      )}

      {alerts.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
          No active outbreak alerts at this time.
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
      <p className="text-2xl font-bold text-teal-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}