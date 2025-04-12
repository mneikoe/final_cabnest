import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { UserPlus, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        location: formData.location,
      });
      navigate("/student/dashboard");
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const locations = [
    "Delhi",
    "RamaMandi/DeepNagar/AGI",
    "Phagwara",
    "LawGate/HardasPur/Maheru/Chaheru",
  ];

  const staggerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl w-full  max-w-md p-8 border border-white/10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block bg-gradient-to-br from-red-500 to-red-300 p-3 rounded-2xl mb-4"
          >
            <UserPlus size={32} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-teal-400 bg-clip-text text-transparent">
            Join CabNest Community
          </h1>
          <p className="text-gray-400 mt-2">
            Start your premium commute experience
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-transparent peer text-gray-200 "
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="absolute left-4 -top-2.5 px-1 text-sm text-gray-200 bg-gray-900/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-300"
              >
                Full Name
              </label>
            </div>
          </motion.div>

          <motion.div
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-transparent peer text-gray-200"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 -top-2.5 px-1 text-sm text-gray-400 bg-gray-900/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-300"
              >
                College Email
              </label>
            </div>
          </motion.div>
          <motion.div
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-transparent peer text-gray-200"
                placeholder=" "
                required
              />
              <label
                htmlFor="phone"
                className="absolute left-4 -top-2.5 px-1 text-sm text-gray-400 bg-gray-900/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-300"
              >
                Phone (WhatsApp)
              </label>
            </div>
          </motion.div>

          <motion.div
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <div className="relative">
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-300 appearance-none"
                required
              >
                <option value="" className="text-gray-500">
                  Select Your Location
                </option>
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="bg-gray-800">
                    {loc}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-transparent peer text-gray-200"
                placeholder=" "
                required
                minLength={6}
              />
              <label
                htmlFor="password"
                className="absolute left-4 -top-2.5 px-1 text-sm text-gray-400 bg-gray-900/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-300"
              >
                Password
              </label>
            </div>
          </motion.div>

          <motion.div
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-transparent peer text-gray-200"
                placeholder=" "
                required
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-4 -top-2.5 px-1 text-sm text-gray-400 bg-gray-900/50 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-300"
              >
                Confirm Password
              </label>
            </div>
          </motion.div>

          <motion.div
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-400 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-red-500/20 transition-all relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Get Started
                    <ArrowRight size={18} />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-300 opacity-0 group-hover:opacity-20 transition-opacity" />
            </motion.button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-gray-400 text-sm"
        >
          <span className="mr-2">Already have an account?</span>
          <Link
            to="/login"
            className="text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            Login here
          </Link>
        </motion.div>

        {/* Decorative Elements */}
      </motion.div>
    </div>
  );
};

export default Register;
