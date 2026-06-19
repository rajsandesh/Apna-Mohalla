import { useState, useEffect } from "react";
import UserLayout from "../layouts/UserLayout";
import AnnouncementCard from "../components/AnnouncementCard";
import { getAnnouncements } from "../services/api";

// Helper — format ISO date string into "Jun 10, 2024"
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "2-digit",
  });
}

// Announcements page — fetches real data from the backend API
function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Fetch announcements from the backend when the page loads
  useEffect(() => {
    async function load() {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (err) {
        setError("Could not load announcements. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter by search query (title or category)
  const filtered = announcements.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q)
    );
  });

  // Map API response shape to what AnnouncementCard expects
  function toCardProps(a) {
    return {
      id: a.id,
      title: a.title,
      description: a.content,       // API returns "content", card expects "description"
      date: formatDate(a.createdAt), // API returns ISO date, card expects readable string
      category: a.category,
    };
  }

  return (
    <UserLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-sm text-gray-500 mt-1">Stay informed with the latest community updates.</p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="search"
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-3xl mb-3 animate-pulse">📋</div>
          <p>Loading announcements...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Result count */}
      {!loading && !error && (
        <p className="text-sm text-gray-400 mb-4">
          Showing {filtered.length} of {announcements.length} announcements
        </p>
      )}

      {/* Cards grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AnnouncementCard key={a.id} announcement={toCardProps(a)} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-medium">No announcements found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </UserLayout>
  );
}

export default Announcements;
