/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

const CabNestLanding = () => {
  // Navigation links
  const navLinks = ["Home", "Features", "Pricing", "How It Works", "Contact"];

  // FAQ items
  const faqItems = [
    {
      question: "How does the 44 rides system work?",
      answer:
        "You get 44 rides per month (22 days × 2 rides/day). One ride for going to college and one for returning. You can book your preferred time slots through the app.",
    },
    {
      question: "Can I change my time slots?",
      answer:
        "Yes! You can modify your time slots up to 2 hours before the scheduled pickup time, subject to availability.",
    },
    {
      question: "Are the buses air-conditioned?",
      answer:
        "Absolutely! All our buses are equipped with AC and comfortable seating to ensure a pleasant journey.",
    },
    {
      question: "How do I book my rides?",
      answer:
        "Simply select your preferred time slots for going to college and returning after registration. The app will show available options with 1-hour intervals.",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Priya S.",
      college: "ABC Engineering College",
      text: "CabNest has made my commute stress-free and comfortable. No more crowded public transport!",
    },
    {
      name: "Rahul M.",
      college: "XYZ University",
      text: "The AC buses and flexible timings make CabNest perfect for my unpredictable class schedule.",
    },
  ];

  // Time slot examples

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 ">
      
      <nav className="fixed w-full z-50 backdrop-blur-md bg-white/80 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <img
              src="/cablogo.svg"
              alt="CabNest Logo"
              className="h-10 w-auto rounded-full object-contain"
            />
            <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
              CabNest
            </span>
          </motion.div>

          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <motion.a
                key={link}
                whileHover={{ y: -2 }}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link}
              </motion.a>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/login`)}
            className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-full font-semibold overflow-hidden group"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </div>
      </nav>

    
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Stress-Free Campus
                <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Commutes
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Premium AC transport with flexible scheduling. 44 rides/month,
                <br className="hidden lg:block" /> your timetable, your rules.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ y: -2 }}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-200 transition-all"
                >
                  Start Free Trial
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-400 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Join Early Access</h3>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full mb-4 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                >
                  Get Priority Access
                </motion.button>
                <p className="text-sm text-slate-500 mt-4">
                  🎁 Early members get 2 free weeks
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    
      <section className="py-20 bg-white/50 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why <span className="text-blue-600">CabNest</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⏱️",
                title: "Flexible Timing",
                text: "Choose from 12+ daily slots that match your schedule",
              },
              {
                icon: "❄️",
                title: "AC Comfort",
                text: "Travel in chilled luxury with premium seating",
              },
              {
                icon: "💸",
                title: "Budget Friendly",
                text: "Premium service at 40% less than alternatives",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-600">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-teal-400"></div>

            {[
              {
                step: "1",
                title: "Sign Up",
                text: "Create your account in 2 minutes",
              },
              {
                step: "2",
                title: "Choose Plan",
                text: "Select monthly or semester pass",
              },
              {
                step: "3",
                title: "Book Slots",
                text: "Pick your preferred timings",
              },
              {
                step: "4",
                title: "Ride Safe",
                text: "Get Saved from Rush",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`mb-16 flex ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                } items-center`}
              >
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="w-1/2 p-6"
                >
                  <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="text-blue-600 text-2xl font-bold mb-2">
                      Step {item.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-600">{item.text}</p>
                  </div>
                </motion.div>
                <div className="w-1/2 flex justify-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            whileHover={{ rotateY: 5, rotateX: 2 }}
            className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden transform-style-preserve-3d perspective-1000"
          >
            <div className="px-8 py-12 bg-gradient-to-br from-blue-600 to-teal-500 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Monthly Pass
              </h3>
              <div className="text-4xl font-bold text-white mb-2">
                ₹1,799<span className="text-xl">/month</span>
              </div>
              <div className="text-blue-100">44 Rides • 30 Days</div>
            </div>

            <div className="p-8">
              <ul className="space-y-4 mb-8">
                {[
                  "No Rush, Comfortable Seating",
                  "AC Luxury Buses",
                  "Flexible Rescheduling",
                  "24/7 Support",
                  "Safety Features",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Student Stories
          </h2>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
            }}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-slate-600">{testimonial.college}</p>
                    </div>
                  </div>
                  <p className="text-slate-700 italic">"{testimonial.text}"</p>
                  <div className="mt-6 flex space-x-2">
                    {Array(5)
                      .fill()
                      .map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Common Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                className="border rounded-xl p-6 hover:border-blue-200 hover:bg-white hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">{item.question}</h4>
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                {item.answer && (
                  <p className="mt-4 text-slate-600">{item.answer}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="inline-block"
          >
            <h2 className="text-4xl font-bold text-white mb-8">
              Ready to Transform Your Commute?
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Ride Now
            </motion.button>
            <p className="mt-6 text-blue-100">
              🚌 First 100 members get premium benefits
            </p>
          </motion.div>
        </div>
      </section>

    
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CabNest</h3>
              <p className="text-slate-400">Redefining campus mobility</p>
            </div>
            
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>© 2025 CabNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CabNestLanding;*/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const CabNestLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const navigate = useNavigate();

  // Navigation links
  const navLinks = ["Features", "Pricing", "Testimonials", "FAQ", "Contact"];

  // FAQ items
  const faqItems = [
    {
      question: "How does the 44 rides system work?",
      answer:
        "You get 44 rides per month (22 days × 2 rides/day). One ride for going to college and one for returning. You can book your preferred time slots through the app.",
    },
    {
      question: "Can I change my time slots?",
      answer:
        "Yes! You can modify your time slots up to 2 hours before the scheduled pickup time, subject to availability.",
    },
    {
      question: "Are the buses air-conditioned?",
      answer:
        "Absolutely! All our buses are equipped with AC and comfortable seating to ensure a pleasant journey.",
    },
    {
      question: "How do I book my rides?",
      answer:
        "Simply select your preferred time slots for going to college and returning after registration. The app will show available options with 1-hour intervals.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 overflow-x-hidden">
      {/* Premium Navigation */}
      <nav className="fixed w-full z-50 backdrop-blur-md bg-white/90 border-b border-white/10">
        <div className="container  mx-auto px-4 py-3 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex  items-center gap-2"
          >
            <img
              src="/fcabnestlogo.jpg"
              alt="CabNest Logo"
              className="h-9 w-9 sm:h-10 sm:w-10  object-contain"
            />
            <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              CABNest
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <motion.a
                key={link}
                whileHover={{ y: -2 }}
                href={`#${link.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {link}
              </motion.a>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/login`)}
              className="relative bg-gradient-to-r from-red-600 to-red-400 text-white px-6 py-2 rounded-full font-semibold overflow-hidden group"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-red-600 to-red-400 text-white px-4 py-2 rounded-full text-sm"
            >
              Login
            </motion.button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-red-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-16 6h16"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-6"
              >
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="block py-2 text-gray-700 hover:text-red-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Rush Free & Premium
                <span className="block bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mt-2">
                  Campus Commutes
                </span>
              </h1>
              <p className="text-lg text-pink-900 mb-8 max-w-xl mx-auto lg:mx-0">
                Experience premium AC transport with AI-powered scheduling. 44
                rides/month,
                <span className="hidden lg:inline">
                  {" "}
                  your timetable, your rules.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ y: -2 }}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-200 transition-all"
                >
                  Start Free Trial
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  className="px-8 py-3 border-2 border-red-600 text-red-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                >
                  Watch Video Tour
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/2 w-full max-w-xl mt-12 lg:mt-0"
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-teal-400 rounded-2xl blur-lg opacity-20" />
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Early Access Signup
                  </h3>
                  <input
                    type="email"
                    placeholder="student@college.edu"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold shadow-md  hover:bg-blue-700"
                  >
                    Get Priority Access
                  </motion.button>
                  <p className="text-sm text-gray-500 text-center">
                    🚌 First 100 signups get 2 free weeks
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated Features Grid */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Why <span className="text-red-600">CabNest</span> Stands Out
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "Smart Scheduling",
                text: "AI-powered time slot recommendations based on your routine",
                color: "bg-blue-100",
              },
              {
                icon: "🎯",
                title: "Real-Time Tracking",
                text: "Live bus location updates and arrival predictions",
                color: "bg-green-100",
              },
              {
                icon: "🛡️",
                title: "Safety First",
                text: "Verified drivers, SOS button, and ride sharing controls",
                color: "bg-purple-100",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl ${feature.color} backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-all`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-gradient-to-b from-blue-400 to-teal-300" />

            {[
              {
                step: "1",
                title: "Sign Up",
                text: "2-minute registration with college ID",
              },
              {
                step: "2",
                title: "Choose Plan",
                text: "Flexible monthly or semester packages",
              },
              {
                step: "3",
                title: "Book Slots",
                text: "Select preferred times via app/web",
              },
              {
                step: "4",
                title: "Ride & Repeat",
                text: "Track bus and manage bookings",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-12 md:mb-16 flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/2 p-4 order-2 md:order-1">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="text-red-500 font-bold mb-2">
                      Step {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center order-1 md:order-2 mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl">
                    {item.step}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Pricing Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Simple Pricing
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Starter Pack",
                price: "₹1,499",
                duration: "/month",
                features: [
                  "44 Rides",
                  "Basic Support",
                  "1 Bus Route",
                  "Flexible Cancellation",
                ],
                color: "from-blue-100 to-white",
              },
              {
                title: "Premium Plan",
                price: "₹3,999",
                duration: "/semester",
                features: [
                  "264 Rides",
                  "Priority Support",
                  "Multiple Routes",
                  "Advanced Booking",
                  "VIP Seating",
                ],
                color: "from-red-300 to-red-100",
                popular: true,
              },
              {
                title: "Custom Plan",
                price: "Custom",
                duration: "",
                features: [
                  "Tailored Rides",
                  "Dedicated Support",
                  "Route Customization",
                  "Group Discounts",
                ],
                color: "from-purple-100 to-white",
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-b ${
                  plan.color
                } rounded-2xl shadow-xl overflow-hidden border ${
                  plan.popular ? "border-pink-100" : "border-gray-100"
                }`}
              >
                <div className="p-8">
                  {plan.popular && (
                    <div className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                  <div className="flex items-end mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.duration}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className={`w-full py-3 rounded-lg font-semibold ${
                      plan.popular
                        ? "bg-white text-blue-600 hover:bg-gray-50"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    Get Started
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive FAQ */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border rounded-xl bg-white hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
              >
                <div className="flex justify-between items-center p-6">
                  <h4 className="font-semibold text-gray-800">
                    {item.question}
                  </h4>
                  <motion.div
                    animate={{ rotate: activeFAQ === index ? 180 : 0 }}
                    className="text-red-600"
                  >
                    ▼
                  </motion.div>
                </div>
                <AnimatePresence>
                  {activeFAQ === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6 text-gray-600"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-red-400">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="inline-block"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Commute?
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              Start Your Free Trial
            </motion.button>
            <p className="mt-6 text-blue-100 text-sm">
              🚀 Join 10,000+ students enjoying stress-free commutes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">CabNest</h3>
              <p className="text-slate-400 text-sm">
                Redefining campus mobility through innovation
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "Mobile App", "Security"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href={`#${link.toLowerCase()}`}
                        className="text-slate-400 hover:text-white text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Company</h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Partners"].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-slate-400 hover:text-white text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Connect</h4>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "linkedin"].map(
                  (social) => (
                    <a
                      key={social}
                      href={`https://www.${social}.com/cabnest`}
                      className="text-slate-400 hover:text-white"
                    >
                      <span className="sr-only">{social}</span>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        {/* Add social media icons */}
                      </svg>
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>© 2024 CabNest Technologies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CabNestLanding;
