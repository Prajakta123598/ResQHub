import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [travels, setTravels] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const token = localStorage.getItem("token");

  const fetchExpenses = async (travelList) => {
    try {
      let allExpenses = [];

      for (const travel of travelList) {
        const res = await axios.get(
          `http://localhost:5000/api/expenses/${travel._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (Array.isArray(res.data)) {
          allExpenses = [...allExpenses, ...res.data];
        } else if (Array.isArray(res.data.expenses)) {
          allExpenses = [
            ...allExpenses,
            ...res.data.expenses,
          ];
        }
      }

      setExpenses(allExpenses);
    } catch (error) {
      console.error(error);
      setExpenses([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/travels/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const travelList = Array.isArray(res.data)
          ? res.data
          : [];

        setTravels(travelList);

        await fetchExpenses(travelList);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalTravels = travels.length;
  const totalExpenses = expenses.length;

  const totalAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-6 rounded shadow">
          <h2 className="text-lg font-semibold">
            Total Travels
          </h2>
          <p className="text-3xl font-bold mt-2">
            {totalTravels}
          </p>
        </div>

        <div className="bg-green-100 p-6 rounded shadow">
          <h2 className="text-lg font-semibold">
            Total Expenses
          </h2>
          <p className="text-3xl font-bold mt-2">
            {totalExpenses}
          </p>
        </div>

        <div className="bg-yellow-100 p-6 rounded shadow">
          <h2 className="text-lg font-semibold">
            Total Amount
          </h2>
          <p className="text-3xl font-bold mt-2">
            ₹{totalAmount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;