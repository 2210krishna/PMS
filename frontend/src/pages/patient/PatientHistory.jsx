import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";
import PrescriptionPager from "../../components/PrescriptionPager";

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
      <p className="text-gray-500 text-sm mb-6">Every diagnosis, prescription, and attached lab report — newest first.</p>
      <PrescriptionPager prescriptions={prescriptions} />
    </div>
  );
}