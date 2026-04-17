import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

const FireAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({
    location: "",
    message: "",
    severity: "medium",
  });

  const token = localStorage.getItem("token");

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/alerts/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlerts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setAlerts([]);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/alerts`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Fire Alert sent successfully!");

      setForm({
        location: "",
        message: "",
        severity: "medium",
      });

      fetchAlerts();
    } catch (error) {
      console.error(error);
      alert("Error sending alert");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fire Alerts</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="message"
          placeholder="Alert Message"
          value={form.message}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="severity"
          value={form.severity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Send Alert
        </button>
      </form>

      {alerts.length === 0 ? (
        <p>No alerts found</p>
      ) : (
        alerts.map((alert) => (
          <div key={alert._id} className="border p-3 mb-2 rounded">
            <p>{alert.location}</p>
            <p>{alert.message}</p>
            <p>{alert.severity}</p>
            <p>{alert.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default FireAlert;