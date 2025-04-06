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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-white/20"
      >
        <div className="p-8">
          {/* Animated Header */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                whileHover={{ rotate: -10 }}
                className="bg-gradient-to-br from-red-700 to-red-300 p-3 rounded-2xl shadow-lg"
              >
                <LogIn size={32} className="text-white" />
              </motion.div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 to-teal-500 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Continue your seamless commute experience
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="your.email@college.edu"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-400 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-blue-200 transition-all relative overflow-hidden"
            >
              <span className="relative z-10">
                {loading ? "Signing In..." : "Continue Journey"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-0 hover:opacity-100 transition-opacity" />
            </motion.button>
          </form>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-100 rounded-full opacity-20 blur-xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-teal-100 rounded-full opacity-20 blur-xl" />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
