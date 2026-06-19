import { useState, useEffect } from "react";
import UserLayout from "../layouts/UserLayout";
import DashboardCard from "../components/DashboardCard";
import { getAnnouncements, getMyComplaints, getEvents } from "../services/api";
import { useAuth } from "../context/AuthContext";

const guidelines = [
  "Trash pickup: Mon, Wed, Fri",
  "Quiet hours: 10 PM – 7 AM",
  "Parking Permit required in Lot B",
];

// Resident Dashboard — shows real stats pulled from the backend API
function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(" ")[0] || "Resident";

  const [announcementCount, setAnnouncementCount] = useState("-");
  const [complaints, setComplaints] = useState([]);
  const [eventCount, setEventCount] = useState("-");
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    async function load() {
      try {
        // Fetch all three in parallel for speed
        const [ann, comp, evts] = await Promise.all([
          getAnnouncements(),
          getMyComplaints(),
          getEvents(),
        ]);

        setAnnouncementCount(ann.length);
        setComplaints(comp);
        setEventCount(evts.length);

        // Build recent updates feed from announcements (last 3)
        setRecentUpdates(
          ann.slice(0, 3).map((a) => ({
            id: a.id,
            type: a.category.toUpperCase(),
            title: a.title,
            description: a.content,
            time: timeAgo(a.createdAt),
            icon: categoryIcon(a.category),
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            typeColor: "text-blue-600 bg-blue-50",
          }))
        );
      } catch {
        // If backend is offline, show placeholders
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // How long ago was this date?
  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  // Pick an emoji icon based on category
  function categoryIcon(category) {
    const map = { Maintenance: "💧", Security: "🔒", Community: "👥", Admin: "📋", Environment: "🌿" };
    return map[category] || "📢";
  }

  const pendingCount = complaints.filter((c) => c.status === "Pending").length;

  return (
    <UserLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}</h1>
        <p className="text-sm text-gray-500 mt-1">Here is what is happening in Apna mohalla today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <DashboardCard
          title="Active Announcements"
          value={loading ? "..." : String(announcementCount)}
          badge="Live"
          icon="📢"
          badgeColor="text-blue-600 bg-blue-50"
        />
        <DashboardCard
          title="My Complaints"
          value={loading ? "..." : String(complaints.length)}
          badge={`${pendingCount} Pending`}
          icon="⚠"
          badgeColor="text-orange-600 bg-orange-50"
        />
        <DashboardCard
          title="Upcoming Events"
          value={loading ? "..." : String(eventCount)}
          badge="This week"
          icon="📅"
          badgeColor="text-green-600 bg-green-50"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Updates Feed */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Recent Announcements</h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 animate-pulse">
              Loading updates...
            </div>
          ) : recentUpdates.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
              No announcements yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
              {recentUpdates.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-5 hover:bg-gray-50 transition">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.iconBg} ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${item.typeColor}`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{item.time}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Community Guidelines</h3>
            <ul className="space-y-2.5">
              {guidelines.map((g) => (
                <li key={g} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-blue-500 flex-shrink-0">✔</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default Dashboard;
