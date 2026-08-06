import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

function generateTimeSlots() {
  const slots = [];
  let hour = 9, minute = 0;
  while (hour < 17) {
    const start = formatTime(hour, minute);
    let endMinute = minute + 30, endHour = hour;
    if (endMinute >= 60) { endMinute -= 60; endHour += 1; }
    const end = formatTime(endHour, endMinute);
    slots.push({ label: `${start} - ${end}`, hour24: hour, minute });
    minute += 30;
    if (minute >= 60) { minute -= 60; hour += 1; }
  }
  return slots;
}

function formatTime(h, m) {
  const period = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

const ALL_SLOTS = generateTimeSlots();

export default function PatientAppointments() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const { showToast } = useToast();

  const [departmentId, setDepartmentId] = useState("");
  const [doctorUserId, setDoctorUserId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [reason, setReason] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const loadAppointments = () => {
    axiosClient.get("/appointments/me/as-patient").then((r) => setAppointments(r.data));
  };

  useEffect(() => {
    axiosClient.get("/departments").then((r) => setDepartments(r.data));
    loadAppointments();
  }, []);

  useEffect(() => {
    if (departmentId) {
      axiosClient.get(`/departments/${departmentId}/doctors`).then((r) => setDoctors(r.data));
      setDoctorUserId("");
    } else {
      setDoctors([]);
    }
  }, [departmentId]);

  // filter out past time slots if the selected date is today
  const availableSlots = ALL_SLOTS.filter((slot) => {
    if (appointmentDate !== todayStr) return true;
    const now = new Date();
    const slotTime = new Date();
    slotTime.setHours(slot.hour24, slot.minute, 0, 0);
    return slotTime > now;
  });

  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/appointments", {
        doctorUserId: Number(doctorUserId),
        departmentId: Number(departmentId),
        appointmentDate,
        timeSlot,
        reason,
      });
      showToast("Appointment booked", "success");
      setDepartmentId(""); setDoctorUserId(""); setAppointmentDate(""); setTimeSlot(""); setReason("");
      loadAppointments();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to book appointment", "error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Appointments</h1>
      <p className="text-gray-500 text-sm mb-6">Book a new appointment or view your existing ones.</p>

      <form onSubmit={bookAppointment} className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Book New Appointment</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Department</label>
            <select required value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Doctor</label>
            <select required value={doctorUserId} onChange={(e) => setDoctorUserId(e.target.value)} disabled={!departmentId}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100">
              <option value="">Select doctor</option>
              {doctors.map((d) => <option key={d.userId} value={d.userId}>Dr. {d.fullName} — {d.specialization}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
            <input required type="date" min={todayStr} value={appointmentDate}
              onChange={(e) => { setAppointmentDate(e.target.value); setTimeSlot(""); }}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Time Slot</label>
            <select required value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} disabled={!appointmentDate}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100">
              <option value="">Select time slot</option>
              {availableSlots.map((s) => <option key={s.label} value={s.label}>{s.label}</option>)}
            </select>
            {appointmentDate === todayStr && availableSlots.length === 0 && (
              <p className="text-xs text-red-600 mt-1">No slots left for today — please pick another date.</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Reason for Visit</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
        </div>
        <button className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-md mt-4">
          Book Appointment
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Doctor</th>
              <th className="text-left px-4 py-3">Department</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Time</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-800">Dr. {a.doctorName}</td>
                <td className="px-4 py-3 text-gray-600">{a.departmentName}</td>
                <td className="px-4 py-3 text-gray-600">{a.appointmentDate}</td>
                <td className="px-4 py-3 text-gray-600">{a.timeSlot}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    a.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                    a.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>{a.status}</span>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No appointments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}