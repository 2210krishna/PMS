import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    axiosClient.get("/admin/dashboard-stats")
      .then((r) => setStats(r.data))
      .catch(() => showToast("Failed to load stats", "error"));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">Real-time overview of the platform.</p>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Doctors" value={stats.totalDoctors} />
          <StatCard label="Patients" value={stats.totalPatients} />
          <StatCard label="Appointments Today" value={stats.appointmentsToday} />
          <StatCard label="Completed Today" value={stats.appointmentsCompletedToday} />
          <StatCard label="Patients Booked Today" value={stats.patientsBookedToday} />
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