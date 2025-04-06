import React, { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserPlus,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Slot Management", href: "/admin/slots", icon: Calendar },
    { name: "Student Management", href: "/admin/students", icon: Users },
    { name: "Register Student", href: "/register", icon: UserPlus },
  ];

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b px-4 py-2 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        <h1 className="font-bold text-lg">College Transport Admin</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white border-r transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-200 ease-in-out
      `}
      >
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-xl font-bold">College Transport</h1>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`lg:pl-64 ${sidebarOpen ? "overflow-hidden h-screen" : ""}`}
      >
        <main className="p-4 lg:p-8 pt-16 lg:pt-6">{children}</main>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-0 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
