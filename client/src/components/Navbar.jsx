import { useNavigate } from "react-router-dom";

const Navbar = ({ title = "Dashboard" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      
      {/* Left */}
      <h1 className="text-lg font-semibold text-gray-800">
        {title}
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        
        {/* User Avatar */}
        <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-semibold text-sm">
          U
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-500 hover:text-red-600 transition"
        >
          Logout
        </button>

      </div>
    </header>
  );
};

export default Navbar;