import { useEffect, useState } from "react";
import api from "../api/api";
import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import AppLayout from "../components/AppLayout";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-400 text-base sm:text-lg animate-pulse">
            Loading dashboard...
          </div>
        </div>
      ) : !data ? (
        <div className="flex items-center justify-center min-h-[50vh] text-gray-500">
          Failed to load dashboard data.
        </div>
      ) : (
        <div className="space-y-10">

          {/* Header */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Welcome back 👋
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Here’s an overview of your performance.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <StatCard
              title="Revenue"
              value={Number(data.total_revenue || 0).toLocaleString("en-IN")}
              prefix="₹ "
            />

            <StatCard
              title="Projects"
              value={Number(data.total_projects || 0)}
            />

            <StatCard
              title="Clients"
              value={Number(data.total_clients || 0)}
            />

            <StatCard
              title="Pending"
              value={Number(data.total_pending || 0).toLocaleString("en-IN")}
              prefix="₹ "
            />

          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Revenue Overview
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Monthly revenue trend
              </p>
            </div>

            <RevenueChart />
          </div>

        </div>
      )}
    </AppLayout>
  );
}