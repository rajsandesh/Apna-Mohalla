// ComplaintTable — shows a list of complaints in a table format
// Used on both the Complaints page (user history) and ManageComplaints page (admin)
function ComplaintTable({ complaints, showActions = false, onMarkResolved }) {
  // Color map for status badges
  const statusColors = {
    Pending: "bg-orange-100 text-orange-700",
    Resolved: "bg-green-100 text-green-700",
    "In Review": "bg-blue-100 text-blue-700",
    Urgent: "bg-red-100 text-red-700",
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            {/* Show Actions column only for admin view */}
            {showActions && (
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {complaints.map((complaint) => (
            <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
              {/* Complaint ID */}
              <td className="px-5 py-4 font-medium text-blue-600">{complaint.id}</td>

              {/* Title + optional subtitle */}
              <td className="px-5 py-4">
                <p className="font-medium text-gray-800">{complaint.title}</p>
                {complaint.description && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{complaint.description}</p>
                )}
              </td>

              {/* Category badge */}
              <td className="px-5 py-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {complaint.category}
                </span>
              </td>

              {/* Date */}
              <td className="px-5 py-4 text-gray-500">{complaint.date}</td>

              {/* Status badge */}
              <td className="px-5 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[complaint.status] || "bg-gray-100 text-gray-600"}`}>
                  ● {complaint.status}
                </span>
              </td>

              {/* Mark as Resolved button — only shown in admin view */}
              {showActions && (
                <td className="px-5 py-4">
                  {complaint.status !== "Resolved" ? (
                    <button
                      onClick={() => onMarkResolved && onMarkResolved(complaint.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">Resolved</span>
                  )}
                </td>
              )}
            </tr>
          ))}

          {/* Empty state when no complaints exist */}
          {complaints.length === 0 && (
            <tr>
              <td colSpan={showActions ? 6 : 5} className="px-5 py-10 text-center text-gray-400 text-sm">
                No complaints found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintTable;
