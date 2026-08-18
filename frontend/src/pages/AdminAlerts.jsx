
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

const AdminAlerts = () => {
  // ==========================================
  // PAGE SECTION
  // ==========================================

  const [activeSection, setActiveSection] = useState("travels");

  // ==========================================
  // TRAVEL STATES
  // ==========================================

  const [travels, setTravels] = useState([]);
  const [travelLoading, setTravelLoading] = useState(true);
  const [travelFilter, setTravelFilter] = useState("all");
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [travelUpdatingId, setTravelUpdatingId] = useState(null);

  // ==========================================
  // ALERT STATES
  // ==========================================

  const [alerts, setAlerts] = useState([]);
  const [alertLoading, setAlertLoading] = useState(true);
  const [alertFilter, setAlertFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertUpdatingId, setAlertUpdatingId] = useState(null);

  // ==========================================
  // AUTH
  // ==========================================

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ==========================================
  // FETCH ALL TRAVELS
  // ==========================================

  const fetchTravels = async () => {
    try {
      setTravelLoading(true);

      const res = await axios.get(
        `${API_URL}/api/travels`,
        {
          headers,
        }
      );

      if (Array.isArray(res.data)) {
        setTravels(res.data);
      } else if (Array.isArray(res.data?.travels)) {
        setTravels(res.data.travels);
      } else {
        setTravels([]);
      }
    } catch (error) {
      console.error(
        "Fetch travels error:",
        error.response?.data || error.message
      );

      setTravels([]);
    } finally {
      setTravelLoading(false);
    }
  };

  // ==========================================
  // FETCH ALL FIRE ALERTS
  // ==========================================

  const fetchAlerts = async () => {
    try {
      setAlertLoading(true);

      const res = await axios.get(
        `${API_URL}/api/alerts`,
        {
          headers,
        }
      );

      if (Array.isArray(res.data)) {
        setAlerts(res.data);
      } else if (Array.isArray(res.data?.alerts)) {
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
    } finally {
      setAlertLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchTravels();
    fetchAlerts();
  }, []);

  // ==========================================
  // OPEN TRAVEL REVIEW MODAL
  // ==========================================

  const openTravelModal = (travel) => {
    setSelectedTravel(travel);
    setAdminNote(travel.adminNote || "");
  };

  // ==========================================
  // UPDATE TRAVEL STATUS
  // ==========================================

  const handleTravelStatusChange = async (status) => {
    if (!selectedTravel) return;

    try {
      setTravelUpdatingId(selectedTravel._id);

      const response = await axios.put(
        `${API_URL}/api/travels/${selectedTravel._id}/status`,
        {
          status,
          adminNote: adminNote.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Travel updated:", response.data);

      // Fetch fresh travel data from backend
      await fetchTravels();

      // Close modal
      setSelectedTravel(null);
      setAdminNote("");

      alert(
        `Travel request ${status.toLowerCase()} successfully!`
      );
    } catch (error) {
      console.error(
        "Update travel error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update travel status"
      );
    } finally {
      setTravelUpdatingId(null);
    }
  };

  // ==========================================
  // UPDATE ALERT STATUS
  // ==========================================

  const handleAlertStatusChange = async (status) => {
    if (!selectedAlert) return;

    try {
      setAlertUpdatingId(selectedAlert._id);

      await axios.put(
        `${API_URL}/api/alerts/${selectedAlert._id}/resolve`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchAlerts();

      setSelectedAlert(null);

      alert(`Alert marked as ${status} successfully!`);
    } catch (error) {
      console.error(
        "Update alert error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update alert status"
      );
    } finally {
      setAlertUpdatingId(null);
    }
  };

  // ==========================================
  // STATUS STYLES
  // ==========================================

  const getTravelStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";

      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const getAlertStatusStyle = (status) => {
    return status?.toLowerCase() === "resolved"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";
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
  // FILTER TRAVELS
  // ==========================================

  const filteredTravels = travels.filter((travel) => {
    if (travelFilter === "all") return true;

    return (
      travel.status?.toLowerCase() === travelFilter
    );
  });

  // ==========================================
  // FILTER ALERTS
  // ==========================================

  const filteredAlerts = alerts.filter((alert) => {
    if (alertFilter === "all") return true;

    return (
      alert.status?.toLowerCase() === alertFilter
    );
  });

  // ==========================================
  // STATISTICS
  // ==========================================

  const pendingTravels = travels.filter(
    (travel) =>
      !travel.status ||
      travel.status.toLowerCase() === "pending"
  ).length;

  const activeAlerts = alerts.filter(
    (alert) =>
      alert.status?.toLowerCase() === "active"
  ).length;

  const resolvedAlerts = alerts.filter(
    (alert) =>
      alert.status?.toLowerCase() === "resolved"
  ).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-red-600 font-semibold text-sm uppercase tracking-wider">
            Administrator Panel
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Admin Control 🛡️
          </h1>

          <p className="text-slate-500 mt-2">
            Manage travel requests and fire alerts.
          </p>
        </div>

        <button
          onClick={() => {
            fetchTravels();
            fetchAlerts();
          }}
          className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-3 rounded-xl font-medium transition"
        >
          ↻ Refresh
        </button>
      </div>

      {/* ================= OVERVIEW ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
          <p className="text-sm text-purple-700">
            Total Travels
          </p>

          <p className="text-3xl font-bold mt-2">
            {travels.length}
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <p className="text-sm text-yellow-700">
            Pending Travels
          </p>

          <p className="text-3xl font-bold mt-2 text-yellow-700">
            {pendingTravels}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-sm text-red-700">
            Active Alerts
          </p>

          <p className="text-3xl font-bold mt-2 text-red-700">
            {activeAlerts}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p className="text-sm text-green-700">
            Resolved Alerts
          </p>

          <p className="text-3xl font-bold mt-2 text-green-700">
            {resolvedAlerts}
          </p>
        </div>
      </div>

      {/* ================= PAGE SWITCHER ================= */}

      <div className="flex gap-3 border-b mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveSection("travels")}
          className={`px-5 py-3 font-semibold transition whitespace-nowrap ${
            activeSection === "travels"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          ✈️ Travel Requests ({travels.length})
        </button>

        <button
          onClick={() => setActiveSection("alerts")}
          className={`px-5 py-3 font-semibold transition whitespace-nowrap ${
            activeSection === "alerts"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          🚨 Fire Alerts ({alerts.length})
        </button>
      </div>

      {/* ================================================= */}
      {/* TRAVEL SECTION */}
      {/* ================================================= */}

      {activeSection === "travels" && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Travel Requests
              </h2>

              <p className="text-slate-500 mt-1">
                {filteredTravels.length} request
                {filteredTravels.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <select
              value={travelFilter}
              onChange={(e) =>
                setTravelFilter(e.target.value)
              }
              className="border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {travelLoading ? (
            <p className="text-slate-500">
              Loading travel requests...
            </p>
          ) : filteredTravels.length === 0 ? (
            <div className="bg-white border border-dashed rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">✈️</div>

              <h3 className="text-xl font-bold">
                No Travel Requests Found
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTravels.map((travel) => (
                <div
                  key={travel._id}
                  className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">
                        ✈️ {travel.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        📍 {travel.destination}
                      </p>
                    </div>

                    <span
                      className={`h-fit px-3 py-1 rounded-full text-xs font-semibold border ${getTravelStatusStyle(
                        travel.status
                      )}`}
                    >
                      {travel.status || "Pending"}
                    </span>
                  </div>

                  <div className="mt-5 bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-2">
                      Requested By
                    </p>

                    <p className="font-semibold">
                      👤 {travel.user?.name || "Unknown User"}
                    </p>

                    <p className="text-sm text-slate-500">
                      {travel.user?.email || ""}
                    </p>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Purpose
                      </span>

                      <span className="font-medium text-right">
                        {travel.purpose}
                      </span>
                    </div>

                    <div className="border-t" />

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Travel Dates
                      </span>

                      <span className="font-medium text-right">
                        {travel.fromDate?.slice(0, 10)}
                        {" → "}
                        {travel.toDate?.slice(0, 10)}
                      </span>
                    </div>
                  </div>

                  {travel.adminNote && (
                    <div className="mt-5 bg-purple-50 border border-purple-100 rounded-xl p-4">
                      <p className="font-semibold text-sm">
                        💬 Admin Note
                      </p>

                      <p className="text-sm text-slate-600 mt-1">
                        {travel.adminNote}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => openTravelModal(travel)}
                    className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition"
                  >
                    {travel.status?.toLowerCase() === "pending"
                      ? "Review Request"
                      : "Update Status"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ================================================= */}
      {/* FIRE ALERT SECTION */}
      {/* ================================================= */}

      {activeSection === "alerts" && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Fire Alerts
              </h2>

              <p className="text-slate-500 mt-1">
                {filteredAlerts.length} alert
                {filteredAlerts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <select
              value={alertFilter}
              onChange={(e) =>
                setAlertFilter(e.target.value)
              }
              className="border rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Alerts</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {alertLoading ? (
            <p className="text-slate-500">
              Loading fire alerts...
            </p>
          ) : filteredAlerts.length === 0 ? (
            <div className="bg-white border border-dashed rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">🚨</div>

              <h3 className="text-xl font-bold">
                No Fire Alerts Found
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="bg-white border rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">
                        🚨 Fire Alert
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        📍 {alert.location}
                      </p>
                    </div>

                    <span
                      className={`h-fit px-3 py-1 rounded-full text-xs font-semibold border ${getAlertStatusStyle(
                        alert.status
                      )}`}
                    >
                      {alert.status || "active"}
                    </span>
                  </div>

                  <div className="mt-5 bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 uppercase font-semibold mb-2">
                      Reported By
                    </p>

                    <p className="font-semibold">
                      👤 {alert.user?.name || "Unknown User"}
                    </p>

                    <p className="text-sm text-slate-500">
                      {alert.user?.email || ""}
                    </p>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Severity
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityStyle(
                          alert.severity
                        )}`}
                      >
                        {alert.severity || "medium"}
                      </span>
                    </div>

                    <div className="border-t" />

                    <div>
                      <p className="text-slate-500">
                        Alert Message
                      </p>

                      <p className="font-medium mt-1">
                        {alert.message}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition"
                  >
                    Manage Alert
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ================================================= */}
      {/* TRAVEL REVIEW MODAL */}
      {/* ================================================= */}

      {selectedTravel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-purple-600 text-sm font-semibold uppercase">
                  Travel Review
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  {selectedTravel.title}
                </h2>

                <p className="text-slate-500 mt-1">
                  📍 {selectedTravel.destination}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedTravel(null);
                  setAdminNote("");
                }}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="mt-6 bg-slate-50 rounded-xl p-4 space-y-2">
              <p>
                <span className="text-slate-500">
                  Requested By:
                </span>{" "}
                <span className="font-semibold">
                  {selectedTravel.user?.name || "Unknown User"}
                </span>
              </p>

              <p>
                <span className="text-slate-500">
                  Purpose:
                </span>{" "}
                <span className="font-semibold">
                  {selectedTravel.purpose}
                </span>
              </p>

              <p>
                <span className="text-slate-500">
                  Dates:
                </span>{" "}
                <span className="font-semibold">
                  {selectedTravel.fromDate?.slice(0, 10)}
                  {" → "}
                  {selectedTravel.toDate?.slice(0, 10)}
                </span>
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold mb-2">
                Admin Note
              </label>

              <textarea
                rows="4"
                value={adminNote}
                onChange={(e) =>
                  setAdminNote(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Add note for the user"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <button
                onClick={() =>
                  handleTravelStatusChange("Pending")
                }
                disabled={
                  travelUpdatingId === selectedTravel._id
                }
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                Pending
              </button>

              <button
                onClick={() =>
                  handleTravelStatusChange("Approved")
                }
                disabled={
                  travelUpdatingId === selectedTravel._id
                }
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  handleTravelStatusChange("Rejected")
                }
                disabled={
                  travelUpdatingId === selectedTravel._id
                }
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* ALERT MODAL */}
      {/* ================================================= */}

      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-red-600 text-sm font-semibold uppercase">
                  Fire Alert Management
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  🚨 Fire Alert
                </h2>

                <p className="text-slate-500 mt-1">
                  📍 {selectedAlert.location}
                </p>
              </div>

              <button
                onClick={() => setSelectedAlert(null)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="mt-6 bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500">
                Alert Message
              </p>

              <p className="font-semibold mt-1">
                {selectedAlert.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() =>
                  handleAlertStatusChange("active")
                }
                disabled={
                  alertUpdatingId === selectedAlert._id
                }
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                🚨 Mark Active
              </button>

              <button
                onClick={() =>
                  handleAlertStatusChange("resolved")
                }
                disabled={
                  alertUpdatingId === selectedAlert._id
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                ✓ Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAlerts;

