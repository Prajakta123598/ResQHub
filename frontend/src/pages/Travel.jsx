import { useState, useEffect } from "react";
import axios from "axios";

const Travel = () => {
  const [travels, setTravels] = useState([]);
  const [form, setForm] = useState({
    title: "",
    purpose: "",
    destination: "",
    fromDate: "",
    toDate: "",
  });

  const token = localStorage.getItem("token");

  const fetchTravels = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/travels/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(res.data)) {
        setTravels(res.data);
      } else if (Array.isArray(res.data.travels)) {
        setTravels(res.data.travels);
      } else {
        setTravels([]);
      }
    } catch (error) {
      console.error(error);
      setTravels([]);
    }
  };

  useEffect(() => {
    fetchTravels();
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
      await axios.post(
        "http://localhost:5000/api/travels",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Travel created successfully!");

      setForm({
        title: "",
        purpose: "",
        destination: "",
        fromDate: "",
        toDate: "",
      });

      fetchTravels();
    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
      alert(
        JSON.stringify(error.response?.data)
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Travel Requests
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="purpose"
          placeholder="Purpose"
          value={form.purpose}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={form.destination}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="date"
          name="fromDate"
          value={form.fromDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="date"
          name="toDate"
          value={form.toDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Travel
        </button>
      </form>

      {!Array.isArray(travels) ||
      travels.length === 0 ? (
        <p>No travel data found</p>
      ) : (
        travels.map((t) => (
          <div
            key={t._id}
            className="border p-3 mb-2 rounded"
          >
            <h2 className="font-semibold">
              {t.title}
            </h2>
            <p>{t.purpose}</p>
            <p>
              <strong>Destination:</strong>{" "}
              {t.destination}
            </p>
            <p>
              {t.fromDate?.slice(0, 10)} →{" "}
              {t.toDate?.slice(0, 10)}
            </p>

            <button
              onClick={() =>
                (window.location.href = `/expenses/${t._id}`)
              }
              className="bg-green-500 text-white px-2 py-1 rounded mt-2"
            >
              View Expenses
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Travel;