// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Home() {
//   const { user } = useAuth();

//   return (
//     <div className="min-h-screen bg-white">
//       <nav className="bg-teal-800 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow">
//         <span className="text-xl font-bold">HealthNest</span>
//         {!user ? (
//           <div className="flex gap-3">
//             <Link to="/login" className="px-4 py-1.5 rounded text-sm hover:bg-teal-700">Login</Link>
//             <Link to="/register" className="bg-white text-teal-800 hover:bg-teal-50 px-4 py-1.5 rounded text-sm font-semibold">
//               Register as Patient
//             </Link>
//           </div>
//         ) : (
//           <Link to="/dashboard" className="bg-white text-teal-800 hover:bg-teal-50 px-4 py-1.5 rounded text-sm font-semibold">
//             Go to Dashboard
//           </Link>
//         )}
//       </nav>

//       <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white px-6 py-24 text-center">
//         <h1 className="text-5xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
//           One Platform for Appointments, Records, and Care
//         </h1>
//         <p className="text-teal-100 text-lg max-w-2xl mx-auto mb-10">
//           HealthNest connects patients, doctors, and administrators — book appointments,
//           access verified medical history, and manage prescriptions and billing, all in one place.
//         </p>
//         {!user && (
//           <div className="flex gap-4 justify-center">
//             <Link to="/register" className="bg-white text-teal-800 hover:bg-teal-50 px-6 py-3 rounded-md font-semibold">
//               Register as a Patient
//             </Link>
//             <Link to="/login" className="border border-white/60 hover:bg-white/10 px-6 py-3 rounded-md font-semibold">
//               Sign In
//             </Link>
//           </div>
//         )}
//       </section>

//       <section className="max-w-6xl mx-auto px-6 py-20">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Built for Three Roles</h2>
//         <p className="text-center text-gray-500 mb-12">Each with exactly the tools they need — nothing more.</p>

//         <div className="grid md:grid-cols-3 gap-8">
//           <div className="border rounded-xl p-6 hover:shadow-lg transition">
//             <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl mb-4">P</div>
//             <h3 className="font-semibold text-lg text-gray-800 mb-2">Patients</h3>
//             <p className="text-sm text-gray-600 mb-3">
//               Register once, get a permanent Health ID and QR code. Book appointments and
//               track your diagnosis, prescription, and vaccination history from any device.
//             </p>
//             <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
//               <li>Portable digital health card</li>
//               <li>Online appointment booking</li>
//               <li>Full visit history at a glance</li>
//             </ul>
//           </div>

//           <div className="border rounded-xl p-6 hover:shadow-lg transition">
//             <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl mb-4">D</div>
//             <h3 className="font-semibold text-lg text-gray-800 mb-2">Doctors</h3>
//             <p className="text-sm text-gray-600 mb-3">
//               Scan a patient's QR to instantly pull verified history. Manage your appointment
//               schedule and log diagnoses, prescriptions, and vaccinations in seconds.
//             </p>
//             <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
//               <li>Camera-based QR scanning</li>
//               <li>Structured diagnosis entry</li>
//               <li>Credentialed accounts only</li>
//             </ul>
//           </div>

//           <div className="border rounded-xl p-6 hover:shadow-lg transition">
//             <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl mb-4">A</div>
//             <h3 className="font-semibold text-lg text-gray-800 mb-2">Administrators</h3>
//             <p className="text-sm text-gray-600 mb-3">
//               Verify patient registrations, onboard doctors, manage departments, and monitor
//               real-time disease outbreak alerts across facilities.
//             </p>
//             <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
//               <li>Automatic outbreak detection</li>
//               <li>Department &amp; disease analytics</li>
//               <li>Full audit trail</li>
//             </ul>
//           </div>
//         </div>
//       </section>

//       <footer className="bg-gray-50 border-t py-8 text-center text-sm text-gray-500">
//         HealthNest — an integrated patient management system.
//       </footer>
//     </div>
//   );
// }
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CalendarDays,
  ShieldCheck,
  Stethoscope,
  Users,
  FileHeart,
  QrCode,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm group-hover:bg-teal-800 transition">
              <HeartPulse className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-teal-800 leading-none">
                HealthNest
              </h1>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Digital Healthcare
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-teal-700 hover:bg-teal-50 transition"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="bg-teal-700 hover:bg-teal-800 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-teal-700 hover:bg-teal-800 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition"
              >
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-teal-100/50">

        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-teal-100/50 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 lg:py-28">

          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* LEFT */}
            <div>

              <div className="inline-flex items-center gap-2 bg-white border border-teal-100 text-teal-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Smart & Connected Healthcare
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.08] tracking-tight">
                Healthcare made
                <span className="text-teal-700"> simpler.</span>
              </h1>

              <p className="mt-6 text-gray-600 text-base sm:text-lg leading-8 max-w-xl">
                HealthNest brings patients, doctors, and administrators
                together on one secure platform for appointments, medical
                records, prescriptions, and healthcare management.
              </p>

              {!user && (
                <div className="flex flex-col sm:flex-row gap-3 mt-8">

                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-teal-700/20 transition"
                  >
                    Register as Patient
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-teal-300 hover:bg-teal-50 text-gray-700 px-6 py-3.5 rounded-xl font-semibold transition"
                  >
                    Sign In
                  </Link>

                </div>
              )}

              {/* Trust points */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Secure records
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Easy appointments
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Verified access
                </span>
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="relative hidden md:block">

              <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-teal-900/10 p-6 max-w-md mx-auto">

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-gray-400">
                      HealthNest
                    </p>
                    <h3 className="text-lg font-bold text-gray-800">
                      Healthcare Overview
                    </h3>
                  </div>

                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-teal-700" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">

                  <DemoCard
                    icon={<CalendarDays />}
                    title="Appointments"
                    value="24"
                  />

                  <DemoCard
                    icon={<FileHeart />}
                    title="Medical Records"
                    value="12"
                  />

                  <DemoCard
                    icon={<Users />}
                    title="Patients"
                    value="850+"
                  />

                  <DemoCard
                    icon={<ShieldCheck />}
                    title="Secure"
                    value="24/7"
                  />

                </div>

                <div className="mt-4 bg-teal-50 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center">
                    <Clock3 className="w-5 h-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Everything in one place
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Manage your healthcare journey with ease.
                    </p>
                  </div>
                </div>

              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-4 bg-white border shadow-lg rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-800">
                    Verified Healthcare
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Secure & organized
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20">

        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            One connected platform
          </span>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Everything you need for better care
          </h2>

          <p className="text-gray-500 mt-3">
            Designed to make healthcare management simple for every role.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <RoleCard
            icon={<Users />}
            badge="PATIENTS"
            title="Your health, always with you"
            description="Manage your appointments and access your important healthcare information from one convenient platform."
            features={[
              "Digital Health ID",
              "Online appointment booking",
              "Medical history",
              "Prescription & vaccination records",
            ]}
          />

          <RoleCard
            icon={<Stethoscope />}
            badge="DOCTORS"
            title="Focus more on your patients"
            description="Access verified patient information and manage your clinical workflow without unnecessary paperwork."
            features={[
              "QR-based patient access",
              "Appointment management",
              "Diagnosis records",
              "Prescription management",
            ]}
          />

          <RoleCard
            icon={<ShieldCheck />}
            badge="ADMINISTRATORS"
            title="Manage healthcare efficiently"
            description="Monitor your platform, verify users, manage departments, and gain meaningful operational insights."
            features={[
              "User verification",
              "Doctor onboarding",
              "Department management",
              "Analytics & monitoring",
            ]}
          />

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20">

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Healthcare without the complexity
            </h2>

            <p className="text-gray-500 mt-3">
              A simple experience from registration to treatment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <Step
              number="01"
              icon={<Users />}
              title="Create your account"
              text="Patients can register securely and create their digital healthcare profile."
            />

            <Step
              number="02"
              icon={<CalendarDays />}
              title="Book an appointment"
              text="Find the right doctor and manage your appointments from one place."
            />

            <Step
              number="03"
              icon={<QrCode />}
              title="Access your records"
              text="Keep important medical information organized and available when needed."
            />

          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16">

        <div className="bg-teal-800 rounded-3xl p-8 md:p-12 text-white">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            <div>
              <p className="text-teal-200 text-xs font-bold uppercase tracking-wider">
                Need assistance?
              </p>

              <h2 className="text-3xl font-bold mt-2">
                We're here to help.
              </h2>

              <p className="text-teal-100 mt-4 max-w-lg leading-7">
                Have questions about HealthNest, your account, appointments,
                or the platform? Reach out to our support team.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">

              <ContactCard
                icon={<Mail />}
                title="Email"
                value="support@healthnest.com"
              />

              <ContactCard
                icon={<Phone />}
                title="Phone"
                value="+91 XXXXX XXXXX"
              />

              <ContactCard
                icon={<MapPin />}
                title="Location"
                value="Tamil Nadu, India"
              />

              <ContactCard
                icon={<Clock3 />}
                title="Support"
                value="Mon - Fri"
              />

            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-950 text-gray-400">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">

          <div className="grid md:grid-cols-2 gap-8">

            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-teal-700 rounded-lg flex items-center justify-center text-white">
                  <HeartPulse className="w-5 h-5" />
                </div>

                <span className="text-white text-lg font-bold">
                  HealthNest
                </span>
              </div>

              <p className="text-sm mt-3 max-w-md leading-6">
                An integrated healthcare management platform connecting
                patients, doctors, and administrators.
              </p>
            </div>

            <div className="md:text-right">
              <p className="text-white font-semibold mb-2">
                Contact
              </p>

              <p className="text-sm">
                support@healthnest.com
              </p>

              <p className="text-sm mt-1">
                +91 XXXXX XXXXX
              </p>
            </div>

          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs">
            <span>
              © {new Date().getFullYear()} HealthNest. All rights reserved.
            </span>

            <span>
              Secure • Simple • Connected Healthcare
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
}


/* ================= COMPONENTS ================= */

function DemoCard({ icon, title, value }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
      <div className="w-9 h-9 rounded-lg bg-white text-teal-700 flex items-center justify-center shadow-sm">
        {icon}
      </div>

      <p className="text-2xl font-bold text-gray-800 mt-3">
        {value}
      </p>

      <p className="text-xs text-gray-500">
        {title}
      </p>
    </div>
  );
}


function RoleCard({ icon, badge, title, description, features }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      <div className="flex items-center justify-between mb-5">

        <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
          {icon}
        </div>

        <span className="text-[10px] font-bold tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
          {badge}
        </span>

      </div>

      <h3 className="text-xl font-bold text-gray-800">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-3 leading-6">
        {description}
      </p>

      <div className="mt-5 space-y-2.5">

        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            {feature}
          </div>
        ))}

      </div>
    </div>
  );
}


function Step({ number, icon, title, text }) {
  return (
    <div className="text-center">

      <div className="relative inline-flex">

        <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-lg shadow-teal-700/20">
          {icon}
        </div>

        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border text-[10px] font-bold text-teal-700 flex items-center justify-center shadow-sm">
          {number}
        </span>

      </div>

      <h3 className="font-semibold text-gray-800 mt-5">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto leading-6">
        {text}
      </p>

    </div>
  );
}


function ContactCard({ icon, title, value }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <p className="text-[11px] text-teal-200">
            {title}
          </p>

          <p className="text-sm font-medium text-white">
            {value}
          </p>
        </div>

      </div>
    </div>
  );
}
