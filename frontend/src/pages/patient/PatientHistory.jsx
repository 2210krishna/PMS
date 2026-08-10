import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function PatientHistory() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    axiosClient.get("/patient/me/prescriptions")
      .then((r) => setPrescriptions(r.data))
      .catch(() => showToast("Failed to load prescriptions", "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Prescriptions</h1>
      <p className="text-gray-500 text-sm mb-6">Every diagnosis and prescription issued to you.</p>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        {prescriptions.length === 0 && <p className="text-sm text-gray-400">No prescriptions yet.</p>}
        {prescriptions.map((p) => (
          <div key={p.id} className="border-b last:border-0 py-4 text-sm">
            <div className="flex justify-between mb-1">
              <p className="font-medium text-gray-800">Dr. {p.doctorName}</p>
              <p className="text-gray-400 text-xs">{p.createdAt}</p>
            </div>
            <p className="text-gray-800 font-semibold">{p.diagnosis}</p>
            {p.cause && <p className="text-gray-600 mt-0.5">Cause: {p.cause}</p>}
            {p.notes && <p className="text-gray-600 mt-0.5">{p.notes}</p>}
            <table className="w-full mt-2 text-xs">
              <thead>
                <tr className="text-gray-400 text-left">
                  <th className="py-1">Medicine</th><th>Dosage</th><th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {p.items.map((it, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-1">{it.medicineName}</td>
                    <td>{it.dosage}</td>
                    <td>{it.durationDays} day{it.durationDays > 1 ? "s" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}