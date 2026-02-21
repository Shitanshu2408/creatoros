export default function StatCard({
  title,
  value,
  prefix = "",
  trend = null, // optional: +12%, -5%
}) {
  const isPositive = trend && trend.startsWith("+");

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      
      {/* Title */}
      <p className="text-sm text-gray-500 font-medium">
        {title}
      </p>

      {/* Value */}
      <div className="flex items-end justify-between mt-3">
        <h3 className="text-2xl font-semibold text-gray-800 tracking-tight">
          {prefix}{value}
        </h3>

        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-md ${
              isPositive
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}