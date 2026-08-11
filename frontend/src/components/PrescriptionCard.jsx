import axiosClient from "../api/axiosClient";

export default function PrescriptionCard({ p }) {
  const download = async (fileId, fileName) => {
    const res = await axiosClient.get(`/files/${fileId}/download`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between mb-1">
        <p className="font-semibold text-gray-800 text-lg">{p.diagnosis}</p>
        <p className="text-gray-400 text-xs">{p.createdAt}</p>
      </div>
      <p className="text-sm text-gray-500 mb-2">Dr. {p.doctorName}{p.cause ? ` — ${p.cause}` : ""}</p>
      {p.notes && <p className="text-sm text-gray-600 mb-3">{p.notes}</p>}

      <table className="w-full text-xs mb-4">
        <thead>
          <tr className="text-gray-400 text-left"><th className="py-1">Medicine</th><th>Dosage</th><th>Duration</th></tr>
        </thead>
        <tbody>
          {p.items.map((it, idx) => (
            <tr key={idx} className="border-t">
              <td className="py-1">{it.medicineName}</td><td>{it.dosage}</td><td>{it.durationDays} day{it.durationDays > 1 ? "s" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Lab Reports</p>
        {(!p.files || p.files.length === 0) && <p className="text-xs text-gray-400">No reports attached yet.</p>}
        {p.files && p.files.map((f) => (
          <div key={f.id} className="flex justify-between items-center text-sm border-t py-2">
            <span>📄 {f.fileName}</span>
            <button onClick={() => download(f.id, f.fileName)} className="text-teal-700 text-xs underline">Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}