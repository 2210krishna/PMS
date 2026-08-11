import { useState } from "react";
import PrescriptionCard from "./PrescriptionCard";

export default function PrescriptionPager({ prescriptions }) {
  const [idx, setIdx] = useState(0);

  if (prescriptions.length === 0) {
    return <div className="bg-white rounded-xl shadow-sm border p-6 text-sm text-gray-400 text-center">No prescriptions yet.</div>;
  }

  return (
    <div>
      <PrescriptionCard p={prescriptions[idx]} />
      <div className="flex justify-between items-center mt-4">
        <button disabled={idx === 0} onClick={() => setIdx(idx - 1)}
          className="px-4 py-2 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed">
          ← Newer
        </button>
        <span className="text-sm text-gray-500">Prescription {idx + 1} of {prescriptions.length}</span>
        <button disabled={idx === prescriptions.length - 1} onClick={() => setIdx(idx + 1)}
          className="px-4 py-2 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed">
          Older →
        </button>
      </div>
    </div>
  );
}