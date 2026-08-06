import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    axiosClient.get("/doctor/directory")
      .then((res) => setDoctors(res.data))
      .catch(() => showToast("Failed to load doctor directory", "error"));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Doctor Directory</h1>
      <p className="text-gray-500 text-sm mb-6">All verified doctors on the platform.</p>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Specialization</th>
              <th className="text-left px-4 py-3">Location</th>
              <th className="text-left px-4 py-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.userId} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-800">Dr. {d.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{d.specialization}</td>
                <td className="px-4 py-3 text-gray-600">{d.location}</td>
                <td className="px-4 py-3 text-gray-600">{d.phone}</td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No doctors listed yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}