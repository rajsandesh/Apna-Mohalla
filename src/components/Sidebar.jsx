import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";

const userNavItems = [
  { label: "Dashboard", path: "/dashboard", icon: "⊞" },
  { label: "Announcements", path: "/announcements", icon: "📢" },
  { label: "Complaints", path: "/complaints", icon: "⚠" },
  { label: "Events", path: "/events", icon: "📅" },
];

const adminNavItems = [
  { label: "Dashboard", path: "/admin", icon: "⊞" },
  { label: "Announcements", path: "/admin/announcements", icon: "📢" },
  { label: "Complaints", path: "/admin/complaints", icon: "⚠" },
  { label: "Events", path: "/admin/events", icon: "📅" },
];

// Sidebar — uses real auth context for logout and role-based nav
function Sidebar({ role = "user" }) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const navItems = role === "admin" ? adminNavItems : userNavItems;
  const portalLabel = role === "admin" ? "Admin Access" : "Resident Access";

  // Log out and go back to home page
  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  return (
    <aside className="w-52 min-h-screen bg-white border-r border-gray-200 flex flex-col py-6 px-3 fixed top-0 left-0 z-20">
      {/* Brand */}
      <div className="px-3 mb-8">
        <p className="text-base font-bold text-blue-700 leading-tight">Community Portal</p>
        <p className="text-xs text-gray-400 mt-0.5">{portalLabel}</p>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <span
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="mt-auto flex flex-col gap-2">
        {role === "user" && (
          <Link href="/complaints">
            <span className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg cursor-pointer transition-colors">
              + Submit Request
            </span>
          </Link>
        )}
        {/* Real logout — clears token from localStorage */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
        >
          <span>↩</span> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
