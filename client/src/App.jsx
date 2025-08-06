import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import VerifyEmail from "./components/auth/VerifyEmail";
import EmailNotVerified from "./components/auth/EmailNotVerified";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Layout from "./components/layout/Layout";
import CabNestLanding from "./components/LandingPage";
import BookRide from "./components/student/BookRide";
import MyBookings from "./components/student/MyBookings";

import Dashboard from "./components/admin/Dashboard";
import SlotManagement from "./components/admin/SlotManagement";
import StudentManagement from "./components/admin/StudentManagement";
import TermsConditions from "./components/TermsConditions";
import PlansAdmin from "./components/admin/PlansAdmin";
import Plans from "./components/student/Plans";

// Gated Route for dashboards (requires user, role, and verified email)
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

  // 👇 Block user if email is NOT verified
  // (But allow actual /verify-email/:token and unprotected pages)

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return element;
};

function App() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      {location.pathname !== "/" && <Header />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<CabNestLanding />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Forgot and Reset Password, Verify Email */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/verify-email-notice" element={<EmailNotVerified />} />

          {/* Student-only Dashboard */}
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
                requiredRole="student"
              />
            }
          />

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
          <Route
            path="/student/plans"
            element={
              <PrivateRoute element={<Plans />} requiredRole="student" />
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
          <Route
            path="/admin/plans"
            element={
              <PrivateRoute
                element={
                  <Layout>
                    <PlansAdmin />
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
