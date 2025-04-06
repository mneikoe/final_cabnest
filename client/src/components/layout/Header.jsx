import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-indigo-600 px-4 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold  transition"
          >
            <img
              className="h-10 w-10 rounded-full shadow-md object-cover"
              src="/cablogo.svg"
              alt="Cabnest Logo"
            />
            <span className="tracking-wide">Cabnest.co</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                {" "}
                <div className="relative group">
                  <button className="flex items-center space-x-1">
                    <span>{currentUser.name}</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      {currentUser.email}
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700">
                      Role: {currentUser.role}
                    </div>
                    {currentUser.role === "student" && (
                      <div className="px-4 py-2 text-sm text-gray-700">
                        Rides: {currentUser.remainingRides}
                      </div>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                    <Link to="/admin/dashboard" className="hover:text-gray-200">
                      Dashboard
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-indigo-500">
            {currentUser ? (
              <div className="space-y-3">
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-sm text-indigo-200">
                  {currentUser.email}
                </div>
                {currentUser.role === "student" && (
                  <div className="text-sm bg-indigo-700 rounded-lg p-2">
                    Available Rides: {currentUser.remainingRides}
                  </div>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-indigo-200 hover:text-white"
                >
                  Logout
                </button>
                <Link to="/admin/dashboard" className="hover:text-gray-200">
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block py-2 hover:text-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-white text-indigo-600 px-4 py-2 rounded-lg text-center hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
