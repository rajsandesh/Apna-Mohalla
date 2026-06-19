import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { getAllComplaints, resolveComplaint } from "../services/api";

const FILTERS = ["All", "Pending", "Resolved"];

const statusColors = {
  Pending: "text-orange-600 bg-orange-50",
  Resolved: "text-green-600 bg-green-50",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "2-digit",
  });
}

// ManageComplaints — Admin view backed by real API
function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    loadComplaints();
  }, []);

  async function loadComplaints() {
    try {
      setLoading(true);
      const data = await getAllComplaints();
      setComplaints(data);
    } catch {
      setError("Failed to load complaints. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkResolved(id) {
    try {
      await resolveComplaint(id);
      // Update local state — no need to re-fetch
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "Resolved", resolvedAt: new Date().toISOString() } : c
        )
      );
    } catch (err) {
      setError(err.message || "Failed to resolve complaint.");
    }
  }

  const filtered =
    activeFilter === "All" ? complaints : complaints.filter((c) => c.status === activeFilter);

  const totalActive = complaints.filter((c) => c.status !== "Resolved").length;
  const highPriority = complaints.filter((c) => c.status === "Pending").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <AdminLayout>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor, respond to, and resolve community concerns in real-time.</p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Total Active</p>
            <p className="text-3xl font-bold text-gray-900">{totalActive}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl">📋</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">High Priority</p>
            <p className="text-3xl font-bold text-gray-900">{highPriority}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl">❗</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Resolved</p>
            <p className="text-3xl font-bold text-gray-900">{resolvedCount}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-green-500 text-xl">✅</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900">{complaints.length}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl">📊</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-base font-semibold text-gray-800">Resident Complaints</h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  activeFilter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center py-10 text-gray-400 animate-pulse">Loading complaints...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  {["ID", "Resident Name", "Category", "Date Submitted", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left pb-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-3 font-medium text-blue-600">#{c.id}</td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                          {c.residentName?.split(" ").map((n) => n[0]).join("") || "?"}
                        </div>
                        <span className="text-gray-700 font-medium">{c.residentName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-gray-500">{c.category}</td>
                    <td className="py-4 px-3 text-gray-500">{formatDate(c.createdAt)}</td>
                    <td className="py-4 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[c.status] || "bg-gray-100 text-gray-600"}`}>
                        ● {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      {c.status !== "Resolved" ? (
                        <button
                          onClick={() => handleMarkResolved(c.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium px-3">Resolved ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                      No complaints in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <span>Showing {filtered.length} of {complaints.length} entries</span>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageComplaints;
