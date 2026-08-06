import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function PatientHistory() {
  const [records, setRecords] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      axiosClient.get("/patient/me/records"),
      axiosClient.get("/patient/me/vaccinations"),
      axiosClient.get("/patient/me/prescriptions"),
    ])
      .then(([r, v, p]) => { setRecords(r.data); setVaccines(v.data); setPrescriptions(p.data); })
      .catch(() => showToast("Failed to load history", "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Visit History</h1>
      <p className="text-gray-500 text-sm mb-6">Every diagnosis, prescription and vaccination logged by doctors you've visited.</p>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Diagnoses</h2>
        {records.length === 0 && <p className="text-sm text-gray-400">No records yet.</p>}
        {records.map((r) => (
          <div key={r.id} className="border-b last:border-0 py-3 text-sm">
            <div className="flex justify-between">
              <p className="font-medium text-gray-800">{r.diseaseType}</p>
              <p className="text-gray-400 text-xs">{r.createdAt}</p>
            </div>
            {r.diagnosisNotes && <p className="text-gray-600 mt-1">{r.diagnosisNotes}</p>}
            <p className="text-xs text-gray-400 mt-1">Seen by Dr. {r.doctorName} — {r.district}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Prescriptions &amp; Bills</h2>
        {prescriptions.length === 0 && <p className="text-sm text-gray-400">No prescriptions yet.</p>}
        {prescriptions.map((p) => (
          <div key={p.id} className="border-b last:border-0 py-3 text-sm">
            <div className="flex justify-between">
              <p className="font-medium text-gray-800">Dr. {p.doctorName}</p>
              <p className="text-gray-400 text-xs">{p.createdAt}</p>
            </div>
            {p.notes && <p className="text-gray-600 mt-1">{p.notes}</p>}
            <table className="w-full mt-2 text-xs">
              <thead>
                <tr className="text-gray-400 text-left">
                  <th className="py-1">Medicine</th><th>Dosage</th><th>Qty</th><th>Price</th>
                </tr>
              </thead>
              <tbody>
                {p.items.map((it, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-1">{it.medicineName}</td>
                    <td>{it.dosage}</td>
                    <td>{it.quantity}</td>
                    <td>₹{it.unitPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-right font-semibold text-gray-800 mt-2">Total: ₹{p.totalAmount}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="font-semibold text-gray-800 mb-3">Vaccinations</h2>
        {vaccines.length === 0 && <p className="text-sm text-gray-400">No vaccinations recorded yet.</p>}
        {vaccines.map((v) => (
          <div key={v.id} className="border-b last:border-0 py-2 text-sm flex justify-between">
            <span>{v.vaccineName} — Dose {v.doseNumber}</span>
            <span className="text-gray-400">{v.dateGiven}</span>
          </div>
        ))}
      </div>
    </div>
  );
}