// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLedgers: 0,
    totalEntries: 0,
    totalReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const [ledgersRes, entriesRes, reportsRes] = await Promise.all([
        api.get("/ledgers"),
        api.get("/transactions"),
        api.get("/reports?fromDate=1970-01-01&toDate=2100-01-01"),
      ]);
      setStats({
        totalLedgers: (ledgersRes.data || []).length,
        totalEntries: (entriesRes.data || []).length,
        totalReports: (reportsRes.data || []).length,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Ledgers", value: stats.totalLedgers, link: "/ledgers", color: "bg-blue-500" },
    { title: "Total Entries", value: stats.totalEntries, link: "/entries", color: "bg-green-500" },
    { title: "Reports Generated", value: stats.totalReports, link: "/reports", color: "bg-purple-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h2>

      {loading ? (
        <div className="text-center text-gray-600">Loading dashboard...</div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <Link
              to={card.link}
              key={i}
              className={`${card.color} text-white rounded-2xl shadow-lg p-6 hover:scale-105 transform transition duration-300`}
            >
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
