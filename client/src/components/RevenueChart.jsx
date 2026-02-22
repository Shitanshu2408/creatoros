import { useEffect, useState } from "react";
import api from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/payments/monthly-revenue")
      .then((res) => {

        // SAFE CHECK
        if (!res.data || !Array.isArray(res.data)) {
          console.warn("Invalid chart data:", res.data);
          setData([]);
          return;
        }

        const formatted = res.data.map((item) => ({
          month: item.month
            ? new Date(item.month).toLocaleDateString("en-IN", {
                month: "short",
                year: "2-digit",
              })
            : "Unknown",
          revenue: Number(item.revenue || 0),
        }));

        setData(formatted);
      })
      .catch((err) => {
        console.error("Revenue chart error:", err);
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // SAFE FALLBACK
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400">
        Loading chart...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400">
        No revenue data available
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] sm:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
          />

          <YAxis tick={{ fontSize: 12 }} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="rgb(59,130,246)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}