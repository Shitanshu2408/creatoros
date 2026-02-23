import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const AppLayout = ({ children, title = "Dashboard" }) => {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const initial =
    user?.name?.charAt(0)?.toUpperCase() || "U";


  // Close dropdown when clicking outside
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);


  const navItem =
    "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200";

  const activeClass =
    "bg-blue-50 text-blue-600 border-l-4 border-blue-600";

  const inactiveClass =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent";


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });

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

            <h2 className="text-xl font-semibold text-gray-800">
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


        {/* Logout in sidebar ONLY */}
        <div className="p-4 border-t border-gray-100">

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 text-sm font-medium"
          >
            Logout
          </button>

        </div>

      </aside>



      {/* Overlay */}
      {sidebarOpen && (

        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 md:hidden z-30"
        />

      )}



      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">


        {/* Navbar */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 md:px-8">


          {/* Left */}
          <div className="flex items-center gap-4">

            <button
              className="md:hidden text-xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>

            <h1 className="text-base sm:text-lg font-semibold">
              {title}
            </h1>

          </div>



          {/* Avatar */}
          <div
            ref={menuRef}
            className="relative z-50"
          >

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                w-9 h-9
                bg-blue-100 text-blue-600
                flex items-center justify-center
                rounded-full
                font-semibold
                hover:bg-blue-200
                cursor-pointer
              "
            >
              {initial}
            </button>



            {menuOpen && (

              <div
                className="
                  absolute right-0 mt-2
                  w-64
                  bg-white
                  border border-gray-200
                  rounded-lg
                  shadow-xl
                  z-50
                  overflow-hidden
                "
              >

                {/* Profile info */}
                <div className="px-4 py-4 border-b">

                  <div className="flex items-center gap-3">

                    <div className="
                      w-10 h-10
                      bg-blue-100 text-blue-600
                      rounded-full
                      flex items-center justify-center
                      font-semibold
                    ">
                      {initial}
                    </div>

                    <div>

                      <div className="text-sm font-semibold text-gray-800">
                        {user?.name || "User"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {user?.email}
                      </div>

                    </div>

                  </div>


                  <div className="mt-3 text-xs text-gray-500">

                    {user?.phone
                      ? user.phone
                      : (
                        <button
                          onClick={() => navigate("/profile")}
                          className="text-blue-600 hover:underline"
                        >
                          + Add phone number
                        </button>
                      )
                    }

                  </div>

                </div>


                {/* Edit Profile */}
                <button
                  onClick={() => navigate("/profile")}
                  className="
                    w-full text-left
                    px-4 py-3
                    text-sm text-gray-700
                    hover:bg-gray-50
                  "
                >
                  Edit Profile
                </button>

              </div>

            )}

          </div>


        </header>



        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">

          {children}

        </main>


      </div>


    </div>

  );

};

export default AppLayout;