import { Link } from "wouter";

// Feature card data — shown in the "Empowering Your Community" section
const features = [
  {
    id: 1,
    icon: "📢",
    title: "Community Announcements",
    description:
      "Stay informed with real-time broadcasts. From administrative updates to urgent campus alerts, our announcement engine ensures critical information reaches everyone instantly with categorised tagging.",
    highlights: ["Push notifications for urgent alerts", "Targeted department-wide broadcasts"],
    variant: "light",
    link: "/announcements",
    linkLabel: "View Announcements",
  },
  {
    id: 2,
    icon: "⚠",
    title: "Complaint Management",
    description:
      "Transparent resolution system for facility maintenance, student services, and administrative requests. Track every step from submission to resolution.",
    variant: "dark",
    link: "/login",
    linkLabel: "Log a Request →",
  },
  {
    id: 3,
    icon: "📅",
    title: "Community Events",
    description:
      "Discover workshops, town halls, and cultural gatherings. Integrated calendar management with RSVP tracking and automated reminders.",
    dates: ["24 OCT", "12 NOV", "05 DEC"],
    variant: "light",
    link: "/events",
    linkLabel: "See All Events",
  },
];

// Home page — landing page visible before login
function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Top Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <span className="text-lg font-bold text-blue-700">Apna mohalla</span>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Home</a>
          <a href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Features</a>
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">Support</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-700">🔔</button>
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold">S</div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="px-8 pt-16 pb-20 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-12">
          {/* Left: Text content */}
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-6">
              ✦ Launching Apna mohalla 2.0
            </span>
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-2">
              Apna
            </h1>
            <h1 className="text-5xl font-extrabold text-blue-600 leading-tight mb-6">Mohalla</h1>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              Connecting Residents with Community Updates and Services. A professional platform designed for academic, civic, and administrative excellence.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <span className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg cursor-pointer transition">
                  Get Started
                </span>
              </Link>
              <Link href="/login">
                <span className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg cursor-pointer transition">
                  Log In
                </span>
              </Link>
            </div>
          </div>

          {/* Right: Hero image + stats badge */}
          <div className="relative hidden lg:block flex-shrink-0">
            <div className="w-96 h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              {/* Placeholder hero visual */}
              <div className="text-center">
                <div className="text-6xl mb-3">🏢</div>
                <p className="text-blue-600 font-semibold text-sm">Apna mohalla</p>
              </div>
            </div>
            {/* Floating stats card */}
            <div className="absolute -bottom-4 -left-8 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">👥</div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Active Residents</p>
                <p className="text-lg font-bold text-gray-900">12,480+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="bg-gray-50 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Empowering Your Community</h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
              Explore the core modules designed to streamline communication and administrative management in your precinct.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Announcements — light card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-7 flex gap-5 items-start hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xl flex-shrink-0 mt-1">
                📢
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-2">Community Announcements</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                  Stay informed with real-time broadcasts. From administrative updates to urgent alerts, our announcement engine ensures critical information reaches everyone instantly.
                </p>
                <ul className="space-y-1">
                  <li className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="text-blue-600">✓</span> Push notifications for urgent alerts
                  </li>
                  <li className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="text-blue-600">✓</span> Targeted department-wide broadcasts
                  </li>
                </ul>
              </div>
            </div>

            {/* Complaints — dark blue card */}
            <div className="bg-blue-700 rounded-2xl p-7 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                ⚠
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-2">Complaint Management</h3>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Transparent resolution system for facility maintenance, student services, and administrative requests. Track every step from submission to resolution.
                </p>
              </div>
              <Link href="/login">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 text-sm font-semibold rounded-lg cursor-pointer hover:bg-blue-50 transition w-fit">
                  Log a Request →
                </span>
              </Link>
            </div>

            {/* Events — light card, full width */}
            <div className="bg-white rounded-2xl border border-gray-200 p-7 md:col-span-2 flex items-start justify-between gap-5 hover:shadow-md transition-shadow">
              <div className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xl flex-shrink-0 mt-1">
                  📅
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-2">Community Events</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                    Discover workshops, town halls, and cultural gatherings. Integrated calendar management with RSVP tracking and automated reminders.
                  </p>
                </div>
              </div>
              {/* Upcoming date tiles */}
              <div className="hidden md:flex gap-3 flex-shrink-0">
                {[{ d: "24", m: "OCT" }, { d: "12", m: "NOV" }, { d: "05", m: "DEC" }].map((dt) => (
                  <div key={dt.m} className="w-14 h-16 bg-blue-600 rounded-xl flex flex-col items-center justify-center text-white">
                    <span className="text-xl font-bold">{dt.d}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider">{dt.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="px-8 py-20 bg-white">
        <div className="max-w-4xl mx-auto bg-blue-50 rounded-3xl px-12 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to connect your community?</h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Join over 500+ institutional partners using Apna mohalla to manage their smart communities efficiently.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <span className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg cursor-pointer transition">
                Request a Demo
              </span>
            </Link>
            <Link href="/login">
              <span className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg cursor-pointer transition">
                Contact Sales
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 px-8 py-6 flex items-center justify-between text-xs text-gray-400">
        <div>
          <span className="font-bold text-blue-600 text-sm">Apna mohalla</span>
          <span className="ml-3">© 2026 Apna mohalla Community Management</span>
        </div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-gray-600 transition">About</a>
          <a href="#" className="hover:text-gray-600 transition">Contact</a>
          <a href="#" className="hover:text-gray-600 transition">Help Center</a>
        </div>
        <div className="flex gap-3">
          <a href="#" className="hover:text-gray-600 transition">📸</a>
          <a href="#" className="hover:text-gray-600 transition">🐦</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
