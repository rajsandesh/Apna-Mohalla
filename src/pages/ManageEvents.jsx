import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../services/api";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function getDay(iso) { return new Date(iso).getDate(); }
function getMonth(iso) { return MONTHS[new Date(iso).getMonth()]; }

// ManageEvents — Admin CRUD page backed by the real API
function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");   // datetime-local input value
  const [formLocation, setFormLocation] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch {
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditingId(null);
    setFormTitle("");
    setFormDate("");
    setFormLocation("");
    setFormDesc("");
    setError("");
    setShowForm(true);
  }

  function handleEdit(ev) {
    setEditingId(ev.id);
    setFormTitle(ev.title);
    // Convert ISO to "YYYY-MM-DDTHH:MM" for datetime-local input
    setFormDate(ev.eventDate ? ev.eventDate.slice(0, 16) : "");
    setFormLocation(ev.location);
    setFormDesc(ev.description);
    setError("");
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete event.");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      // datetime-local gives "YYYY-MM-DDTHH:MM", convert to ISO
      const isoDate = new Date(formDate).toISOString();

      if (editingId) {
        await updateEvent(editingId, formTitle, formDesc, formLocation, isoDate);
      } else {
        await createEvent(formTitle, formDesc, formLocation, isoDate);
      }
      await loadEvents();
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Failed to save event.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit, and remove community events.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
        >
          + Add Event
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
            {editingId ? "Edit Event" : "New Event"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Name</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  placeholder="e.g. Annual Sports Day"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date & Time</label>
                {/* datetime-local input — easy date+time picker */}
                <input
                  type="datetime-local"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Community Hall"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={3}
                placeholder="Describe the event..."
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
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center py-10 text-gray-400 animate-pulse">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Date", "Event Name", "Location", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    <div className="w-11 h-11 bg-blue-600 rounded-lg flex flex-col items-center justify-center text-white">
                      <span className="text-base font-bold leading-tight">{getDay(ev.eventDate)}</span>
                      <span className="text-xs uppercase tracking-wide">{getMonth(ev.eventDate)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{ev.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{ev.description}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{ev.location}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(ev)}
                        className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No events yet. Click "Add Event" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">{events.length} total events</p>
    </AdminLayout>
  );
}

export default ManageEvents;
