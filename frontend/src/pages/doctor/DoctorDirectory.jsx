import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function DoctorDirectory() {
  const [doctors, setDoctors] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    axiosClient.get("/doctor/directory")
      .then((res) => setDoctors(res.data))
      .catch((err) => setLoadError(err.response ? `${err.response.status}: ${err.response.data?.message || "Unknown error"}` : err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Doctor Directory</h1>
      <p className="text-gray-500 text-sm mb-6">All verified doctors on the platform.</p>

      {loadError && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm p-3 rounded-md mb-6">
          <strong>Failed to load directory:</strong> {loadError}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Department</th>
              <th className="text-left px-4 py-3">Specialization</th>
              <th className="text-left px-4 py-3">Location</th>
              <th className="text-left px-4 py-3">Phone</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>}
            {!loading && doctors.map((d) => (
              <tr key={d.userId} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-800">Dr. {d.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{d.departmentName}</td>
                <td className="px-4 py-3 text-gray-600">{d.specialization}</td>
                <td className="px-4 py-3 text-gray-600">{d.location}</td>
                <td className="px-4 py-3 text-gray-600">{d.phone}</td>
              </tr>
            ))}
            {!loading && !loadError && doctors.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No doctors listed yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}