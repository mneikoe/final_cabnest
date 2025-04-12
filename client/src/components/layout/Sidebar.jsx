/*import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Home,
  Calendar,
  Car,
  Users,
  UserPlus,
  Map,
  NotebookTabs,
  Clock,
} from "lucide-react";

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
        {
          to: "/admin/plans",
          label: "Plans",
          icon: <NotebookTabs size={20} />,
        },
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
                    ? " bg-gradient-to-r from-red-600 to-red-400 text-white"
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
      
      <aside className="hidden md:block w-64  bg-gradient-to-r from-red-600 to-red-400 text-white p-4 min-h-screen">
        <SidebarContent />
      </aside>

      
      <nav className="fixed bottom-0 left-0 right-0 z-50  bg-gradient-to-r from-red-600 to-red-400 text-white flex justify-around items-center px-4 py-3 md:hidden border-t border-indigo-700 shadow-lg">
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

export default Sidebar;*/
import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { Home, Calendar, Car, Users, NotebookTabs, Clock } from "lucide-react";

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
        {
          to: "/admin/plans",
          label: "Plans",
          icon: <NotebookTabs size={20} />,
        },
      ]
    : [
        { to: "/student/dashboard", label: "Book", icon: <Car size={20} /> },
        { to: "/my-bookings", label: "Bookings", icon: <Calendar size={20} /> },
      ];

  const SidebarContent = () => (
    <div className="space-y-6 mt-6">
      {/* User Info Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-3 bg-white/10 rounded-xl backdrop-blur-sm"
      >
        <h2 className="text-lg font-semibold text-white">
          {isAdmin ? "Admin Portal" : "My Commute"}
        </h2>
        {currentUser?.location && (
          <p className="text-sm text-white/80 mt-1 flex items-center gap-1">
            <span className="text-red-300">📍</span>
            {currentUser.location}
          </p>
        )}
      </motion.div>

      {/* Navigation Links */}
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all 
                ${
                  isActive
                    ? "bg-white/10 backdrop-blur-sm shadow-inner text-white"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    animate={{ scale: isActive ? 1.15 : 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {link.icon}
                  </motion.span>
                  <span className="text-sm font-medium">{link.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 min-h-screen bg-gradient-to-b from-red-600/95 to-red-500/95 backdrop-blur-lg p-4 border-r border-white/10 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-red-600/95 backdrop-blur-lg border-t border-white/10 shadow-2xl md:hidden">
        <div className="flex justify-around items-center px-2 py-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-xl transition-all ${
                  isActive ? "bg-white/10 text-white" : "text-white/80"
                }`
              }
            >
              {({ isActive }) => (
                <motion.div
                  animate={{ y: isActive ? -5 : 0 }}
                  className="flex flex-col items-center"
                >
                  <motion.span
                    animate={{ scale: isActive ? 1.2 : 1 }}
                    className="text-xl mb-1"
                  >
                    {link.icon}
                  </motion.span>
                  <span className="text-[11px] font-medium">{link.label}</span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Location Indicator */}
        {currentUser?.location && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs text-black/90">
            📍 {currentUser.location}
          </div>
        )}
      </nav>
    </>
  );
};

export default Sidebar;
