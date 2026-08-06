import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-teal-800 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow">
        <span className="text-xl font-bold">HealthNest</span>
        {!user ? (
          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-1.5 rounded text-sm hover:bg-teal-700">Login</Link>
            <Link to="/register" className="bg-white text-teal-800 hover:bg-teal-50 px-4 py-1.5 rounded text-sm font-semibold">
              Register as Patient
            </Link>
          </div>
        ) : (
          <Link to="/dashboard" className="bg-white text-teal-800 hover:bg-teal-50 px-4 py-1.5 rounded text-sm font-semibold">
            Go to Dashboard
          </Link>
        )}
      </nav>

      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
          One Platform for Appointments, Records, and Care
        </h1>
        <p className="text-teal-100 text-lg max-w-2xl mx-auto mb-10">
          HealthNest connects patients, doctors, and administrators — book appointments,
          access verified medical history, and manage prescriptions and billing, all in one place.
        </p>
        {!user && (
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-teal-800 hover:bg-teal-50 px-6 py-3 rounded-md font-semibold">
              Register as a Patient
            </Link>
            <Link to="/login" className="border border-white/60 hover:bg-white/10 px-6 py-3 rounded-md font-semibold">
              Sign In
            </Link>
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Built for Three Roles</h2>
        <p className="text-center text-gray-500 mb-12">Each with exactly the tools they need — nothing more.</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="border rounded-xl p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl mb-4">P</div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Patients</h3>
            <p className="text-sm text-gray-600 mb-3">
              Register once, get a permanent Health ID and QR code. Book appointments and
              track your diagnosis, prescription, and vaccination history from any device.
            </p>
            <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
              <li>Portable digital health card</li>
              <li>Online appointment booking</li>
              <li>Full visit history at a glance</li>
            </ul>
          </div>

          <div className="border rounded-xl p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl mb-4">D</div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Doctors</h3>
            <p className="text-sm text-gray-600 mb-3">
              Scan a patient's QR to instantly pull verified history. Manage your appointment
              schedule and log diagnoses, prescriptions, and vaccinations in seconds.
            </p>
            <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
              <li>Camera-based QR scanning</li>
              <li>Structured diagnosis entry</li>
              <li>Credentialed accounts only</li>
            </ul>
          </div>

          <div className="border rounded-xl p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl mb-4">A</div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Administrators</h3>
            <p className="text-sm text-gray-600 mb-3">
              Verify patient registrations, onboard doctors, manage departments, and monitor
              real-time disease outbreak alerts across facilities.
            </p>
            <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
              <li>Automatic outbreak detection</li>
              <li>Department &amp; disease analytics</li>
              <li>Full audit trail</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 border-t py-8 text-center text-sm text-gray-500">
        HealthNest — an integrated patient management system.
      </footer>
    </div>
  );
}