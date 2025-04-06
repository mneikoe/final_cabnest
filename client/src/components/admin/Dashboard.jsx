import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard statistics");
        setLoading(false);
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="h-12 w-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl max-w-md flex items-center space-x-3">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-8 lg:px-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Real-time transportation insights</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Students",
            value: stats?.totalStudents,
            icon: "👥",
            color: "from-blue-500 to-blue-400",
          },
          {
            title: "Active Bookings",
            value: stats?.activeBookings,
            icon: "🚌",
            color: "from-green-500 to-green-400",
          },
          {
            title: "Today's Slots",
            value: stats?.todaySlotsCount,
            icon: "⏱️",
            color: "from-purple-500 to-purple-400",
          },
          {
            title: "Slot Utilization",
            value: stats?.slotUtilization || "0%",
            icon: "📊",
            color: "from-orange-500 to-orange-400",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br hover:shadow-lg transition-shadow duration-300 group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{stat.icon}</span>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg opacity-20 group-hover:opacity-30 transition-opacity`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value || 0}
                </div>
                <CardTitle className="text-sm text-gray-600 mt-2">
                  {stat.title}
                </CardTitle>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Bookings Distribution
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Location-wise student distribution
            </p>
          </CardHeader>
          <CardContent>
            {stats?.bookingsByLocation?.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="60%" height="100%">
                  <BarChart data={stats.bookingsByLocation}>
                    <XAxis
                      dataKey="_id"
                      tick={{ fill: "#6b7280" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      tick={{ fill: "#6b7280" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No location data available
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default Dashboard;
