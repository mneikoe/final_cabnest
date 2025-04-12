import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { LogIn } from "lucide-react";
import { motion } from "framer-motion";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await login(formData.email, formData.password);
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center  px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl w-full  max-w-4xl overflow-hidden border border-white/10 relative"
      >
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-teal-400/10" />
          <div className="pattern-dots pattern-gray-700 pattern-size-4 pattern-opacity-100" />
        </div>

        <div className="relative z-10 flex">
          {/* Feature Panel */}
          <div className="hidden md:block w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 p-12 border-r border-white/10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full flex flex-col justify-center"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Premium Campus Mobility Features
              </h2>
              <div className="space-y-5">
                {[
                  "Real-time GPS Tracking",
                  "AI-Powered Scheduling",
                  "Premium AC Coaches",
                  "24/7 Safety Monitoring",
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <LogIn size={16} className="text-red-400" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Login Form */}
          <div className="w-full md:w-1/2 p-12">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-center mb-10"
            >
              <div className="mb-6">
                <motion.div
                  whileHover={{ rotate: -10 }}
                  className="inline-block bg-gradient-to-br from-red-600 to-red-400 p-3 rounded-2xl shadow-xl"
                >
                  <LogIn size={32} className="text-white" />
                </motion.div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-teal-400 bg-clip-text text-transparent mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-400">
                Continue your premium campus experience
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center backdrop-blur-sm"
              >
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
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  College Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-600 text-gray-300 transition-all"
                    placeholder="name@university.edu"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pr-3">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-600 text-gray-300 transition-all"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pr-3">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-400 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-red-500/20 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    "Continue Journey"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-300 opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
            </form>

            {/* Additional Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center text-gray-400 text-sm"
            >
              <span className="mr-2">New commuter?</span>
              <Link
                to="/register"
                className="text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Create Account
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
