import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import {
  User,
  LayoutDashboard,
  Menu,
  X,
  MessageCircle,
  CheckCircle,
  Shield,
  Zap,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  IndianRupee,
  Wallet,
  Landmark,
  Instagram,
  Linkedin,
} from "lucide-react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import Hero from "./BusCarousel";

const CabNestLanding = () => {
  const { currentUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const navigate = useNavigate();
  // Navigation links

  // Navigation links with conditional dashboard
  const sectionLinks = ["Features", "Pricing", "FAQ", "Contact"];
  const dashboardLink = currentUser ? ["Dashboard"] : [];

  const navLinks = [...dashboardLink, ...sectionLinks];
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
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur border-b border-white/20 shadow-sm transition-all duration-300">
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
              className="h-9 w-9 bg-white rounded-full sm:h-10 sm:w-10 object-contain"
            />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
              CABNest
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const sectionId = link.toLowerCase().replace(/ & /g, "-");
              if (link === "Dashboard") {
                return (
                  <motion.div
                    key={link}
                    whileHover={{ y: -2 }}
                    className="relative group"
                  >
                    <Link
                      to={
                        currentUser?.role === "admin"
                          ? "/admin/dashboard"
                          : "/student/dashboard"
                      }
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-500 transition-all"
                    >
                      <LayoutDashboard size={16} className="mr-1" />
                      {link}
                    </Link>
                  </motion.div>
                );
              }
              return (
                <motion.a
                  key={link}
                  whileHover={{ y: -2 }}
                  href={`#${sectionId}`}
                  className="text-sm font-medium text-gray-700 hover:text-red-500 transition-all"
                >
                  {link}
                </motion.a>
              );
            })}

            {currentUser ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 pl-4"
              >
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <User size={18} className="text-gray-600" />
                  <span className="text-sm font-medium">
                    {currentUser.name}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="relative bg-gradient-to-r from-red-600 to-red-400 text-white px-6 py-2 rounded-full font-semibold group overflow-hidden"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-3">
            {currentUser ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 pl-4"
              >
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <User size={18} className="text-gray-600" />
                  <span className="text-sm font-medium">
                    {currentUser.name}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="relative bg-gradient-to-r from-red-600 to-red-400 text-white px-6 py-2 rounded-full font-semibold group overflow-hidden"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-red-100 transition"
            >
              {isMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
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
                {navLinks.map((link) => {
                  if (link === "Dashboard") {
                    return (
                      <Link
                        key={link}
                        to={
                          currentUser?.role === "admin"
                            ? "/admin/dashboard"
                            : "/student/dashboard"
                        }
                        className="flex items-center gap-2 py-3 text-gray-800 font-medium hover:text-red-500 transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        {link}
                      </Link>
                    );
                  }
                  return (
                    <a
                      key={link}
                      href={`#${link.toLowerCase().replace(" & ", "-")}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-3 text-gray-800 font-medium hover:text-red-500 transition"
                    >
                      {link}
                    </a>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      <Hero />
      {/* Animated Features Grid */}
      <section
        id="features"
        className="py-16 px-4 bg-gradient-to-b from-white to-blue-50"
      >
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
                className={`p-3 rounded-2xl ${feature.color} backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-all`}
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
      /
      <section
        id="pricing"
        className="py-16 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Transparent Payment Plans
          </h2>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="text-center mb-8">
              <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                3-Step Secure WhatsApp Payment
              </h3>
              <p className="text-gray-600">
                Get instant activation with official payment receipt
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm">Payment Protection</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Instant Activation</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <Zap className="w-5 h-5 text-orange-600" />
                <span className="text-sm">No Hidden Charges</span>
              </div>
            </div>

            {/* Enhanced Plan Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  name: "Monthly Plan",
                  price: "1,177",
                  duration: "month",
                  rides: "44 Rides (2/day)",
                  features: [
                    "22 College Days Coverage",
                    "Flexible Time Slots",
                    "Real-time Bus Tracking",
                    "Cancel Anytime Policy",
                  ],
                  color: "bg-blue-50",
                  textColor: "text-blue-600",
                },
                {
                  name: "Semester Plan",
                  price: "4,477",
                  duration: "4 months",
                  rides: "176 Rides (2/day)",
                  features: [
                    "132 College Days Coverage",
                    "Priority Slot Booking",
                    "VIP Support",
                    "2 Free Change Requests",
                  ],
                  color: "bg-red-50",
                  textColor: "text-red-600",
                },
              ].map((plan, index) => (
                <div key={index} className={`${plan.color} p-6 rounded-xl`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className={`font-semibold text-lg ${plan.textColor}`}>
                        {plan.name}
                      </h4>
                      <div className="text-2xl font-bold mb-1">
                        Starting From ₹{plan.price}
                        <span className="text-sm text-gray-500 ml-1">
                          /{plan.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{plan.rides}</p>
                    </div>
                    <div className="bg-white px-2 py-1 rounded-full text-sm">
                      Save {(index + 1) * 15}%
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`https://wa.me/7717723607?text=Hi!%20I%20want%20to%20purchase%20the%20${plan.name}%20(₹${plan.price})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Get {plan.name}
                  </a>
                </div>
              ))}
            </div>

            {/* Payment Assurance */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p className="mb-2">
                <Shield className="w-5 h-5 inline-block mr-2 text-blue-500" />
                All payments protected by our{" "}
                <span className="font-medium">100% Satisfaction Guarantee</span>
              </p>
              <p>
                Need help? WhatsApp us at{" "}
                <a
                  href="https://wa.me/7717723607"
                  className="text-blue-600 hover:underline"
                >
                  +91 7717723607
                </a>
                (9AM - 7PM)
              </p>
            </div>
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
      {/* Premium Footer */}
      <footer
        id="contact"
        className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
            {/* Branding & Trust Seals */}
            <div className="lg:col-span-2">
              <div className="mb-2">
                <h3 className="text-2xl font-extrabold mb-4 flex gap-4 text-white">
                  <img
                    src="/fcabnestlogo.jpg"
                    className="h-9 w-9 bg-white rounded-full sm:h-10 sm:w-10 object-contain"
                    alt="CabNest Logo"
                  />
                  CABNest
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  ISO 9001:2015 Certified • PCI DSS Compliant Payments
                </p>
              </div>

              {/* Social Proof */}
              <div className="border-t border-slate-800 pt-6">
                <p className="text-slate-400 text-sm mb-2">
                  Trusted by 10,000+ students across 15+ campuses
                </p>
                <div className="flex gap-4 items-center">
                  <div className="flex -space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/40?img=${i}`}
                        className="h-8 w-8 rounded-full border-2 border-white"
                        alt="Student"
                      />
                    ))}
                  </div>

                  <div className="text-slate-400 text-sm">4.9/5 ★★★★★</div>
                </div>
              </div>
            </div>

            {/* Legal & Compliance */}
            <div>
              <ul className="space-y-2 text-slate-400 text-sm">
                {[["Terms of Service", "/terms-and-conditions"]].map(
                  ([text, href]) => (
                    <li key={href}>
                      <Link
                        to={href}
                        className="hover:text-white transition-colors"
                      >
                        {text}
                      </Link>
                    </li>
                  )
                )}
              </ul>
              <div className="flex mt-5 gap-3 ml-2">
                <a
                  href="https://www.instagram.com/cabnest.co.in?igsh=MXNoc3ljbTRuOTJhNg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                {/* <a
                  href="https://linkedin.com/company/yourcompany"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>*/}
              </div>
            </div>

            {/* Contact & Verification */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                Verified Business
              </h4>
              <div className="space-y-3 text-slate-400 text-sm">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Legal Entity:</p>
                    <p>ABHISHEK RAJ (Proprietor)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Registered Office:</p>
                    <p>Dubb Homes, Kapurthala</p>
                    <p>Punjab - 144411, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">24/7 Support:</p>
                    <p>+91 7717723607</p>
                    <p>Mon-Sun: 7AM - 11PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Official Emails:</p>
                    <p>cabnest.info@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">
                  Payment Methods We Accept
                </p>
                <div className="flex gap-3">
                  <CreditCard className="w-8 h-8 text-green-400" />
                  <IndianRupee className="w-8 h-8 text-blue-400" />
                  <Wallet className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">
                  Registered with Government of India
                </p>
                <div className="flex gap-2 items-center justify-center">
                  <Landmark className="w-6 h-6 text-yellow-400" />
                  <span className="text-sm">MSME Registered</span>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 text-center text-slate-500 text-xs">
              <p>
                © {new Date().getFullYear()} CabNest Technologies (OPC) Private
                Limited. All rights reserved.
              </p>
              <p className="mt-2">
                Website content and logo are trademarks™ of CabNest Technologies
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CabNestLanding;
