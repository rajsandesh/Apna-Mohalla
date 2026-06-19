// DashboardCard — reusable stat card shown at the top of dashboards
// Props: title, value, badge, icon, badgeColor
function DashboardCard({ title, value, badge, icon, badgeColor = "text-green-600 bg-green-50" }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
      {/* Top row — icon and badge */}
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
          {icon}
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Stat title */}
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>

      {/* Stat value */}
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default DashboardCard;
