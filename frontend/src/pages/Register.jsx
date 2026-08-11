// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useToast } from "../context/ToastContext";
// import GoogleSignInButton from "../components/GoogleSignInButton";

// const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// export default function Register() {
//   const [form, setForm] = useState({
//     fullName: "", email: "", password: "", role: "PATIENT",
//     dateOfBirth: "", phone: "", location: "", bloodGroup: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();
//   const { showToast } = useToast();
//   const navigate = useNavigate();

//   const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await register(form);
//       showToast("Registration submitted! Awaiting admin verification.", "success");
//       navigate("/dashboard");
//     } catch (err) {
//       showToast(err.response?.data?.message || "Registration failed", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center py-12 px-4">
//       <div className="w-full max-w-md">
//         <Link to="/" className="text-sm text-teal-700 hover:underline mb-6 inline-block">← Back to Home</Link>

//         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border">
//           <h1 className="text-2xl font-bold text-teal-800 mb-1">Patient Registration</h1>
//           <p className="text-gray-500 text-sm mb-6">
//             Your account will be reviewed and verified by an administrator before you can book appointments.
//           </p>

//           <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
//           <input required value={form.fullName} onChange={update("fullName")} className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500" />

//           <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
//           <input type="email" required value={form.email} onChange={update("email")} className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500" />

//           <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
//           <input type="password" required minLength={6} value={form.password} onChange={update("password")} className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500" />

//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div>
//               <label className="block text-sm font-medium mb-1 text-gray-700">Date of Birth</label>
//               <input required type="date" value={form.dateOfBirth} onChange={update("dateOfBirth")} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1 text-gray-700">Blood Group</label>
//               <select required value={form.bloodGroup} onChange={update("bloodGroup")} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
//                 <option value="">Select</option>
//                 {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
//               </select>
//             </div>
//           </div>

//           <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
//           <input required value={form.phone} onChange={update("phone")} className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500" />

//           <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
//           <input required value={form.location} onChange={update("location")} placeholder="City / Address" className="w-full border rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500" />

//           <button type="submit" disabled={loading} className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-md font-semibold disabled:opacity-50 transition">
//             {loading ? "Creating account..." : "Register"}
//           </button>

//           <div className="flex items-center gap-3 my-4">
//             <div className="flex-1 h-px bg-gray-200" />
//             <span className="text-xs text-gray-400">OR</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>

//           <GoogleSignInButton />

//           <p className="text-sm text-center mt-5 text-gray-500">
//             Already have an account? <Link to="/login" className="text-teal-700 font-medium hover:underline">Login</Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import GoogleSignInButton from "../components/GoogleSignInButton";

import {
  HeartPulse,
  User,
  Mail,
  LockKeyhole,
  Phone,
  MapPin,
  CalendarDays,
  Droplets,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "PATIENT",
    dateOfBirth: "",
    phone: "",
    location: "",
    bloodGroup: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.fullName.trim()) {
      const msg = "Please enter your full name.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (!form.email.trim()) {
      const msg = "Please enter your email.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (form.password.length < 6) {
      const msg = "Password must contain at least 6 characters.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (!form.dateOfBirth) {
      const msg = "Please select your date of birth.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (!form.bloodGroup) {
      const msg = "Please select your blood group.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (!form.phone.trim()) {
      const msg = "Please enter your phone number.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (!form.location.trim()) {
      const msg = "Please enter your location.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    setLoading(true);

    try {
      await register({
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
      });

      showToast(
        "Registration submitted! Awaiting admin verification.",
        "success"
      );

      navigate("/dashboard");
    } catch (err) {
      const status = err?.response?.status;

      let msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";

      if (status === 400) {
        msg =
          err?.response?.data?.message ||
          "Please check the information entered.";
      } else if (status === 409) {
        msg = "An account with this email already exists.";
      } else if (status === 403) {
        msg = "Registration is currently not allowed.";
      } else if (status >= 500) {
        msg = "Server error. Please try again later.";
      } else if (!err?.response) {
        msg = "Unable to connect to the server.";
      }

      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4 py-10 font-sans">

      <div className="w-full max-w-md">

        {/* BACK */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-700 mb-5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-8 py-7 text-white">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  HealthNest
                </h1>

                <p className="text-xs text-teal-100">
                  Digital Healthcare Platform
                </p>
              </div>

            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold">
                Create Account
              </h2>

              <p className="text-sm text-teal-100 mt-1">
                Register as a patient
              </p>
            </div>

          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="p-8">

            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2.5 mb-5 text-sm">
                {error}
              </div>
            )}

            {/* FULL NAME */}
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full Name
            </label>

            <div className="relative mb-4">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                required
                value={form.fullName}
                onChange={update("fullName")}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>

            {/* EMAIL */}
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email
            </label>

            <div className="relative mb-4">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <span className="text-[11px] text-gray-400">
                Minimum 6 characters
              </span>
            </div>

            <div className="relative mb-4">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={form.password}
                onChange={update("password")}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-700"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* DOB + BLOOD GROUP */}
            <div className="grid grid-cols-2 gap-3 mb-4">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Date of Birth
                </label>

                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                  <input
                    required
                    type="date"
                    value={form.dateOfBirth}
                    onChange={update("dateOfBirth")}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-2 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Blood Group
                </label>

                <div className="relative">
                  <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                  <select
                    required
                    value={form.bloodGroup}
                    onChange={update("bloodGroup")}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-2 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  >
                    <option value="">Select</option>

                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* PHONE */}
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Phone
            </label>

            <div className="relative mb-4">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                required
                value={form.phone}
                onChange={update("phone")}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>

            {/* LOCATION */}
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Location
            </label>

            <div className="relative mb-6">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                required
                value={form.location}
                onChange={update("location")}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-teal-700/15 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* GOOGLE */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />

              <span className="text-[11px] text-gray-400">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <GoogleSignInButton />

            {/* LOGIN */}
            <p className="text-sm text-center mt-5 text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-teal-700 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>

          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          HealthNest — Simple, secure healthcare management.
        </p>

      </div>
    </div>
  );
}

