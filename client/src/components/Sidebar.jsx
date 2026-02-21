import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const navItem =
    "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200";

  const activeClass =
    "bg-blue-50 text-blue-600 shadow-sm";

  const inactiveClass =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between min-h-screen">
      
      {/* Top Section */}
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
        <nav className="flex flex-col gap-2 p-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Clients
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Payments
          </NavLink>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;