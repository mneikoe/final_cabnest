import React from "react";
import { Link } from "react-router-dom";
import { MailWarning } from "lucide-react";
import { motion } from "framer-motion";

const EmailNotVerified = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100/90 to-teal-100/90 px-4">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 shadow-xl rounded-2xl border-[2px] border-white/60 backdrop-blur-lg px-7 py-12 max-w-md w-full flex flex-col items-center"
    >
      <MailWarning className="w-16 h-16 text-red-500 mb-3" />
      <h2 className="text-2xl font-bold text-red-600 mb-2">
        Email not verified
      </h2>
      <p className="text-gray-700 mb-6">
        Please verify your email address before accessing your dashboard. <br />
        Check your inbox (and spam folder) for the verification email.
      </p>
      <Link
        to="/verify-email/:token"
        className="text-white bg-red-500 px-5 py-2.5 rounded-lg font-semibold hover:bg-red-600 transition"
      >
        Go to Verify Email
      </Link>
    </motion.div>
  </div>
);

export default EmailNotVerified;
