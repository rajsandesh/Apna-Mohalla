import { useState, useEffect } from "react";
import UserLayout from "../layouts/UserLayout";
import EventCard from "../components/EventCard";
import { getEvents } from "../services/api";

// Month abbreviations for the date tile
const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

// Convert an API event to the shape EventCard expects




function toCardProps(ev) {
  const d = new Date(ev.eventDate);
  return {
    id: ev.id,
    name: ev.title,                  // API: "title" → Card: "name"
    day: d.getDate(),                // Extract day number from eventDate
    month: MONTHS[d.getMonth()],     // Extract month abbreviation
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    location: ev.location,
    description: ev.description,
  };
}

// Events page — fetches real community events from the backend API
function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError("Could not load events. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = events.map(toCardProps);

  return (
    <UserLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Community Events</h1>
        <p className="text-sm text-gray-500 mt-1">Discover workshops, town halls, and cultural gatherings near you.</p>
      </div>

      {/* Date tiles row — quick visual overview */}
      {!loading && cards.length > 0 && (
        <div className="flex gap-3 mb-8 overflow-x-auto pb-1">
          {cards.slice(0, 5).map((ev) => (
            <div
              key={ev.id}
              className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-xl flex flex-col items-center justify-center text-white cursor-pointer hover:bg-blue-700 transition"
            >
              <span className="text-xl font-bold leading-tight">{ev.day}</span>
              <span className="text-xs font-semibold uppercase tracking-wider">{ev.month}</span>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-3xl mb-3 animate-pulse">📅</div>
          <p>Loading events...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Count */}
      {!loading && !error && (
        <p className="text-sm text-gray-400 mb-4">{cards.length} upcoming events</p>
      )}

      {/* Event cards */}
      {!loading && cards.length > 0 && (
        <div className="flex flex-col gap-4">
          {cards.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && cards.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📅</div>
          <p className="font-medium">No events scheduled yet</p>
          <p className="text-sm mt-1">Check back soon for upcoming community events</p>
        </div>
      )}
    </UserLayout>
  );
}

export default Events;
