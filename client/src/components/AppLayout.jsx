import { NavLink } from "react-router-dom";
import { useState } from "react";

const AppLayout = ({ children, title = "Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItem =
    "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200";

  const activeClass =
    "bg-blue-50 text-blue-600 border-l-4 border-blue-600";

  const inactiveClass =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setSidebarOpen(false);
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full
          w-72 bg-white border-r border-gray-200
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div>
          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
              CreatorOS
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Creative Business Manager
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 p-4">
            <NavLink
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/clients"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Clients
            </NavLink>

            <NavLink
              to="/projects"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Projects
            </NavLink>

            <NavLink
              to="/payments"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Payments
            </NavLink>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay (Mobile only) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-30"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Navbar */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 md:px-8">

          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 text-xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>

            <h1 className="text-base sm:text-lg font-semibold text-gray-800">
              {title}
            </h1>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full text-sm font-semibold">
            U
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AppLayout;