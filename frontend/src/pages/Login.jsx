import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      showToast("Welcome back!", "success");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="text-sm text-teal-700 hover:underline mb-6 inline-block">← Back to Home</Link>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border">
          <h1 className="text-2xl font-bold text-teal-800 mb-1">Welcome Back</h1>
          <p className="text-gray-500 text-sm mb-6">Sign in to HealthNest</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-md mb-4">
              {error}
              <div className="mt-1">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium underline">Register as Patient</Link>
              </div>
            </div>
          )}

          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-md font-semibold disabled:opacity-50 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <GoogleSignInButton />

          <p className="text-sm text-center mt-5 text-gray-500">
            No account? <Link to="/register" className="text-teal-700 font-medium hover:underline">Register as Patient</Link>
          </p>
          <p className="text-xs text-center mt-2 text-gray-400">
            Doctors &amp; Admins: your account is created for you by an administrator.
          </p>
        </form>
      </div>
    </div>
  );
}