import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Travel from "./pages/Travel";
import Expense from "./pages/Expense";
import FireAlert from "./pages/FireAlert";
import AdminAlerts from "./pages/AdminAlerts";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="p-6">
        <Routes>
          {/* PUBLIC ROUTES */}

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/travel"
            element={
              <ProtectedRoute>
                <Travel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses/:travelRequestId"
            element={
              <ProtectedRoute>
                <Expense />
              </ProtectedRoute>
            }
          />

          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <FireAlert />
              </ProtectedRoute>
            }
          />

          {/* ADMIN CONTROL */}

          <Route
            path="/admin-alerts"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminAlerts />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}

          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;