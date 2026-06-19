// EventCard — displays a single community event with date, name, time, location, and description
function EventCard({ event }) {
  const { name, day, month, description, location, time } = event;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow flex gap-4">
      {/* Date block — styled like a calendar tile */}
      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-blue-600 flex flex-col items-center justify-center text-white">
        <span className="text-2xl font-bold leading-tight">{day}</span>
        <span className="text-xs font-semibold uppercase tracking-wider">{month}</span>
      </div>

      {/* Event details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-800 truncate">{name}</h3>
        <p className="text-xs text-gray-400 mt-0.5 mb-2">
          {time} · {location}
        </p>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}

export default EventCard;
