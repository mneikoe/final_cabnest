import React, { useState } from "react";
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
      {/* Modern Glassmorphism Navigation */}
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

      {/* Animated Hero Section */}
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

      {/* Animated Features Grid */}
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

      {/* Interactive Timeline */}
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

      {/* 3D Pricing Card */}
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

      {/* Testimonial Carousel */}
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

      {/* Animated FAQ */}
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

      {/* Gradient CTA */}
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

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CabNest</h3>
              <p className="text-slate-400">Redefining campus mobility</p>
            </div>
            {/* Footer columns */}
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>© 2025 CabNest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CabNestLanding;
