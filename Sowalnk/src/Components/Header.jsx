import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUser } from "../store/user-slice";
import Sidebar from "./Sidebar.jsx";
// import { signOut } from "firebase/auth";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user.loggedInUser);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      // await signOut(auth);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      dispatch(setLoggedInUser(null));
      toast.success("Logged out successfully");
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Invalid logout response");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch(setLoggedInUser(JSON.parse(user)));
    }
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Features", path: "/features" },
    { label: "Pricing", path: "/pricing" },
    { label: "Contact Us", path: "/contact" },
  ];

  return (
    <nav className="bg-purple-800 text-white">
      <div className="container mx-auto px-4 py-3 ">
        {/* Desktop Navigation */}
        <div className="flex justify-between items-center">
          {/* Branding */}
          <div className="flex justify-between items-center">
            <Sidebar />
            <div className="text-2xl font-bold ml-2 pt-2 lg:hidden">
              SOWALNK
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-violet-400"
                    : "hover:text-violet-400 transition"
                }
              >
                {item.label}
              </NavLink>
            ))}
            {auth ? (
              <button
                onClick={handleLogout}
                className="hover:text-violet-400 transition cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-violet-400"
                    : "hover:text-violet-400 transition"
                }
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 hover:bg-purple-700 rounded-lg transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-violet-400" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="pt-4 pb-3 space-y-3">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded ${
                    isActive
                      ? "text-violet-400 bg-purple-700"
                      : "hover:bg-purple-700 hover:text-violet-400 transition"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {auth ? (
              <button
                onClick={handleLogout}
                className="block py-2 px-4 rounded hover:bg-purple-700 hover:text-violet-400 transition"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded ${
                    isActive
                      ? "text-violet-400 bg-purple-700"
                      : "hover:bg-purple-700 hover:text-violet-400 transition"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
