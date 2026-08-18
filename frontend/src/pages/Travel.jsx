import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

const Travel = () => {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    purpose: "",
    destination: "",
    fromDate: "",
    toDate: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH LOGGED-IN USER TRAVELS
  // ==========================================

  const fetchTravels = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/travels/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(res.data)) {
        setTravels(res.data);
      } else {
        setTravels([]);
      }
    } catch (error) {
      console.error(
        "Fetch travels error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to fetch travel requests"
      );

      setTravels([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD TRAVELS
  // ==========================================

  useEffect(() => {
    fetchTravels();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      title: "",
      purpose: "",
      destination: "",
      fromDate: "",
      toDate: "",
    });

    setEditingId(null);
  };

  // ==========================================
  // CREATE / UPDATE TRAVEL REQUEST
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      // ======================================
      // UPDATE TRAVEL
      // ======================================

      if (editingId) {
        const res = await axios.put(
          `${API_URL}/api/travels/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setTravels((prevTravels) =>
          prevTravels.map((travel) =>
            travel._id === editingId
              ? res.data
              : travel
          )
        );

        alert("Travel request updated successfully! ✅");

        resetForm();
      }

      // ======================================
      // CREATE TRAVEL
      // ======================================

      else {
        const res = await axios.post(
          `${API_URL}/api/travels`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setTravels((prevTravels) => [
          res.data,
          ...prevTravels,
        ]);

        alert("Travel request submitted successfully! ✈️");

        resetForm();
      }
    } catch (error) {
      console.error(
        "Save travel error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to save travel request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // START EDIT
  // ==========================================

  const handleEdit = (travel) => {
    if (!isPending(travel.status)) {
      alert(
        "You can only edit travel requests that are still pending."
      );
      return;
    }

    setEditingId(travel._id);

    setFormData({
      title: travel.title || "",
      purpose: travel.purpose || "",
      destination: travel.destination || "",
      fromDate: travel.fromDate
        ? travel.fromDate.slice(0, 10)
        : "",
      toDate: travel.toDate
        ? travel.toDate.slice(0, 10)
        : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEdit = () => {
    resetForm();
  };

  // ==========================================
  // DELETE TRAVEL
  // ==========================================

  const handleDelete = async (travel) => {
    if (!isPending(travel.status)) {
      alert(
        "You can only delete travel requests that are still pending."
      );
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this travel request? All related expenses will also be deleted."
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${API_URL}/api/travels/${travel._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTravels((prevTravels) =>
        prevTravels.filter(
          (item) => item._id !== travel._id
        )
      );

      alert("Travel request deleted successfully! 🗑️");

      if (editingId === travel._id) {
        resetForm();
      }
    } catch (error) {
      console.error(
        "Delete travel error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete travel request"
      );
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";

      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  // ==========================================
  // CHECK IF TRAVEL IS PENDING
  // ==========================================

  const isPending = (status) => {
    return (
      !status ||
      status.toLowerCase() === "pending"
    );
  };

  // ==========================================
  // CHECK IF TRAVEL IS APPROVED
  // ==========================================

  const isApproved = (status) => {
    return (
      status?.toLowerCase() === "approved"
    );
  };

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="max-w-7xl mx-auto">

      {/* ================= HEADER ================= */}

      <div className="mb-10">
        <p className="text-red-500 font-semibold text-sm uppercase tracking-wider">
          Travel Management
        </p>

        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          My Travel Requests ✈️
        </h1>

        <p className="text-slate-500 mt-2">
          Submit and manage your travel requests.
        </p>
      </div>

      {/* ================= CREATE / UPDATE FORM ================= */}

      <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8 mb-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              {editingId
                ? "✏️ Edit Travel Request"
                : "Create New Travel Request"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {editingId
                ? "Update your pending travel request."
                : "Fill in the details for your new travel request."}
            </p>
          </div>

          {editingId && (
            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
              Editing Pending Request
            </span>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* TITLE */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Client Meeting"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* DESTINATION */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Destination
            </label>

            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g. Indore"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* PURPOSE */}

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Purpose
            </label>

            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Describe the purpose of your travel"
              rows="4"
              className="w-full border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* FROM DATE */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              From Date
            </label>

            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* TO DATE */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              To Date
            </label>

            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* FORM ACTIONS */}

          <div className="md:col-span-2 flex flex-wrap gap-3">

            <button
              type="submit"
              disabled={submitting}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {submitting
                ? editingId
                  ? "Updating..."
                  : "Submitting..."
                : editingId
                ? "Update Travel Request"
                : "Submit Travel Request"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* ================= TRAVEL LIST HEADER ================= */}

      <div className="flex items-center justify-between gap-4 mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            My Requests
          </h2>

          <p className="text-slate-500 mt-1">
            {travels.length} request
            {travels.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <button
          onClick={fetchTravels}
          className="border hover:bg-slate-50 px-5 py-3 rounded-xl font-medium transition"
        >
          ↻ Refresh
        </button>

      </div>

      {/* ================= LOADING / EMPTY / LIST ================= */}

      {loading ? (
        <div className="bg-white border rounded-2xl p-10 text-center">
          <p className="text-slate-500">
            Loading travel requests...
          </p>
        </div>
      ) : travels.length === 0 ? (

        <div className="bg-white border border-dashed rounded-2xl p-12 text-center">

          <div className="text-5xl mb-4">
            ✈️
          </div>

          <h3 className="text-xl font-bold">
            No Travel Requests Yet
          </h3>

          <p className="text-slate-500 mt-2">
            Create your first travel request using the form above.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {travels.map((travel) => {

            const pending = isPending(travel.status);
            const approved = isApproved(travel.status);

            return (
              <div
                key={travel._id}
                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >

                {/* ================= TRAVEL HEADER ================= */}

                <div className="flex justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
                      ✈️
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">
                        {travel.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        📍 {travel.destination}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`h-fit px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
                      travel.status
                    )}`}
                  >
                    {travel.status || "Pending"}
                  </span>

                </div>

                {/* ================= TRAVEL DETAILS ================= */}

                <div className="mt-5 space-y-4 text-sm">

                  <div>
                    <p className="text-slate-500 mb-1">
                      Purpose
                    </p>

                    <p className="font-medium">
                      {travel.purpose}
                    </p>
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

                  <div className="border-t" />

                  <div className="flex justify-between gap-4">

                    <span className="text-slate-500">
                      Submitted
                    </span>

                    <span className="font-medium">
                      {travel.createdAt
                        ? new Date(
                            travel.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </span>

                  </div>

                </div>

                {/* ================= ADMIN NOTE ================= */}

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

                {/* ================= STATUS MESSAGE ================= */}

                {approved && (
                  <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-3">

                    <p className="text-xs text-green-700">
                      ✅ Travel request approved. You can now manage expenses.
                    </p>

                  </div>
                )}

                {pending && (
                  <div className="mt-5 bg-yellow-50 border border-yellow-100 rounded-xl p-3">

                    <p className="text-xs text-yellow-700">
                      ⏳ Your request is pending approval. Expenses will become available after approval.
                    </p>

                  </div>
                )}

                {travel.status?.toLowerCase() ===
                  "rejected" && (
                  <div className="mt-5 bg-red-50 border border-red-100 rounded-xl p-3">

                    <p className="text-xs text-red-700">
                      ❌ This travel request was rejected. Expenses cannot be managed.
                    </p>

                  </div>
                )}

                {/* ================= ACTIONS ================= */}

                <div className="mt-6 pt-5 border-t flex flex-wrap gap-3">

                  {/* APPROVED → MANAGE EXPENSES */}

                  {approved ? (
                    <Link
                      to={`/expenses/${travel._id}`}
                      className="flex-1 min-w-[180px] text-center bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-semibold transition"
                    >
                      💰 Manage Expenses
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex-1 min-w-[180px] bg-slate-100 text-slate-400 px-4 py-3 rounded-xl text-sm font-semibold cursor-not-allowed"
                    >
                      🔒 Expenses Available After Approval
                    </button>
                  )}

                  {/* PENDING → EDIT / DELETE */}

                  {pending && (
                    <>
                      <button
                        onClick={() =>
                          handleEdit(travel)
                        }
                        className="px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-sm transition"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(travel)
                        }
                        className="px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm transition"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default Travel;