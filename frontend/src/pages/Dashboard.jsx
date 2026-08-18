import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Dashboard = () => {
  const [travels, setTravels] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  // ==========================================
  // AUTH HEADERS
  // ==========================================

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // ==========================================
  // FETCH EXPENSES FOR ALL TRAVELS
  // ==========================================

  const fetchExpenses = async (travelList) => {
    try {
      if (!travelList || travelList.length === 0) {
        setExpenses([]);
        return;
      }

      const expenseRequests = travelList.map((travel) =>
        axios
          .get(
            `${API_URL}/api/expenses/${travel._id}`,
            {
              headers: authHeaders,
            }
          )
          .then((res) => {
            if (Array.isArray(res.data)) {
              return res.data;
            }

            if (Array.isArray(res.data.expenses)) {
              return res.data.expenses;
            }

            return [];
          })
          .catch((error) => {
            console.error(
              `Fetch expenses failed for travel ${travel._id}:`,
              error.response?.data || error.message
            );

            return [];
          })
      );

      const results = await Promise.all(expenseRequests);

      const allExpenses = results.flat();

      setExpenses(allExpenses);
    } catch (error) {
      console.error(
        "Fetch expenses error:",
        error.response?.data || error.message
      );

      setExpenses([]);
    }
  };

  // ==========================================
  // FETCH FIRE ALERTS
  // ==========================================

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/alerts/my`,
        {
          headers: authHeaders,
        }
      );

      if (Array.isArray(res.data)) {
        setAlerts(res.data);
      } else if (Array.isArray(res.data.alerts)) {
        setAlerts(res.data.alerts);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error(
        "Fetch alerts error:",
        error.response?.data || error.message
      );

      setAlerts([]);
    }
  };

  // ==========================================
  // LOAD ALL DASHBOARD DATA
  // ==========================================

  const loadDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // ==========================================
      // FETCH TRAVELS
      // ADMIN → ALL TRAVELS
      // USER → OWN TRAVELS
      // ==========================================

      const travelEndpoint = isAdmin
        ? `${API_URL}/api/travels`
        : `${API_URL}/api/travels/my`;

      const res = await axios.get(travelEndpoint, {
        headers: authHeaders,
      });

      let travelList = [];

      if (Array.isArray(res.data)) {
        travelList = res.data;
      } else if (Array.isArray(res.data.travels)) {
        travelList = res.data.travels;
      }

      setTravels(travelList);

      await Promise.all([
        fetchExpenses(travelList),
        fetchAlerts(),
      ]);
    } catch (error) {
      console.error(
        "Dashboard load error:",
        error.response?.data || error.message
      );

      setTravels([]);
      setExpenses([]);
      setAlerts([]);

      if (showRefresh) {
        alert(
          error.response?.data?.message ||
            "Failed to refresh dashboard"
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  // ==========================================
  // REFRESH DASHBOARD
  // ==========================================

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  // ==========================================
  // TRAVEL STATISTICS
  // ==========================================

  const totalTravels = travels.length;

  const pendingTravels = travels.filter(
    (travel) =>
      !travel.status ||
      travel.status.toLowerCase() === "pending"
  ).length;

  const approvedTravels = travels.filter(
    (travel) =>
      travel.status?.toLowerCase() === "approved"
  ).length;

  const rejectedTravels = travels.filter(
    (travel) =>
      travel.status?.toLowerCase() === "rejected"
  ).length;

  // ==========================================
  // EXPENSE STATISTICS
  // ==========================================

  const totalExpenses = expenses.length;

  const totalAmount = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );

  // ==========================================
  // FIRE ALERT STATISTICS
  // ==========================================

  const totalAlerts = alerts.length;

  const activeAlerts = alerts.filter(
    (alert) =>
      alert.status?.toLowerCase() === "active"
  ).length;

  const resolvedAlerts = alerts.filter(
    (alert) =>
      alert.status?.toLowerCase() === "resolved"
  ).length;

  // ==========================================
  // RECENT DATA
  // ==========================================

  const recentTravels = [...travels]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 3);

  const recentAlerts = [...alerts]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 3);

  // ==========================================
  // STATUS STYLES
  // ==========================================

  const getTravelStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getAlertStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";

      case "medium":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-pulse">
            🚨
          </div>

          <p className="mt-4 text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="max-w-7xl mx-auto">

      {/* ================= HEADER ================= */}

      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl p-8 md:p-10 mb-8">

        <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <p className="text-slate-400 text-sm mb-2">
              RESQHUB CONTROL CENTER
            </p>

            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back,{" "}
              <span className="text-red-400">
                {user?.name || "User"}
              </span>{" "}
              👋
            </h1>

            <p className="text-slate-300 mt-3 max-w-xl">
              {isAdmin
                ? "Monitor travel requests, expenses and emergency activity across the system."
                : "Here is a complete overview of your travel, expenses and emergency activity."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">

            <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-xl">
              <p className="text-xs text-slate-400">
                ACCOUNT ROLE
              </p>

              <p className="font-semibold mt-1">
                {isAdmin
                  ? "🛡️ Administrator"
                  : "👤 User"}
              </p>
            </div>

            {activeAlerts > 0 && (
              <div className="bg-red-500/20 border border-red-500/30 px-4 py-3 rounded-xl">
                <p className="text-xs text-red-200">
                  ACTIVE ALERTS
                </p>

                <p className="font-bold text-xl text-red-300 mt-1">
                  🔴 {activeAlerts}
                </p>
              </div>
            )}

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white text-slate-900 hover:bg-slate-200 px-4 py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {refreshing
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

          </div>
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}

      <section className="mb-10">

        <div className="mb-4">
          <h2 className="text-xl font-bold">
            Quick Actions
          </h2>

          <p className="text-sm text-slate-500">
            Access important features quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <button
            onClick={() => navigate("/travel")}
            className="text-left bg-white border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl">✈️</div>

            <h3 className="font-bold mt-4">
              Travel Requests
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Create and manage travels
            </p>
          </button>

          <button
            onClick={() => navigate("/alerts")}
            className="text-left bg-white border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl">🚨</div>

            <h3 className="font-bold mt-4">
              Fire Alerts
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Report emergency situations
            </p>
          </button>

          <button
            onClick={() => navigate("/travel")}
            className="text-left bg-white border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl">💰</div>

            <h3 className="font-bold mt-4">
              Expenses
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Select a travel to manage expenses
            </p>
          </button>

          {isAdmin && (
            <button
              onClick={() =>
                navigate("/admin-alerts")
              }
              className="text-left bg-slate-900 text-white rounded-2xl p-5 hover:bg-slate-800 hover:-translate-y-1 transition"
            >
              <div className="text-3xl">🛡️</div>

              <h3 className="font-bold mt-4">
                Admin Control
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Manage requests and alerts
              </p>
            </button>
          )}

        </div>
      </section>

      {/* ================= MAIN STATS ================= */}

      <section className="mb-10">

        <h2 className="text-xl font-bold mb-4">
          {isAdmin
            ? "System Overview"
            : "Overview"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500">
                  Total Travels
                </p>

                <p className="text-4xl font-bold mt-2">
                  {totalTravels}
                </p>
              </div>

              <span className="text-3xl">
                ✈️
              </span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500">
                  Total Expenses
                </p>

                <p className="text-4xl font-bold mt-2">
                  {totalExpenses}
                </p>
              </div>

              <span className="text-3xl">
                💰
              </span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500">
                  Total Amount
                </p>

                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(totalAmount)}
                </p>
              </div>

              <span className="text-3xl">
                💵
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ================= TRAVEL STATUS ================= */}

      <section className="mb-10">

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="text-xl font-bold">
              Travel Request Status
            </h2>

            <p className="text-sm text-slate-500">
              {isAdmin
                ? "Track travel requests across all users."
                : "Track the progress of your requests."}
            </p>
          </div>

          <button
            onClick={() => navigate("/travel")}
            className="text-red-500 font-semibold hover:underline"
          >
            Manage →
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-slate-500">
              ⏳ Pending
            </p>

            <p className="text-4xl font-bold text-yellow-600 mt-3">
              {pendingTravels}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-slate-500">
              ✅ Approved
            </p>

            <p className="text-4xl font-bold text-green-600 mt-3">
              {approvedTravels}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-slate-500">
              ❌ Rejected
            </p>

            <p className="text-4xl font-bold text-red-600 mt-3">
              {rejectedTravels}
            </p>
          </div>

        </div>
      </section>

      {/* ================= FIRE ALERT STATUS ================= */}

      <section className="mb-10">

        <div className="flex items-center justify-between mb-4">

          <div>
            <h2 className="text-xl font-bold">
              🚨 Fire Alert Overview
            </h2>

            <p className="text-sm text-slate-500">
              Monitor emergency alerts and their status.
            </p>
          </div>

          <button
            onClick={() => navigate("/alerts")}
            className="text-red-500 font-semibold hover:underline"
          >
            View Alerts →
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
            <p className="text-slate-500">
              Total Alerts
            </p>

            <p className="text-4xl font-bold mt-3">
              {totalAlerts}
            </p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <p className="text-slate-500">
              🔴 Active Alerts
            </p>

            <p className="text-4xl font-bold text-red-600 mt-3">
              {activeAlerts}
            </p>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <p className="text-slate-500">
              ✅ Resolved Alerts
            </p>

            <p className="text-4xl font-bold text-green-600 mt-3">
              {resolvedAlerts}
            </p>
          </div>

        </div>
      </section>

      {/* ================= RECENT ACTIVITY ================= */}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">

        {/* RECENT TRAVELS */}

        <div className="bg-white border rounded-2xl p-6">

          <div className="flex justify-between items-center mb-5">

            <div>
              <h2 className="text-xl font-bold">
                ✈️ Recent Travels
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {isAdmin
                  ? "Latest travel requests from all users."
                  : "Your latest travel requests."}
              </p>
            </div>

            <button
              onClick={() => navigate("/travel")}
              className="text-red-500 text-sm font-semibold"
            >
              View All
            </button>

          </div>

          {recentTravels.length === 0 ? (
            <div className="text-center py-10 text-slate-500">

              <div className="text-4xl mb-3">
                ✈️
              </div>

              No travel requests yet.

            </div>
          ) : (
            <div className="space-y-3">

              {recentTravels.map((travel) => (
                <div
                  key={travel._id}
                  className="border rounded-xl p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex justify-between gap-3">

                    <div>
                      <h3 className="font-semibold">
                        {travel.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        📍{" "}
                        {travel.destination ||
                          "Destination not specified"}
                      </p>

                      {isAdmin && travel.user?.name && (
                        <p className="text-xs text-slate-400 mt-1">
                          Requested by: {travel.user.name}
                        </p>
                      )}
                    </div>

                    <span
                      className={`h-fit px-3 py-1 rounded-full text-xs font-semibold ${getTravelStatusStyle(
                        travel.status
                      )}`}
                    >
                      {travel.status || "Pending"}
                    </span>

                  </div>

                  <p className="text-xs text-slate-400 mt-3">
                    {travel.fromDate?.slice(0, 10)} →{" "}
                    {travel.toDate?.slice(0, 10)}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>

        {/* RECENT ALERTS */}

        <div className="bg-white border rounded-2xl p-6">

          <div className="flex justify-between items-center mb-5">

            <div>
              <h2 className="text-xl font-bold">
                🚨 Recent Fire Alerts
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest emergency reports.
              </p>
            </div>

            <button
              onClick={() => navigate("/alerts")}
              className="text-red-500 text-sm font-semibold"
            >
              View All
            </button>

          </div>

          {recentAlerts.length === 0 ? (
            <div className="text-center py-10 text-slate-500">

              <div className="text-4xl mb-3">
                🚨
              </div>

              No fire alerts yet.

            </div>
          ) : (
            <div className="space-y-3">

              {recentAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="border rounded-xl p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex justify-between gap-3">

                    <div>
                      <h3 className="font-semibold">
                        📍 {alert.location}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {alert.message}
                      </p>
                    </div>

                    <span
                      className={`h-fit px-3 py-1 rounded-full text-xs font-semibold ${getAlertStatusStyle(
                        alert.status
                      )}`}
                    >
                      {alert.status || "Active"}
                    </span>

                  </div>

                  <div className="flex items-center gap-3 mt-3">

                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${getSeverityStyle(
                        alert.severity
                      )}`}
                    >
                      {alert.severity || "medium"}
                    </span>

                    <span className="text-xs text-slate-400">
                      {alert.createdAt?.slice(0, 10)}
                    </span>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </section>

    </div>
  );
};

export default Dashboard;