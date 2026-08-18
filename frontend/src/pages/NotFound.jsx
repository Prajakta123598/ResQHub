import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">

        <div className="text-8xl mb-6">
          🚨
        </div>

        <p className="text-red-500 font-bold text-lg tracking-wider">
          ERROR 404
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3">
          Page Not Found
        </h1>

        <p className="text-slate-500 mt-4 leading-relaxed">
          Oops! The page you are looking for does not exist
          or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
          >
            ← Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
          >
            🏠 Back to Home
          </button>

        </div>

      </div>
    </div>
  );
}

export default NotFound;