import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { API_URL } from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // GET THE PAGE USER WANTED TO ACCESS
  // ==========================================

  const from = location.state?.from?.pathname || "/dashboard";

  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await fetch(
        `${API_URL}/api/users/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // ==========================================
        // SAVE JWT TOKEN
        // ==========================================

        localStorage.setItem("token", data.token);

        // ==========================================
        // GET USER DATA
        // ==========================================

        const userData = data.user || {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        };

        // ==========================================
        // SAVE LOGGED-IN USER
        // ==========================================

        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );

        // ==========================================
        // REDIRECT USER
        // ==========================================

        navigate(from, {
          replace: true,
        });
      } else {
        setErrorMessage(
          data.message ||
            "Invalid email or password."
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* ================= HEADER ================= */}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 text-3xl mb-4">
            🔐
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="text-slate-500 mt-2">
            Sign in to continue to ResQHub
          </p>
        </div>

        {/* ================= LOGIN CARD ================= */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8">

          {/* ERROR MESSAGE */}

          {errorMessage && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* ================= EMAIL ================= */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            {/* ================= PASSWORD ================= */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            {/* ================= LOGIN BUTTON ================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Signing in..."
                : "Login →"}
            </button>
          </form>

          {/* ================= REGISTER LINK ================= */}

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-red-500 hover:text-red-600 font-semibold"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* ================= FOOTNOTE ================= */}

        <p className="text-center text-xs text-slate-400 mt-6">
          Secure access to the ResQHub management platform
        </p>

      </div>
    </div>
  );
}

export default Login;