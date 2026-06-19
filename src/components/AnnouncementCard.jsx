// AnnouncementCard — displays a single announcement with title, date, category, and description
function AnnouncementCard({ announcement }) {
  const { title, description, date, category } = announcement;

  // Map category names to background colors for the badge
  const categoryColors = {
    Maintenance: "bg-orange-100 text-orange-700",
    Community: "bg-blue-100 text-blue-700",
    Environment: "bg-green-100 text-green-700",
    Admin: "bg-purple-100 text-purple-700",
    Security: "bg-red-100 text-red-700",
  };

  const badgeClass = categoryColors[category] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Top row — category badge + date */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${badgeClass}`}>
          {category}
        </span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>

      {/* Description — truncated after 2 lines */}
      <p className="text-sm text-gray-500 line-clamp-2">{description}</p>

      {/* Read more link */}
      <button className="mt-3 text-sm text-blue-600 font-medium hover:underline focus:outline-none">
        Read more →
      </button>
    </div>
  );
}

export default AnnouncementCard;
