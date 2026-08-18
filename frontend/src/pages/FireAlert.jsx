import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const FireAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    location: "",
    message: "",
    severity: "medium",
  });

  const token = localStorage.getItem("token");

  // ==================================================
  // GET MY ALERTS
  // ==================================================

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/api/alerts/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let alertList = [];

      if (Array.isArray(res.data)) {
        alertList = res.data;
      } else if (Array.isArray(res.data.alerts)) {
        alertList = res.data.alerts;
      }

      // Newest alerts first
      alertList.sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAlerts(alertList);
    } catch (error) {
      console.error(
        "Fetch alerts error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to fetch fire alerts"
      );

      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // LOAD ALERTS
  // ==================================================

  useEffect(() => {
    fetchAlerts();
  }, []);

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==================================================
  // CREATE ALERT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSending(true);

      const res = await axios.post(
        `${API_URL}/api/alerts`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Fire Alert sent successfully! 🚨");

      // Reset form
      setForm({
        location: "",
        message: "",
        severity: "medium",
      });

      // Add new alert instantly if backend returns it
      if (res.data && res.data._id) {
        setAlerts((prevAlerts) => [
          res.data,
          ...prevAlerts,
        ]);
      } else {
        fetchAlerts();
      }
    } catch (error) {
      console.error(
        "Create alert error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to send fire alert"
      );
    } finally {
      setSending(false);
    }
  };

  // ==================================================
  // SEVERITY STYLE
  // ==================================================

  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border border-red-200";

      case "medium":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";

      case "low":
        return "bg-green-100 text-green-700 border border-green-200";

      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  // ==================================================
  // STATUS STYLE
  // ==================================================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-700 border border-green-200";

      case "active":
      default:
        return "bg-red-100 text-red-700 border border-red-200";
    }
  };

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-3">
          Fire Alerts 🚨
        </h1>

        <p className="text-gray-500">
          Loading emergency alerts...
        </p>
      </div>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Fire Alerts 🚨
          </h1>

          <p className="text-gray-500 mt-2">
            Report emergency situations and track their
            resolution status.
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-2 rounded-lg transition"
        >
          🔄 Refresh
        </button>

      </div>

      {/* =========================================
          CREATE ALERT FORM
      ========================================= */}

      <div className="bg-white border rounded-xl shadow-sm p-6 mb-10">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            🚨 Send Emergency Alert
          </h2>

          <p className="text-gray-500 mt-1">
            Provide accurate information so the emergency
            can be handled quickly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* LOCATION */}

          <div>
            <label className="block font-medium mb-2">
              📍 Emergency Location
            </label>

            <input
              type="text"
              name="location"
              placeholder="Enter emergency location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          {/* MESSAGE */}

          <div>
            <label className="block font-medium mb-2">
              📝 Emergency Description
            </label>

            <textarea
              name="message"
              placeholder="Describe the emergency situation..."
              value={form.message}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              rows="5"
              required
            />
          </div>

          {/* SEVERITY */}

          <div>
            <label className="block font-medium mb-2">
              ⚠️ Severity Level
            </label>

            <select
              name="severity"
              value={form.severity}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="low">
                🟢 Low
              </option>

              <option value="medium">
                ⚠️ Medium
              </option>

              <option value="high">
                🔥 High
              </option>
            </select>
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={sending}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending
              ? "Sending Alert..."
              : "🚨 Send Fire Alert"}
          </button>

        </form>

      </div>

      {/* =========================================
          MY ALERTS
      ========================================= */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">

        <div>
          <h2 className="text-2xl font-bold">
            My Fire Alerts
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Your recently reported emergency situations.
          </p>
        </div>

        <span className="w-fit bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold">
          {alerts.length} Total
        </span>

      </div>

      {/* =========================================
          EMPTY STATE
      ========================================= */}

      {alerts.length === 0 ? (

        <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center bg-gray-50">

          <div className="text-5xl mb-4">
            🚨
          </div>

          <h3 className="text-xl font-bold">
            No Fire Alerts Yet
          </h3>

          <p className="text-gray-500 mt-2">
            You have not reported any emergency situations.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {alerts.map((alert) => (

            <div
              key={alert._id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-6"
            >

              {/* TOP */}

              <div className="flex justify-between items-start gap-4">

                <div>
                  <h3 className="text-xl font-bold">
                    📍 {alert.location}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Reported on{" "}
                    {formatDate(alert.createdAt)}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                    alert.status
                  )}`}
                >
                  {alert.status || "Active"}
                </span>

              </div>

              {/* MESSAGE */}

              <div className="mt-5 bg-gray-50 rounded-lg p-4">

                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Emergency Description
                </p>

                <p className="text-gray-800">
                  {alert.message}
                </p>

              </div>

              {/* BOTTOM */}

              <div className="flex justify-between items-center mt-5 pt-4 border-t">

                <div>

                  <p className="text-xs text-gray-500 mb-1">
                    Severity
                  </p>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSeverityStyle(
                      alert.severity
                    )}`}
                  >
                    {alert.severity || "Medium"}
                  </span>

                </div>

                <div className="text-right">

                  <p className="text-xs text-gray-500">
                    Alert ID
                  </p>

                  <p className="text-xs font-mono text-gray-400 mt-1">
                    {alert._id?.slice(-6)}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default FireAlert;