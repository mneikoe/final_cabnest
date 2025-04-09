
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HeroWithBackgroundSlider from "./BusCarousel";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const CabNestLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const navigate = useNavigate();

  // Navigation links
  const navLinks = ["Features", "Pricing", "FAQ", "Contact"];

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
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur border-b border-white/20 shadow-sm transition-all duration-300">
  <div className="container mx-auto px-4 py-3 flex justify-between items-center">
    
    {/* Logo Section */}
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2"
    >
      <img
        src="/fcabnestlogo.jpg"
        alt="CabNest Logo"
        className="h-9 w-9 bg-white rounded-full sm:h-10 sm:w-10  object-contain"
      />
      <span className="text-2xl font-extrabold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
        CABNest
      </span>
    </motion.div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex items-center gap-6">
      {navLinks.map((link) => (
        <motion.a
          key={link}
          whileHover={{ y: -2 }}
          href={`#${link.toLowerCase()}`}
          className="text-sm font-medium text-gray-700 hover:text-red-500 transition-all"
        >
          {link}
        </motion.a>
      ))}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/login")}
        className="relative bg-gradient-to-r from-red-600 to-red-400 text-white px-6 py-2 rounded-full font-semibold group overflow-hidden"
      >
        <span className="relative z-10">Login</span>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>
    </div>

    {/* Mobile Menu & Toggle */}
    <div className="md:hidden flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/login")}
        className="bg-gradient-to-r from-red-600 to-red-400 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md"
      >
        Login
      </motion.button>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 rounded-lg hover:bg-red-100 transition"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-16 6h16" />
        </svg>
      </button>
    </div>

    {/* Mobile Dropdown */}
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-16 left-0 right-0 bg-white shadow-xl py-4 px-6 md:hidden z-50"
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-800 font-medium hover:text-red-500 transition"
            >
              {link}
            </a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</nav>

      
      <HeroWithBackgroundSlider/>

      {/* Animated Features Grid */}
      <section id="features" className="py-16 bg-gradient-to-b from-white to-blue-50">
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
      <section id="pricing" className="py-16 bg-gradient-to-b from-blue-50 to-white">
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
      <section id="faq" className="py-16 bg-red-50">
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
<section id="contact" className="py-20 bg-gradient-to-r from-red-500 via-red-400 to-orange-400 relative overflow-hidden">
  <div className="absolute -top-10 -left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
  <div className="container mx-auto px-4 text-center relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="inline-block max-w-2xl mx-auto"
    >
      <div className="text-5xl mb-4">
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-block"
        >
          🚌
        </motion.span>
      </div>

      <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
        Ready to Transform Your Commute?
      </h2>
      <p className="text-white text-lg mb-6">
        Discover stress-free daily travel with our smart, affordable, and reliable bus service.
      </p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
      >
        <button className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:bg-gray-100 transition-all">
          Start Your Free Trial
        </button>
        <button className="border border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-red-600 transition-all">
          See How It Works
        </button>
      </motion.div>

      <p className="text-blue-100 text-sm">
        🚀 Join <span className="font-bold text-white">10,000+</span> students enjoying smarter commutes
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-white text-sm">
        <div className="flex items-center gap-2">
          <i className="fas fa-check-circle text-green-300"></i> Real-time Tracking
        </div>
        <div className="flex items-center gap-2">
          <i className="fas fa-check-circle text-green-300"></i> Affordable Subscription
        </div>
        <div className="flex items-center gap-2">
          <i className="fas fa-check-circle text-green-300"></i> Zero Booking Hassle
        </div>
      </div>
    </motion.div>
  </div>
</section>

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 mb-16">

      {/* Branding */}
      <div className="md:col-span-1">
        <h3 className="text-3xl font-extrabold mb-4 text-white">CabNest</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Redefining campus mobility through innovation. Experience safe, fast, and smart rides within your university.
        </p>
      </div>

      {/* Product Links */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h4>
        <ul className="space-y-2 text-slate-400 text-sm">
          {["Features", "Pricing", "Mobile App", "Security"].map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors duration-200">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Company Links */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h4>
        <ul className="space-y-2 text-slate-400 text-sm">
          {["About", "Blog", "Careers", "Partners"].map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors duration-200">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div className="md:col-span-1">
        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Subscribe</h4>
        <p className="text-slate-400 text-sm mb-3">
          Get updates and offers straight to your inbox.
        </p>
        <form className="flex items-center space-x-2">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-3 py-2 rounded bg-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm rounded transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>

    {/* Contact Information */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8 text-slate-400 text-sm">
      <div>
        <h5 className="font-semibold text-white mb-2">Email</h5>
        <p>support@cabnest.in</p>
      </div>
      <div>
        <h5 className="font-semibold text-white mb-2">Phone</h5>
        <p>+91 9065139977</p>
      </div>
      <div>
        <h5 className="font-semibold text-white mb-2">Location</h5>
        <p>CabNest HQ, Tech park Phagwara, punjab, India</p>
      </div>
    </div>

    {/* Bottom Line */}
    <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-xs">
      <p>© {new Date().getFullYear()} CabNest Technologies. All rights reserved.</p>
    </div>
  </div>
</footer>
    </div>
  );
};

export default CabNestLanding;
