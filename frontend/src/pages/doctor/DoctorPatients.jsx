import { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axiosClient from "../../api/axiosClient";
import { useToast } from "../../context/ToastContext";

export default function DoctorPatients() {
  const [healthId, setHealthId] = useState("");
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [scanning, setScanning] = useState(false);
  const { showToast } = useToast();

  const [diseaseType, setDiseaseType] = useState("");
  const [diagnosisNotes, setDiagnosisNotes] = useState("");
  const [prescriptionText, setPrescriptionText] = useState("");

  const [vaccineName, setVaccineName] = useState("");
  const [doseNumber, setDoseNumber] = useState(1);
  const [dateGiven, setDateGiven] = useState("");

  const [items, setItems] = useState([{ medicineName: "", dosage: "", quantity: 1, unitPrice: 0 }]);
  const [prescriptionNotes, setPrescriptionNotes] = useState("");

  const scannerRef = useRef(null);

  const lookupPatient = async (id) => {
    try {
      const res = await axiosClient.get(`/patient/lookup/${id}`);
      setPatient(res.data);
      if (res.data.verificationStatus === "VERIFIED") {
        loadHistory(id);
      } else {
        setHistory([]); setVaccines([]);
      }
    } catch {
      showToast("No patient found with this Health ID", "error");
      setPatient(null);
    }
  };

  const loadHistory = async (id) => {
    const recRes = await axiosClient.get(`/doctor/records/${id}`);
    setHistory(recRes.data);
    const vacRes = await axiosClient.get(`/doctor/vaccinations/${id}`);
    setVaccines(vacRes.data);
  };

  const handleManualLookup = (e) => {
    e.preventDefault();
    if (healthId) lookupPatient(healthId);
  };

  const startScan = async () => {
    setScanning(true);
    setTimeout(async () => {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            await scanner.stop();
            setScanning(false);
            setHealthId(decodedText);
            lookupPatient(decodedText);
          }
        );
      } catch {
        showToast("Camera access failed. Enter Health ID manually instead.", "error");
        setScanning(false);
      }
    }, 200);
  };

  const stopScan = async () => {
    if (scannerRef.current) { try { await scannerRef.current.stop(); } catch {} }
    setScanning(false);
  };

  const submitRecord = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/doctor/records", {
        healthId: patient.healthId, diseaseType, diagnosisNotes, prescriptionText,
      });
      showToast("Diagnosis saved", "success");
      setDiseaseType(""); setDiagnosisNotes(""); setPrescriptionText("");
      loadHistory(patient.healthId);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add record", "error");
    }
  };

  const submitVaccination = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/doctor/vaccinations", {
        healthId: patient.healthId, vaccineName, doseNumber: Number(doseNumber), dateGiven,
      });
      showToast("Vaccination logged", "success");
      setVaccineName(""); setDoseNumber(1); setDateGiven("");
      loadHistory(patient.healthId);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add vaccination", "error");
    }
  };

  const updateItem = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const addItemRow = () => setItems([...items, { medicineName: "", dosage: "", quantity: 1, unitPrice: 0 }]);
  const removeItemRow = (idx) => setItems(items.filter((_, i) => i !== idx));

  const submitPrescription = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/prescriptions", {
        healthId: patient.healthId,
        notes: prescriptionNotes,
        items: items.map((it) => ({ ...it, quantity: Number(it.quantity), unitPrice: Number(it.unitPrice) })),
      });
      showToast("Prescription created", "success");
      setPrescriptionNotes("");
      setItems([{ medicineName: "", dosage: "", quantity: 1, unitPrice: 0 }]);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create prescription", "error");
    }
  };

  const isVerified = patient?.verificationStatus === "VERIFIED";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Patient Lookup</h1>
      <p className="text-gray-500 text-sm mb-6">Search by Health ID or scan a patient's QR code.</p>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <form onSubmit={handleManualLookup} className="flex gap-2 mb-3">
          <input
            value={healthId}
            onChange={(e) => setHealthId(e.target.value)}
            placeholder="Enter Health ID"
            className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md">Search</button>
        </form>

        {!scanning ? (
          <button onClick={startScan} className="text-sm text-teal-700 underline">
            Or scan QR code with camera
          </button>
        ) : (
          <div>
            <div id="qr-reader" className="w-full max-w-sm mx-auto" />
            <button onClick={stopScan} className="text-sm text-red-600 underline mt-2">Cancel scan</button>
          </div>
        )}
      </div>

      {patient && (
        <>
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-gray-800 mb-1">{patient.fullName}</h2>
                <p className="text-sm text-gray-500">
                  Health ID: {patient.healthId} · {patient.gender}, DOB {patient.dateOfBirth}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {patient.verificationStatus}
              </span>
            </div>
            {patient.knownAllergies && <p className="text-sm text-red-600 mt-2">⚠ Allergies: {patient.knownAllergies}</p>}
            {patient.chronicConditions && <p className="text-sm text-orange-600">Chronic: {patient.chronicConditions}</p>}
          </div>

          {!isVerified ? (
            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-sm text-yellow-800">
              This patient's registration hasn't been verified by an admin yet.
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <form onSubmit={submitRecord} className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Add Diagnosis</h3>
                  <input required value={diseaseType} onChange={(e) => setDiseaseType(e.target.value)}
                    placeholder="Disease type" className="w-full border rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <textarea value={diagnosisNotes} onChange={(e) => setDiagnosisNotes(e.target.value)}
                    placeholder="Diagnosis notes" className="w-full border rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500" rows={2} />
                  <textarea value={prescriptionText} onChange={(e) => setPrescriptionText(e.target.value)}
                    placeholder="Notes" className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500" rows={2} />
                  <button className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md w-full">Save Diagnosis</button>
                </form>

                <form onSubmit={submitVaccination} className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Log Vaccination</h3>
                  <input required value={vaccineName} onChange={(e) => setVaccineName(e.target.value)}
                    placeholder="Vaccine name" className="w-full border rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input required type="number" min={1} value={doseNumber} onChange={(e) => setDoseNumber(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <input required type="date" value={dateGiven} onChange={(e) => setDateGiven(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  <button className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md w-full">Save Vaccination</button>
                </form>
              </div>

              <form onSubmit={submitPrescription} className="bg-white rounded-xl shadow-sm border p-6 mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Create Prescription / Bill</h3>
                {items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <input required placeholder="Medicine" value={it.medicineName}
                      onChange={(e) => updateItem(idx, "medicineName", e.target.value)}
                      className="col-span-4 border rounded-md px-2 py-1.5 text-sm" />
                    <input placeholder="Dosage" value={it.dosage}
                      onChange={(e) => updateItem(idx, "dosage", e.target.value)}
                      className="col-span-3 border rounded-md px-2 py-1.5 text-sm" />
                    <input required type="number" min={1} placeholder="Qty" value={it.quantity}
                      onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                      className="col-span-2 border rounded-md px-2 py-1.5 text-sm" />
                    <input required type="number" min={0} step="0.01" placeholder="Price" value={it.unitPrice}
                      onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
                      className="col-span-2 border rounded-md px-2 py-1.5 text-sm" />
                    <button type="button" onClick={() => removeItemRow(idx)} className="col-span-1 text-red-600 text-xs">✕</button>
                  </div>
                ))}
                <button type="button" onClick={addItemRow} className="text-sm text-teal-700 underline mb-3">+ Add medicine</button>
                <textarea value={prescriptionNotes} onChange={(e) => setPrescriptionNotes(e.target.value)}
                  placeholder="Prescription notes" rows={2}
                  className="w-full border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <button className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md w-full">Generate Prescription</button>
              </form>

              <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Medical History</h3>
                {history.length === 0 && <p className="text-sm text-gray-400">No records yet.</p>}
                {history.map((r) => (
                  <div key={r.id} className="border-b last:border-0 py-2 text-sm">
                    <p className="font-medium text-gray-800">{r.diseaseType} — {r.createdAt}</p>
                    <p className="text-gray-600">{r.diagnosisNotes}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}