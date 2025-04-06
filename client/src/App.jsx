import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

// Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Layout from "./components/layout/Layout";
import CabNestLanding from "./components/LandingPage";
import BookRide from "./components/student/BookRIde";
import MyBookings from "./components/student/MyBookings";

import Dashboard from "./components/admin/Dashboard";
import SlotManagement from "./components/admin/SlotManagement";
import StudentManagement from "./components/admin/StudentManagement";

const PrivateRoute = ({ element, requiredRole }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return element;
};

function App() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Install PWA button */}
      {/* <InstallPWA /> */}

      {/* Header */}
      {/* Hide Header only on landing page */}
      {location.pathname !== "/" && <Header />}

      <div className="flex-1">
        <Routes>
          {/* Public route */}
          <Route path="/" element={<CabNestLanding />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />

          {/* This route is now protected below – remove public access to /register */}
          {/* <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/" />} /> */}

          {/* Default route — redirects to appropriate view based on role */}
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    {currentUser?.role === "student" ? (
                      <BookRide />
                    ) : (
                      <Dashboard />
                    )}
                  </Layout>
                }
              />
            }
          />

          {/* Student-specific route */}
          <Route
            path="/my-bookings"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <MyBookings />
                  </Layout>
                }
                requiredRole="student"
              />
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
                requiredRole="admin"
              />
            }
          />
          <Route
            path="/admin/slots"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <SlotManagement />
                  </Layout>
                }
                requiredRole="admin"
              />
            }
          />
          <Route
            path="/admin/students"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <StudentManagement />
                  </Layout>
                }
                requiredRole="admin"
              />
            }
          />

          {/* Only admin can register students */}
          <Route
            path="/register"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <Register />
                  </Layout>
                }
                requiredRole="admin"
              />
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
