import { useAuth } from "../context/AuthContext";

// Navbar — shows real logged-in user's name from AuthContext
function Navbar() {
  const { user } = useAuth();

  // Use the real name from the JWT token, fall back to placeholder
  const userName = user?.fullName || "Guest";
  const userRole = user?.role || "";

  // Generate initials from full name (e.g. "Ali Ahmed" → "AA")
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 sticky top-0 z-10">
      {/* Search bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="search"
            placeholder="Search announcements or events..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Right side — bell + real user info */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          {/* Avatar with initials */}
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{userName}</p>
            <p className="text-xs text-gray-400">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
