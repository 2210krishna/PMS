// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useToast } from "../context/ToastContext";
// import GoogleSignInButton from "../components/GoogleSignInButton";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const { login } = useAuth();
//   const { showToast } = useToast();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await login(email, password);
//       showToast("Welcome back!", "success");
//       navigate("/dashboard");
//     } catch (err) {
//       const msg = err.response?.data?.message || "Invalid email or password";
//       setError(msg);
//       showToast(msg, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white px-4">
//       <div className="w-full max-w-sm">
//         <Link to="/" className="text-sm text-teal-700 hover:underline mb-6 inline-block">← Back to Home</Link>

//         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border">
//           <h1 className="text-2xl font-bold text-teal-800 mb-1">Welcome Back</h1>
//           <p className="text-gray-500 text-sm mb-6">Sign in to HealthNest</p>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-md mb-4">
//               {error}
//               <div className="mt-1">
//                 Don't have an account?{" "}
//                 <Link to="/register" className="font-medium underline">Register as Patient</Link>
//               </div>
//             </div>
//           )}

//           <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
//           />

//           <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full border rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-md font-semibold disabled:opacity-50 transition"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>

//           <div className="flex items-center gap-3 my-4">
//             <div className="flex-1 h-px bg-gray-200" />
//             <span className="text-xs text-gray-400">OR</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>

//           <GoogleSignInButton />

//           <p className="text-sm text-center mt-5 text-gray-500">
//             No account? <Link to="/register" className="text-teal-700 font-medium hover:underline">Register as Patient</Link>
//           </p>
//           <p className="text-xs text-center mt-2 text-gray-400">
//             Doctors &amp; Admins: your account is created for you by an administrator.
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
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      const msg = "Please enter your email and password.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (password.length < 6) {
      const msg = "Password must contain at least 6 characters.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);

      showToast("Welcome back!", "success");

      navigate("/dashboard");
    } catch (err) {
      const status = err?.response?.status;

      let msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to sign in. Please check your credentials.";

      if (status === 401) {
        msg = "Invalid email or password.";
      } else if (status === 403) {
        msg = "Your account does not currently have access.";
      } else if (status >= 500) {
        msg = "Server error. Please try again later.";
      } else if (!err?.response) {
        msg = "Unable to connect to the server. Please check your connection.";
      }

      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-gray-50 flex items-center justify-center px-4 py-10 font-sans">

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
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">

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
                Welcome back
              </h2>

              <p className="text-sm text-teal-100 mt-1">
                Sign in to continue to your account.
              </p>

            </div>

          </div>


          {/* FORM */}
          <form onSubmit={handleSubmit} className="p-8">

            {/* ERROR */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 mb-5">

                <p className="text-sm font-medium">
                  {error}
                </p>

                <p className="text-xs mt-1.5">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold underline"
                  >
                    Register as Patient
                  </Link>
                </p>

              </div>
            )}


            {/* EMAIL */}
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>

            <div className="relative mb-4">

              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="email"
                required
                className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />

            </div>


            {/* PASSWORD */}
            <div className="flex justify-between items-center mb-1.5">

              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <span className="text-[11px] text-gray-400">
                Minimum 6 characters
              </span>

            </div>

            <div className="relative mb-6">

              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="current-password"
                minLength={6}
                required
                className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-700 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>

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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>


            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-6">

              <div className="flex-1 h-px bg-gray-200" />

              <span className="text-[11px] text-gray-400 font-medium">
                OR CONTINUE WITH
              </span>

              <div className="flex-1 h-px bg-gray-200" />

            </div>


            {/* GOOGLE */}
            <GoogleSignInButton />


            {/* REGISTER */}
            <p className="text-sm text-center mt-6 text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-teal-700 font-semibold hover:underline"
              >
                Register as Patient
              </Link>
            </p>


            {/* INFO */}
            <div className="mt-5 bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex gap-3">

              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />

              <p className="text-[11px] text-gray-500 leading-5">
                Doctors and administrators receive their accounts through
                the HealthNest administration system.
              </p>

            </div>

          </form>

        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Secure access to your HealthNest account
        </p>

      </div>
    </div>
  );
}
