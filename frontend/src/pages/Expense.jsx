import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Expense = () => {
  // ==========================================
  // GET TRAVEL REQUEST ID FROM URL
  // ==========================================

  const { travelRequestId } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [travel, setTravel] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
  });

  const token = localStorage.getItem("token");

  // ==========================================
  // AUTH HEADERS
  // ==========================================

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // ==========================================
  // CHECK TRAVEL STATUS
  // ==========================================

  const isApproved =
    travel?.status?.toLowerCase() === "approved";

  const isRejected =
    travel?.status?.toLowerCase() === "rejected";

  // ==========================================
  // FETCH TRAVEL DETAILS
  // GET /api/travels/:id
  // ==========================================

  const fetchTravel = async () => {
    const res = await axios.get(
      `${API_URL}/api/travels/${travelRequestId}`,
      {
        headers: authHeaders,
      }
    );

    setTravel(res.data);

    return res.data;
  };

  // ==========================================
  // FETCH EXPENSES
  // GET /api/expenses/travel/:travelRequestId
  // ==========================================

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/expenses/travel/${travelRequestId}`,
        {
          headers: authHeaders,
        }
      );

      console.log("Fetched expenses:", res.data);

      if (Array.isArray(res.data)) {
        setExpenses(res.data);
      } else if (Array.isArray(res.data?.expenses)) {
        setExpenses(res.data.expenses);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error(
        "Fetch expenses error:",
        error.response?.data || error.message
      );

      setExpenses([]);
    }
  };

  // ==========================================
  // LOAD PAGE DATA
  // ==========================================

  const loadData = async () => {
    try {
      setLoading(true);

      const travelData = await fetchTravel();

      // Rejected travel ke expenses fetch nahi karenge
      if (
        travelData.status?.toLowerCase() !== "rejected"
      ) {
        await fetchExpenses();
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error(
        "Load data error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to load travel details"
      );

      navigate("/travel");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (travelRequestId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [travelRequestId]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // ADD / UPDATE EXPENSE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isApproved) {
      alert(
        "Expenses can only be managed after the travel request is approved"
      );
      return;
    }

    if (!form.title.trim()) {
      alert("Please enter expense title");
      return;
    }

    if (
      form.amount === "" ||
      Number(form.amount) < 0
    ) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setSaving(true);

      // ==========================================
      // UPDATE EXPENSE
      // ==========================================

      if (editingId) {
        const res = await axios.put(
          `${API_URL}/api/expenses/${editingId}`,
          {
            title: form.title.trim(),
            amount: Number(form.amount),
          },
          {
            headers: authHeaders,
          }
        );

        setExpenses((prevExpenses) =>
          prevExpenses.map((expense) =>
            expense._id === editingId
              ? res.data
              : expense
          )
        );

        alert("Expense updated successfully! ✅");

        setEditingId(null);
      }

      // ==========================================
      // ADD EXPENSE
      // ==========================================

      else {
        const res = await axios.post(
          `${API_URL}/api/expenses`,
          {
            travelRequest: travelRequestId,
            title: form.title.trim(),
            amount: Number(form.amount),
          },
          {
            headers: authHeaders,
          }
        );

        setExpenses((prevExpenses) => [
          res.data,
          ...prevExpenses,
        ]);

        alert("Expense added successfully! 💰");
      }

      // ==========================================
      // RESET FORM
      // ==========================================

      setForm({
        title: "",
        amount: "",
      });
    } catch (error) {
      console.error(
        "Save expense error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to save expense"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // START EDIT
  // ==========================================

  const handleEdit = (expense) => {
    if (!isApproved) {
      alert(
        "Expenses can only be edited for approved travel requests"
      );
      return;
    }

    setEditingId(expense._id);

    setForm({
      title: expense.title || "",
      amount: expense.amount ?? "",
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
    setEditingId(null);

    setForm({
      title: "",
      amount: "",
    });
  };

  // ==========================================
  // DELETE EXPENSE
  // ==========================================

  const handleDelete = async (expenseId) => {
    if (!isApproved) {
      alert(
        "Expenses can only be deleted for approved travel requests"
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(expenseId);

      await axios.delete(
        `${API_URL}/api/expenses/${expenseId}`,
        {
          headers: authHeaders,
        }
      );

      setExpenses((prevExpenses) =>
        prevExpenses.filter(
          (expense) => expense._id !== expenseId
        )
      );

      alert("Expense deleted successfully! 🗑️");
    } catch (error) {
      console.error(
        "Delete expense error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete expense"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // CALCULATE TOTAL EXPENSE
  // ==========================================

  const totalExpense = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

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
  // FORMAT DATE
  // ==========================================

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
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-3">
          Expense Management
        </h1>

        <p className="text-gray-500">
          Loading travel and expenses...
        </p>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <button
            onClick={() => navigate("/travel")}
            className="text-sm text-blue-600 hover:underline mb-3"
          >
            ← Back to Travel Requests
          </button>

          <h1 className="text-3xl font-bold">
            💰 Expense Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage expenses related to this travel request.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <span
            className={`px-4 py-2 rounded-full border text-sm font-semibold ${getStatusStyle(
              travel?.status
            )}`}
          >
            {travel?.status || "Pending"}
          </span>

          <button
            onClick={loadData}
            className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-2 rounded-lg transition"
          >
            🔄 Refresh
          </button>

        </div>

      </div>

      {/* TRAVEL INFO */}

      {travel && (
        <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">

          <h2 className="font-bold text-xl">
            ✈️ {travel.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">

            <div>
              <p className="text-gray-500">
                Destination
              </p>

              <p className="font-medium">
                📍 {travel.destination}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Travel Dates
              </p>

              <p className="font-medium">
                {travel.fromDate?.slice(0, 10)}
                {" → "}
                {travel.toDate?.slice(0, 10)}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* PENDING MESSAGE */}

      {!isApproved && !isRejected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8">

          <h3 className="font-bold text-yellow-800">
            ⏳ Waiting for Approval
          </h3>

          <p className="text-sm text-yellow-700 mt-1">
            You can manage expenses only after the
            administrator approves this travel request.
          </p>

        </div>
      )}

      {/* REJECTED MESSAGE */}

      {isRejected && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">

          <h3 className="font-bold text-red-800 text-lg">
            ❌ Travel Request Rejected
          </h3>

          <p className="text-sm text-red-700 mt-2">
            Expenses cannot be managed because this
            travel request was rejected.
          </p>

          {travel?.adminNote && (
            <div className="mt-4 bg-white border border-red-100 rounded-lg p-4">

              <p className="font-semibold text-sm">
                Admin Note
              </p>

              <p className="text-sm text-gray-600 mt-1">
                {travel.adminNote}
              </p>

            </div>
          )}

        </div>
      )}

      {/* SUMMARY */}

      {!isRejected && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">

          <div className="bg-white border rounded-xl p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Total Expenses
            </p>

            <p className="text-3xl font-bold mt-2">
              {formatCurrency(totalExpense)}
            </p>

          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Expense Items
            </p>

            <p className="text-3xl font-bold mt-2">
              {expenses.length}
            </p>

          </div>

        </div>
      )}

      {/* ADD / UPDATE FORM */}

      {isApproved && (
        <div className="bg-white border rounded-xl shadow-sm p-6 mb-8">

          <div className="mb-6">

            <h2 className="text-2xl font-bold">
              {editingId
                ? "✏️ Update Expense"
                : "➕ Add New Expense"}
            </h2>

            <p className="text-gray-500 mt-1">
              Add travel, food, accommodation,
              or other expenses.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block font-medium mb-2">
                Expense Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Example: Flight Tickets"
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

            </div>

            <div>

              <label className="block font-medium mb-2">
                Amount (₹)
              </label>

              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={form.amount}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Expense"
                  : "Add Expense"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>
      )}

      {/* EXPENSE RECORDS */}

      {!isRejected && (
        <>
          <div className="flex items-center justify-between gap-3 mb-5">

            <div>

              <h2 className="text-2xl font-bold">
                Expense Records
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                All expenses for this travel request.
              </p>

            </div>

            <span className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold">
              {expenses.length} Items
            </span>

          </div>

          {expenses.length === 0 ? (

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center bg-gray-50">

              <div className="text-5xl mb-4">
                💰
              </div>

              <h3 className="text-xl font-bold">
                No Expenses Yet
              </h3>

              <p className="text-gray-500 mt-2">

                {isApproved
                  ? "Start by adding your first expense for this trip."
                  : "Expenses will be available after approval."}

              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {expenses.map((expense) => (

                <div
                  key={expense._id}
                  className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-5"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div className="flex-1">

                      <h3 className="text-xl font-bold">
                        {expense.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-2">
                        Added on{" "}
                        {formatDate(expense.createdAt)}
                      </p>

                    </div>

                    <div className="md:text-right">

                      <p className="text-sm text-gray-500">
                        Amount
                      </p>

                      <p className="text-2xl font-bold">
                        {formatCurrency(expense.amount)}
                      </p>

                    </div>

                    {isApproved && (
                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleEdit(expense)
                          }
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(expense._id)
                          }
                          disabled={
                            deletingId === expense._id
                          }
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                        >
                          {deletingId === expense._id
                            ? "Deleting..."
                            : "🗑️ Delete"}
                        </button>

                      </div>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}
        </>
      )}

    </div>
  );
};

export default Expense;