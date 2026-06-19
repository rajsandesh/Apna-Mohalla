import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../services/api";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "2-digit",
  });
}

// ManageAnnouncements — Admin CRUD page backed by the real API
function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Community");
  const [formContent, setFormContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Load announcements on mount
  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      setLoading(true);
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch {
      setError("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditingId(null);
    setFormTitle("");
    setFormCategory("Community");
    setFormContent("");
    setError("");
    setShowForm(true);
  }

  function handleEdit(a) {
    setEditingId(a.id);
    setFormTitle(a.title);
    setFormCategory(a.category);
    setFormContent(a.content);
    setError("");
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this announcement?")) return;
    try {
      await deleteAnnouncement(id);
      // Remove from local state without re-fetching
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete.");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editingId) {
        // Update existing
        await updateAnnouncement(editingId, formTitle, formContent, formCategory);
      } else {
        // Create new
        await createAnnouncement(formTitle, formContent, formCategory);
      }
      // Reload from server to get fresh data
      await loadAnnouncements();
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Failed to save announcement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Announcements</h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit, and remove community announcements.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
        >
          + Add Announcement
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {/* Inline form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            {editingId ? "Edit Announcement" : "New Announcement"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  placeholder="Announcement title"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                >
                  {["Community", "Maintenance", "Security", "Admin", "Environment"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={3}
                required
                placeholder="Announcement details..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              />
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Announcement"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center py-10 text-gray-400 animate-pulse">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["#", "Title", "Category", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {announcements.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 text-gray-400 font-mono text-xs">{a.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{a.content}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{a.category}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{formatDate(a.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(a)}
                        className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {announcements.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No announcements yet. Click "Add Announcement" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">{announcements.length} total announcements</p>
    </AdminLayout>
  );
}

export default ManageAnnouncements;
