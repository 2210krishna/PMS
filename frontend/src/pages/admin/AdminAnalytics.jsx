// import { useEffect, useState } from "react";
// import axiosClient from "../../api/axiosClient";
// import { useToast } from "../../context/ToastContext";

// export default function AdminAnalytics() {
//   const [stats, setStats] = useState(null);
//   const { showToast } = useToast();

//   useEffect(() => {
//     axiosClient.get("/admin/dashboard-stats")
//       .then((r) => setStats(r.data))
//       .catch(() => showToast("Failed to load stats", "error"));
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
//       <p className="text-gray-500 text-sm mb-6">Real-time overview of the platform.</p>

//       {stats && (
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           <StatCard label="Doctors" value={stats.totalDoctors} />
//           <StatCard label="Patients" value={stats.totalPatients} />
//           <StatCard label="Appointments Today" value={stats.appointmentsToday} />
//           <StatCard label="Completed Today" value={stats.appointmentsCompletedToday} />
//           <StatCard label="Patients Booked Today" value={stats.patientsBookedToday} />
//         </div>
//       )}
//     </div>
//   );
// }

// function StatCard({ label, value }) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
//       <p className="text-2xl font-bold text-teal-800">{value}</p>
//       <p className="text-xs text-gray-500 mt-1">{label}</p>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  Users,
  Stethoscope,
  CalendarDays,
  CheckCircle2,
  UserPlus,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    axiosClient
      .get("/admin/dashboard-stats")
      .then((r) => setStats(r.data))
      .catch(() => showToast("Failed to load stats", "error"));
  }, []);

  if (!stats) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  /*
   * Using the real values returned by your existing API.
   * No backend changes are required.
   */

  const overviewData = [
    {
      name: "Doctors",
      value: stats.totalDoctors || 0,
    },
    {
      name: "Patients",
      value: stats.totalPatients || 0,
    },
    {
      name: "Appointments",
      value: stats.appointmentsToday || 0,
    },
    {
      name: "Completed",
      value: stats.appointmentsCompletedToday || 0,
    },
    {
      name: "New Bookings",
      value: stats.patientsBookedToday || 0,
    },
  ];

  const appointmentStatus = [
    {
      name: "Completed",
      value: stats.appointmentsCompletedToday || 0,
    },
    {
      name: "Remaining",
      value: Math.max(
        (stats.appointmentsToday || 0) -
          (stats.appointmentsCompletedToday || 0),
        0
      ),
    },
  ];

  const completionRate =
    stats.appointmentsToday > 0
      ? Math.round(
          (stats.appointmentsCompletedToday / stats.appointmentsToday) * 100
        )
      : 0;

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Activity className="w-5 h-5 text-teal-700" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h1>
          </div>

          <p className="text-gray-500 text-sm mt-1 ml-1">
            Real-time overview of your healthcare platform.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>

          <span className="text-xs font-medium text-gray-600">
            Live Data
          </span>
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard
          label="Total Doctors"
          value={stats.totalDoctors}
          icon={<Stethoscope />}
          iconBg="bg-teal-100"
          iconColor="text-teal-700"
        />

        <StatCard
          label="Total Patients"
          value={stats.totalPatients}
          icon={<Users />}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />

        <StatCard
          label="Appointments Today"
          value={stats.appointmentsToday}
          icon={<CalendarDays />}
          iconBg="bg-purple-100"
          iconColor="text-purple-700"
        />

        <StatCard
          label="Completed Today"
          value={stats.appointmentsCompletedToday}
          icon={<CheckCircle2 />}
          iconBg="bg-green-100"
          iconColor="text-green-700"
        />

        <StatCard
          label="Patients Booked"
          value={stats.patientsBookedToday}
          icon={<UserPlus />}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />

      </div>

      {/* ================= MAIN ANALYTICS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* BAR CHART */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-5">

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">
                Platform Overview
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Current healthcare platform statistics
              </p>
            </div>

            <div className="p-2 bg-teal-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-teal-700" />
            </div>
          </div>

          <div className="h-[300px]">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overviewData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#6b7280",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#6b7280",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  cursor={{ fill: "#f0fdfa" }}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />

                <Bar
                  dataKey="value"
                  name="Count"
                  fill="#0f766e"
                  radius={[7, 7, 0, 0]}
                  barSize={42}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* APPOINTMENT STATUS */}
        <div className="bg-white rounded-2xl border shadow-sm p-5">

          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">
                Today's Appointments
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Appointment completion status
              </p>
            </div>

            <div className="p-2 bg-green-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
          </div>

          <div className="h-[260px] relative">

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={appointmentStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill="#0f766e" />
                  <Cell fill="#e5e7eb" />
                </Pie>

                <Tooltip />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "12px",
                  }}
                />

              </PieChart>
            </ResponsiveContainer>

            {/* CENTER VALUE */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center mt-[-15px]">
                <p className="text-3xl font-bold text-gray-800">
                  {completionRate}%
                </p>

                <p className="text-[11px] text-gray-500">
                  Completed
                </p>
              </div>
            </div>

          </div>

          <div className="border-t pt-4 flex justify-between text-sm">

            <div>
              <p className="text-gray-400 text-xs">
                Total
              </p>

              <p className="font-semibold text-gray-800">
                {stats.appointmentsToday}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-400 text-xs">
                Completed
              </p>

              <p className="font-semibold text-teal-700">
                {stats.appointmentsCompletedToday}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ================= APPOINTMENT PERFORMANCE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* COMPLETION CARD */}
        <div className="bg-white rounded-2xl border shadow-sm p-5">

          <div className="flex items-center gap-3 mb-5">

            <div className="p-2.5 rounded-xl bg-teal-100">
              <CheckCircle2 className="w-5 h-5 text-teal-700" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Appointment Performance
              </h3>

              <p className="text-xs text-gray-500">
                Today's completion progress
              </p>
            </div>

          </div>

          <div className="mb-3 flex justify-between">
            <span className="text-sm text-gray-500">
              Completion rate
            </span>

            <span className="text-sm font-semibold text-teal-700">
              {completionRate}%
            </span>
          </div>

          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-700"
              style={{
                width: `${completionRate}%`,
              }}
            />

          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">

            <MiniStat
              label="Completed"
              value={stats.appointmentsCompletedToday}
            />

            <MiniStat
              label="Remaining"
              value={Math.max(
                stats.appointmentsToday -
                  stats.appointmentsCompletedToday,
                0
              )}
            />

          </div>

        </div>

        {/* PATIENT ACTIVITY */}
        <div className="bg-white rounded-2xl border shadow-sm p-5">

          <div className="flex items-center gap-3 mb-5">

            <div className="p-2.5 rounded-xl bg-blue-100">
              <Users className="w-5 h-5 text-blue-700" />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Patient Activity
              </h3>

              <p className="text-xs text-gray-500">
                Today's patient engagement
              </p>
            </div>

          </div>

          <div className="flex items-end gap-3">

            <span className="text-4xl font-bold text-gray-800">
              {stats.patientsBookedToday}
            </span>

            <span className="text-sm text-green-600 mb-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Bookings
            </span>

          </div>

          <div className="mt-5 p-4 rounded-xl bg-gray-50">

            <div className="flex justify-between mb-2">

              <span className="text-xs text-gray-500">
                Patients / appointments
              </span>

              <span className="text-xs font-semibold text-gray-700">
                {stats.appointmentsToday > 0
                  ? Math.round(
                      (stats.patientsBookedToday /
                        stats.appointmentsToday) *
                        100
                    )
                  : 0}
                %
              </span>

            </div>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${
                    stats.appointmentsToday > 0
                      ? Math.min(
                          (stats.patientsBookedToday /
                            stats.appointmentsToday) *
                            100,
                          100
                        )
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* QUICK SUMMARY */}
        <div className="bg-gradient-to-br from-teal-800 to-teal-600 rounded-2xl shadow-sm p-5 text-white">

          <div className="flex items-center justify-between mb-6">

            <div>
              <p className="text-teal-100 text-xs">
                Platform Summary
              </p>

              <h3 className="text-lg font-semibold mt-1">
                Today's Overview
              </h3>
            </div>

            <div className="p-2 bg-white/10 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>

          </div>

          <div className="space-y-4">

            <SummaryRow
              label="Doctors"
              value={stats.totalDoctors}
            />

            <SummaryRow
              label="Patients"
              value={stats.totalPatients}
            />

            <SummaryRow
              label="Appointments"
              value={stats.appointmentsToday}
            />

            <SummaryRow
              label="Completed"
              value={stats.appointmentsCompletedToday}
            />

            <SummaryRow
              label="New Bookings"
              value={stats.patientsBookedToday}
            />

          </div>

        </div>

      </div>

      {/* ================= FOOTER INFO ================= */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">

        <Activity className="w-3.5 h-3.5" />

        Dashboard data is synchronized with the platform.

      </div>

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="group bg-white rounded-2xl border shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

      <div className="flex items-center justify-between">

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <TrendingUp className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors" />

      </div>

      <div className="mt-4">

        <p className="text-2xl font-bold text-gray-800">
          {value ?? 0}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {label}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   MINI STAT
========================================================= */

function MiniStat({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">

      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="text-xl font-bold text-gray-800 mt-1">
        {value ?? 0}
      </p>

    </div>
  );
}


/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-sm text-teal-100">
        {label}
      </span>

      <span className="font-semibold">
        {value ?? 0}
      </span>

    </div>
  );
}

