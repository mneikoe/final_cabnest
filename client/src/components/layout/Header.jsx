import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();

  // Ref for dropdown container to handle outside click
  const dropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when navigation changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <img
              className="h-10 w-10 object-contain"
              src="/fcabnestlogo.jpg"
              alt="Cabnest Logo"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              CABNest
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                {/* Clickable profile button */}
                <button
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 select-none"
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                  type="button"
                >
                  <User size={18} className="text-gray-600" />
                  <span className="font-medium">{currentUser.name}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${
                      profileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                <div
                  className={`absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transition-opacity duration-200 ${
                    profileMenuOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {currentUser.isEmailVerified
                          ? "Verified"
                          : "Unverified"}
                      </span>
                      {currentUser.role === "student" && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {currentUser.remainingRides} rides left
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-2 flex flex-col gap-1">
                    {currentUser.role === "student" && (
                      <Link
                        to="/student/dashboard"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} className="text-gray-600" />
                        Dashboard
                      </Link>
                    )}
                    {currentUser.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} className="text-gray-600" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium text-red-600"
                      type="button"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={`${mobileMenuOpen ? "Close" : "Open"} menu`}
            type="button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4">
            {currentUser ? (
              <>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {currentUser.email}
                  </p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {currentUser.isEmailVerified ? "Verified" : "Unverified"}
                    </span>

                    {currentUser.role === "student" && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {currentUser.remainingRides} rides left
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  {currentUser.role === "student" && (
                    <Link
                      to="/student/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                  )}
                  {currentUser.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                    >
                      <LayoutDashboard size={16} />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-50 rounded-lg"
                    type="button"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg font-medium text-center transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-center transition-colors"
                >
                  Get Started
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
