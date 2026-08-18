import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-6">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Smart Emergency Management Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Emergency Response.
              <span className="block text-red-400">
                Simplified.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mt-6 leading-relaxed max-w-2xl">
              ResQHub is a centralized platform for managing
              emergency fire alerts, travel requests, expenses,
              and administrative actions efficiently.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/register"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-center transition"
              >
                Get Started →
              </Link>

              <Link
                to="/login"
                className="border border-slate-600 hover:bg-white/10 px-6 py-3 rounded-lg font-semibold text-center transition"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Mini Status Panel */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">

            <div className="bg-white/5 border border-white/10 backdrop-blur p-5 rounded-xl">
              <p className="text-slate-400 text-sm">
                Emergency Monitoring
              </p>

              <p className="text-2xl font-bold mt-2">
                24/7 Ready
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur p-5 rounded-xl">
              <p className="text-slate-400 text-sm">
                Centralized System
              </p>

              <p className="text-2xl font-bold mt-2">
                One Platform
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur p-5 rounded-xl">
              <p className="text-slate-400 text-sm">
                Secure Access
              </p>

              <p className="text-2xl font-bold mt-2">
                JWT Protected
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-red-500 font-semibold uppercase tracking-wider text-sm">
            Platform Features
          </p>

          <h2 className="text-4xl font-bold mt-3">
            Everything in one place
          </h2>

          <p className="text-gray-500 mt-4">
            ResQHub brings together essential workflows into
            one centralized management platform.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Fire Alerts */}
          <div className="bg-white border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-xl text-2xl">
              🚨
            </div>

            <h3 className="text-xl font-bold mt-5">
              Fire Alerts
            </h3>

            <p className="text-gray-500 mt-3 leading-relaxed">
              Report emergency situations quickly and track
              their resolution status.
            </p>
          </div>


          {/* Travel */}
          <div className="bg-white border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-xl text-2xl">
              ✈️
            </div>

            <h3 className="text-xl font-bold mt-5">
              Travel Management
            </h3>

            <p className="text-gray-500 mt-3 leading-relaxed">
              Create travel requests and track approval
              decisions from administrators.
            </p>
          </div>


          {/* Expenses */}
          <div className="bg-white border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-xl text-2xl">
              💰
            </div>

            <h3 className="text-xl font-bold mt-5">
              Expense Tracking
            </h3>

            <p className="text-gray-500 mt-3 leading-relaxed">
              Manage and organize expenses associated with
              travel activities.
            </p>
          </div>


          {/* Admin */}
          <div className="bg-white border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-xl text-2xl">
              🛡️
            </div>

            <h3 className="text-xl font-bold mt-5">
              Admin Control
            </h3>

            <p className="text-gray-500 mt-3 leading-relaxed">
              Review travel requests and manage active
              emergency alerts from one control center.
            </p>
          </div>

        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-white border-y">

        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="text-center mb-16">
            <p className="text-red-500 font-semibold uppercase tracking-wider text-sm">
              Simple Workflow
            </p>

            <h2 className="text-4xl font-bold mt-3">
              How ResQHub works
            </h2>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            <div className="relative">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                01
              </div>

              <h3 className="font-bold text-xl mt-5">
                Create Account
              </h3>

              <p className="text-gray-500 mt-2">
                Register securely and access the ResQHub
                platform.
              </p>
            </div>


            <div className="relative">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                02
              </div>

              <h3 className="font-bold text-xl mt-5">
                Submit Request
              </h3>

              <p className="text-gray-500 mt-2">
                Create travel requests or send emergency
                fire alerts.
              </p>
            </div>


            <div className="relative">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                03
              </div>

              <h3 className="font-bold text-xl mt-5">
                Admin Review
              </h3>

              <p className="text-gray-500 mt-2">
                Administrators review requests and manage
                emergency situations.
              </p>
            </div>


            <div className="relative">
              <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                04
              </div>

              <h3 className="font-bold text-xl mt-5">
                Track Progress
              </h3>

              <p className="text-gray-500 mt-2">
                Users can monitor the latest status and
                manage their activities.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-10 md:p-16 text-center">

          <p className="text-red-400 font-semibold">
            READY TO GET STARTED?
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            Manage smarter.
            <br />
            Respond faster.
          </h2>

          <p className="text-slate-300 mt-5 max-w-xl mx-auto">
            Join ResQHub and manage emergency workflows
            from a single centralized platform.
          </p>

          <Link
            to="/register"
            className="inline-block bg-red-500 hover:bg-red-600 px-8 py-4 rounded-xl font-semibold mt-8 transition"
          >
            Create Your Account →
          </Link>

        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <div>
            <h3 className="font-bold text-xl">
              🚨 ResQHub
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Smart Emergency & Resource Management System
            </p>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 ResQHub. Built with MERN Stack.
          </p>

        </div>
      </footer>

    </div>
  );
}

export default Home;