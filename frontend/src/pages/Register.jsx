import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", role: "PATIENT",
    dateOfBirth: "", gender: "Male", phone: "",
    nativeState: "", currentDistrict: "", campOrWorkLocation: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      showToast("Registration submitted! Awaiting admin verification.", "success");
      navigate("/dashboard");
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <Link to="/" className="text-sm text-teal-700 hover:underline mb-6 inline-block">← Back to Home</Link>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border">
        <h1 className="text-2xl font-bold text-teal-800 mb-1">Patient Registration</h1>
                  <p className="text-gray-500 text-sm mb-6">
            Your account will be reviewed and verified by an administrator before doctors can
            add medical records to it.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
              <input required value={form.fullName} onChange={update("fullName")} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input type="email" required value={form.email} onChange={update("email")} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <input type="password" required minLength={6} value={form.password} onChange={update("password")} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Date of Birth</label>
              <input type="date" required value={form.dateOfBirth} onChange={update("dateOfBirth")} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Gender</label>
              <select value={form.gender} onChange={update("gender")} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
              <input required value={form.phone} onChange={update("phone")} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Native State</label>
              <input required value={form.nativeState} onChange={update("nativeState")} placeholder="Bihar, WB..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Current District</label>
              <input required value={form.currentDistrict} onChange={update("currentDistrict")} placeholder="Ernakulam..." className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Camp / Work Location</label>
              <input value={form.campOrWorkLocation} onChange={update("campOrWorkLocation")} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-md font-semibold mt-6 disabled:opacity-50 transition"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="text-sm text-center mt-5 text-gray-500">
            Already have an account? <Link to="/login" className="text-teal-700 font-medium hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}