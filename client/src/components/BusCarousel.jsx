import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  WifiIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function Hero() {
  const whatsappMessage = `Hi CabNest! I'd like to start the 3-day free trial. Can you help me?`;

  return (
    <section className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/busImg2.webp"
          alt="Campus transportation background"
          className="w-full h-full object-cover opacity-50"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Left Side Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-1">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <span className="inline-block bg-red-600/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium">
                🚌 Trusted by 10,000+ Students
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-white"
            >
              Premium Campus
              <span className="block bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent mt-2">
                Transportation Solution
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed"
            >
              Safe, reliable, and comfortable shuttle service with
            </motion.p>

            {/* Mobile Image (above CTA buttons on small screens) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="block lg:hidden w-full mb-8"
            >
              <img
                src="/img5.webp"
                alt="Modern campus shuttle bus with full amenities"
                className="w-full h-auto object-contain rounded-xl shadow-2xl"
              />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-10"
            >
              <a
                href={`https://wa.me/9815505777?text=${encodeURIComponent(
                  whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-transform hover:scale-105"
              >
                <span>🚀</span>
                Start Free Trial via WhatsApp
              </a>

              <button className="px-6 py-3 sm:px-8 sm:py-4 bg-white/5 border border-white/20 text-white rounded-xl font-semibold flex items-center justify-center gap-3 backdrop-blur-sm hover:bg-white/10 transition-all">
                <span>📜</span>
                View Safety Features
              </button>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-md mx-auto lg:mx-0"
            >
              {[
                {
                  icon: <UserGroupIcon className="w-6 h-6 text-red-400" />,
                  text: "1K+ Daily Riders",
                },
                {
                  icon: <ShieldCheckIcon className="w-6 h-6 text-red-400" />,
                  text: "Insured Vehicles",
                },
                {
                  icon: <WifiIcon className="w-6 h-6 text-red-400" />,
                  text: "Free WiFi",
                },
                {
                  icon: <ClockIcon className="w-6 h-6 text-red-400" />,
                  text: "95% On-Time",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-xl backdrop-blur-sm"
                >
                  {feature.icon}
                  <span className="text-gray-100 text-sm md:text-base font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                <span className="text-sm text-white">ISO Certified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-white">GST Registered</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side Image (for large screens) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block w-full lg:w-1/2 order-2 lg:order-2 mb-10 lg:mb-0"
          >
            <img
              src="/img5.webp"
              alt="Modern campus shuttle bus with full amenities"
              className="w-full h-auto object-contain rounded-xl shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
