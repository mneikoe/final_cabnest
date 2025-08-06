import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/forgot-password`,
        { email }
      );
      setSuccess("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send reset email.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-800/70 backdrop-blur-xl p-10 rounded-2xl max-w-md w-full shadow-lg border border-white/10"
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Forgot Password
        </h1>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg
              className="w-5 h-5 mr-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg
              className="w-5 h-5 mr-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <label
            htmlFor="email"
            className="block text-gray-400 text-sm font-semibold mb-2"
          >
            Enter your registered email address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@example.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 placeholder-gray-600 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl font-bold py-3 bg-gradient-to-r from-red-600 to-red-400 text-white shadow-lg hover:shadow-red-500/20 transition"
          >
            {loading ? "Sending reset link..." : "Send Reset Link"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Remembered password?{" "}
          <Link
            to="/login"
            className="text-red-400 hover:text-red-300 font-medium"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
