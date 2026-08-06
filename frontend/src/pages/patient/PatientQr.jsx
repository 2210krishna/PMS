import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function PatientQr() {
  const [qrUrl, setQrUrl] = useState(null);
  const [healthId, setHealthId] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    axiosClient.get("/patient/me").then((res) => setHealthId(res.data.healthId));
    axiosClient.get("/patient/me/qrcode", { responseType: "blob" })
      .then((res) => setQrUrl(URL.createObjectURL(res.data)))
      .catch(() => showToast("Failed to load QR code", "error"));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1 print:hidden">My QR Code</h1>
      <p className="text-gray-500 text-sm mb-6 print:hidden">
        Show this to any doctor at a participating clinic — they'll scan it to pull up your medical history instantly.
      </p>

      <div className="bg-white rounded-xl shadow-sm border p-8 flex flex-col items-center print:border-0 print:shadow-none">
        {qrUrl ? (
          <img src={qrUrl} alt="Health ID QR" className="w-56 h-56 border rounded-lg" />
        ) : (
          <div className="w-56 h-56 flex items-center justify-center text-gray-400">Loading...</div>
        )}
        <p className="mt-4 text-sm text-gray-500">Health ID</p>
        <p className="font-mono font-semibold text-teal-800">{healthId}</p>

        {qrUrl && (
          <div className="flex gap-3 mt-5 print:hidden">
            <a href={qrUrl} download="my-health-id-qr.png" className="bg-teal-700 hover:bg-teal-800 text-white text-sm px-5 py-2 rounded-md">
              Download QR Code
            </a>
            <button onClick={() => window.print()} className="border border-teal-700 text-teal-700 hover:bg-teal-50 text-sm px-5 py-2 rounded-md">
              Print
            </button>
          </div>
        )}
      </div>
    </div>
  );
}