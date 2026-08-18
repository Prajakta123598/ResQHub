import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    console.error("Invalid user data in localStorage");
  }

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
      isActive
        ? "bg-red-500 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <nav className="bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* LOGO */}

          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 font-bold text-xl shrink-0"
          >
            <span className="text-2xl">🚨</span>

            <div>
              <span className="text-white">ResQ</span>
              <span className="text-red-500">Hub</span>
            </div>
          </NavLink>

          {/* DESKTOP NAVIGATION */}

          <div className="hidden xl:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            {!token ? (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap"
                >
                  Get Started
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>

                <NavLink to="/travel" className={navLinkClass}>
                  Travels
                </NavLink>

                <NavLink to="/alerts" className={navLinkClass}>
                  Fire Alerts
                </NavLink>

                {/* ADMIN CONTROL */}

                {isAdmin && (
                  <NavLink
                    to="/admin-alerts"
                    className={navLinkClass}
                  >
                    🛡️ Admin Control
                  </NavLink>
                )}

                <div className="h-7 w-px bg-slate-700 mx-2" />

                {/* USER */}

                <div className="flex items-center gap-2 px-2">
                  <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center font-bold text-sm uppercase">
                    {user?.name?.charAt(0) || "U"}
                  </div>

                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-white">
                      {user?.name || "User"}
                    </span>

                    <span className="text-xs text-slate-400">
                      {isAdmin ? "Administrator" : "User"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-2 bg-slate-800 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden p-2 rounded-lg hover:bg-slate-800 transition text-2xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}

      {menuOpen && (
        <div className="xl:hidden border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-5">
            <div className="flex flex-col gap-2 pt-4">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={navLinkClass}
              >
                🏠 Home
              </NavLink>

              {!token ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className={navLinkClass}
                  >
                    🔐 Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg text-sm font-semibold transition"
                  >
                    Get Started →
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className={navLinkClass}
                  >
                    📊 Dashboard
                  </NavLink>

                  <NavLink
                    to="/travel"
                    onClick={() => setMenuOpen(false)}
                    className={navLinkClass}
                  >
                    ✈️ Travels
                  </NavLink>

                  <NavLink
                    to="/alerts"
                    onClick={() => setMenuOpen(false)}
                    className={navLinkClass}
                  >
                    🚨 Fire Alerts
                  </NavLink>

                  {/* ADMIN CONTROL */}

                  {isAdmin && (
                    <NavLink
                      to="/admin-alerts"
                      onClick={() => setMenuOpen(false)}
                      className={navLinkClass}
                    >
                      🛡️ Admin Control
                    </NavLink>
                  )}

                  <div className="border-t border-slate-800 mt-2 pt-4">
                    <div className="flex items-center gap-3 px-3 py-3 bg-slate-900 rounded-xl">
                      <div className="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center font-bold text-lg uppercase">
                        {user?.name?.charAt(0) || "U"}
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          {user?.name || "User"}
                        </p>

                        <p className="text-sm text-slate-400">
                          {user?.email || ""}
                        </p>

                        {isAdmin && (
                          <span className="inline-block mt-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded text-xs">
                            🛡️ ADMIN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-left bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg text-sm font-semibold transition mt-2"
                  >
                    🚪 Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;