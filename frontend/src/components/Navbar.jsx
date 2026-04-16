import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully 👋");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/">Home</Link>

      {!token ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/travel">Travel</Link>
          <Link to="/alerts">Alerts</Link>
          <Link to="/admin-alerts">Admin Alerts</Link>

          <button
            onClick={handleLogout}
            className="ml-auto bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;