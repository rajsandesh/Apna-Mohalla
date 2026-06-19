import { useEffect, useState } from "react";
import { Link } from "wouter";
import AdminLayout from "../layouts/AdminLayout";
import DashboardCard from "../components/DashboardCard";
import { getAllComplaints, getAnnouncements, getEvents, getAllUsers } from "../services/api";

const quickActions = [
  { icon: "➕", label: "New Announcement", sub: "Post to community board", link: "/admin/announcements" },
  { icon: "⚠", label: "Manage Complaints", sub: "Review resident requests", link: "/admin/complaints" },
  { icon: "📅", label: "Manage Events", sub: "Create or update events", link: "/admin/events" },
];

const statusColors = {
  Pending: "text-orange-600 bg-orange-50",
  Resolved: "text-green-600 bg-green-50",
  "In Review": "text-blue-600 bg-blue-50",
};

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [residentCount, setResidentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [allComplaints, announcements, events, users] = await Promise.all([
          getAllComplaints(),
          getAnnouncements(),
          getEvents(),
          getAllUsers(),
        ]);

        setComplaints(allComplaints);
        setAnnouncementCount(announcements.length);
        setEventCount(events.length);
        setResidentCount(users.filter((u) => u.role === "Resident").length);
      } catch {
        // Stats stay at defaults if the API is unavailable.
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const activeComplaints = complaints.filter((c) => c.status !== "Resolved").length;
  const recentComplaints = complaints.slice(0, 4);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Community activity at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Residents"
          value={loading ? "..." : String(residentCount)}
          badge="Registered"
          icon="👥"
          badgeColor="text-green-600 bg-green-50"
        />
        <DashboardCard
          title="Active Complaints"
          value={loading ? "..." : String(activeComplaints)}
          badge="Open"
          icon="⚠"
          badgeColor="text-red-500 bg-red-50"
        />
        <DashboardCard
          title="Announcements"
          value={loading ? "..." : String(announcementCount)}
          badge="Total"
          icon="📢"
          badgeColor="text-blue-600 bg-blue-50"
        />
        <DashboardCard
          title="Scheduled Events"
          value={loading ? "..." : String(eventCount)}
          badge="Upcoming"
          icon="📅"
          badgeColor="text-purple-600 bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-800">Recent Complaints</h2>
            <Link href="/admin/complaints">
              <span className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">View all</span>
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">Loading complaints...</p>
          ) : recentComplaints.length === 0 ? (
            <p className="text-sm text-gray-400">No complaints yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr>
                    {["ID", "Resident", "Category", "Status"].map((h) => (
                      <th key={h} className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide px-2">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-2 text-blue-600 font-medium">#{c.id}</td>
                      <td className="py-3 px-2 text-gray-700">{c.residentName || "Resident"}</td>
                      <td className="py-3 px-2 text-gray-500">{c.category}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded uppercase tracking-wide ${statusColors[c.status] || "bg-gray-100 text-gray-500"}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.link}>
                <span className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition group">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm group-hover:bg-blue-200 transition">
                    {action.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{action.label}</p>
                    <p className="text-xs text-gray-400">{action.sub}</p>
                  </div>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
