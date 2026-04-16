import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Expense = () => {
  const { travelRequestId } = useParams();

  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/expenses/${travelRequestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(res.data)) {
        setExpenses(res.data);
      } else if (Array.isArray(res.data.expenses)) {
        setExpenses(res.data.expenses);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error("GET ERROR:", error);
      setExpenses([]);
    }
  };

  useEffect(() => {
    fetchExpenses();
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
        "http://localhost:5000/api/expenses",
        {
          amount: Number(form.amount),
          title: form.description,
          travelRequest: travelRequestId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Expense added successfully!");

      setForm({
        amount: "",
        description: "",
      });

      fetchExpenses();
    } catch (error) {
      console.error(error);
      alert("Error adding expense");
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/expenses/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Expense deleted successfully!");
      fetchExpenses();
    } catch (error) {
      console.error(error);
      alert("Error deleting expense");
    }
  };

  const totalExpense = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Expenses
      </h1>

      <div className="bg-gray-100 p-3 rounded mb-4">
        <h2 className="text-lg font-semibold">
          Total Expense: ₹{totalExpense}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </form>

      {expenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        expenses.map((exp) => (
          <div
            key={exp._id}
            className="border p-3 mb-2 rounded flex justify-between"
          >
            <div>
              <p>₹{exp.amount}</p>
              <p>{exp.title}</p>
            </div>

            <button
              onClick={() =>
                handleDelete(exp._id)
              }
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Expense;