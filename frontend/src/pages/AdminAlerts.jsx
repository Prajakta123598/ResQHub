import { useState, useEffect } from "react";
import axios from "axios";

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  const token = localStorage.getItem("token");

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/alerts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlerts(
        Array.isArray(res.data) ? res.data : []
      );
    } catch (error) {
      console.error(error);
      setAlerts([]);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResolve = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/alerts/${id}/resolve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Alert resolved!");
      fetchAlerts();
    } catch (error) {
      console.error(error);
      alert("Error resolving alert");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Admin Alerts Dashboard
      </h1>

      {alerts.length === 0 ? (
        <p>No alerts found</p>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert._id}
            className="border p-3 mb-3 rounded"
          >
            <p>
              <strong>User:</strong>{" "}
              {alert.user?.name}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {alert.location}
            </p>

            <p>
              <strong>Message:</strong>{" "}
              {alert.message}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {alert.status}
            </p>

            {alert.status === "active" && (
              <button
                onClick={() =>
                  handleResolve(alert._id)
                }
                className="bg-green-500 text-white px-3 py-1 rounded mt-2"
              >
                Resolve
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminAlerts;