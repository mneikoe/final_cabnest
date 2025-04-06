import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Home, Calendar, Car, Users, UserPlus, Map, Clock } from "lucide-react";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.role === "admin";

  const links = isAdmin
    ? [
        {
          to: "/admin/dashboard",
          label: "Dashboard",
          icon: <Home size={20} />,
        },
        { to: "/admin/slots", label: "Slots", icon: <Clock size={20} /> },
        { to: "/admin/students", label: "Students", icon: <Users size={20} /> },
        { to: "/register", label: "Register", icon: <UserPlus size={20} /> },
      ]
    : [
        { to: "/student/dashboard", label: "Book", icon: <Car size={20} /> },
        { to: "/my-bookings", label: "Bookings", icon: <Calendar size={20} /> },
      ];

  const SidebarContent = () => (
    <div className="space-y-6 mt-6">
      <div>
        <h2 className="text-xl font-bold mb-1">
          {isAdmin ? "Admin Panel" : "Student Panel"}
        </h2>
        <p className="text-sm text-indigo-200">
          {currentUser?.location && `Location: ${currentUser.location}`}
        </p>
      </div>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-900 text-white"
                    : "text-indigo-200 hover:bg-indigo-700 hover:text-white"
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-indigo-800 text-white p-4 min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-indigo-800 text-white flex justify-around items-center px-4 py-3 md:hidden border-t border-indigo-700 shadow-lg">
        <div className="absolute top-[-1.75rem] w-full text-center">
          {currentUser.role === "student" && currentUser?.location && (
            <p className="text-[13px] text-indigo-200 font-medium">
              📍 {currentUser.location}
            </p>
          )}
        </div>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 text-xs transition-all duration-200 ease-in-out ${
                isActive ? "text-white" : "text-indigo-300"
              }`
            }
            aria-label={link.label}
          >
            <div className="text-lg">{link.icon}</div>
            <span className="text-[11px]">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
