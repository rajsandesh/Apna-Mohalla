import { useState, useEffect } from "react";
import UserLayout from "../layouts/UserLayout";
import ComplaintTable from "../components/ComplaintTable";
import { submitComplaint, getMyComplaints } from "../services/api";

const categories = ["Maintenance", "Security", "Utilities", "Noise", "Parking", "Water", "Electricity", "Other"];

// Format ISO date to readable string
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "2-digit",
  });
}

// Complaints page — residents submit complaints and view their own complaint history
function Complaints() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Water");
  const [description, setDescription] = useState("");

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Load this resident's complaints on page mount
  useEffect(() => {
    async function load() {
      try {
        const data = await getMyComplaints();
        setHistory(data);
      } catch {
        // Silently fail — table stays empty
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Submit a new complaint to the backend
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      await submitComplaint(title, description, category);
      setSuccessMsg("Complaint submitted successfully!");

      // Reload history to show the new complaint
      const updated = await getMyComplaints();
      setHistory(updated);

      // Clear form
      setTitle("");
      setCategory("Water");
      setDescription("");
    } catch (err) {
      setError(err.message || "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDiscard() {
    setTitle("");
    setCategory("Water");
    setDescription("");
    setError("");
    setSuccessMsg("");
  }

  // Map API response to ComplaintTable's expected shape
  const tableData = history.map((c) => ({
    id: `#CH-${c.id}`,
    title: c.title,
    description: c.description,
    category: c.category,
    date: formatDate(c.createdAt),
    status: c.status,
    resident: c.residentName,
  }));

  const activeCount = history.filter((c) => c.status !== "Resolved").length;
  const resolvedCount = history.filter((c) => c.status === "Resolved").length;

  return (
    <UserLayout>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Lodge a new grievance or track the status of your existing requests.
          </p>
        </div>
        {/* Quick stats */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <span className="text-xl text-blue-600">📋</span>
            <div>
              <p className="text-xs text-gray-400 font-medium">Active</p>
              <p className="text-lg font-bold text-gray-900">{String(activeCount).padStart(2, "0")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <span className="text-xl text-green-500">✔</span>
            <div>
              <p className="text-xs text-gray-400 font-medium">Resolved</p>
              <p className="text-lg font-bold text-gray-900">{String(resolvedCount).padStart(2, "0")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Complaint form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-blue-600 flex items-center gap-2 mb-5">
            ✏ Submit New Complaint
          </h2>

          {/* Success / error banners */}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
              {successMsg}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Complaint Title</label>
                <input
                  type="text"
                  placeholder="Briefly summarize the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                placeholder="Provide detailed information including location and time observed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleDiscard}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>

        {/* Help card */}
        <div className="bg-blue-700 rounded-xl p-6 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-3xl mb-4 mx-auto">🎧</div>
          <div>
            <h3 className="text-lg font-bold text-white mb-3">We're here to help</h3>
            <p className="text-sm text-blue-100 leading-relaxed mb-5">
              Every complaint is assigned a tracking ID and reviewed by our site supervisors within 4 hours of submission.
            </p>
            <button className="px-4 py-2 border border-white/40 text-white text-xs font-semibold rounded-lg hover:bg-white/10 transition">
              View Policies
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-28 h-28 rounded-full bg-blue-600 opacity-30 translate-x-10 translate-y-10" />
        </div>
      </div>

      {/* Complaint history table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">Complaint History</h2>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400 text-center py-8 animate-pulse">Loading your complaints...</p>
        ) : (
          <ComplaintTable complaints={tableData} />
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <span>Showing {tableData.length} complaint{tableData.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </UserLayout>
  );
}

export default Complaints;
