import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Bus images array
const busImages = [
  "/busImg4.webp", 
  "/img5.png",
  "/busImg3.jpg",
  "/busImg1.jpg",
  "/busImg2.jpg"
];

export default function HeroWithBackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-slide functionality with cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % busImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to handle manual slide change
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  
  return (
    <section className="relative min-h-[650px] md:min-h-[700px] lg:h-screen overflow-hidden">
      {/* Background slider */}
      <div className="absolute inset-0 z-0">
        {busImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 w-full h-full transition-opacity duration-1500 ease-in-out"
            style={{ opacity: currentIndex === index ? 1 : 0 }}
          >
            <img
              src={img}
              alt={`Premium campus bus service ${index + 1}`}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Enhanced overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40" />
          </div>
        ))}
      </div>
      
      {/* Dots indicator - improved positioning */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2.5 z-20">
        {busImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full transition-all ${
              currentIndex === index ? "bg-red-400 w-5 md:w-8" : "bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`View slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
  <div className="w-full flex flex-col items-center lg:items-start justify-center py-12 md:py-16">
    
    {/* Hero Text */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-3xl mt-10 text-center lg:text-left text-white"
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-5 md:mb-8 tracking-tight">
        Rush Free & Premium
        <span className="block bg-gradient-to-r from-red-400 to-red-200 bg-clip-text text-transparent mt-3 lg:ml-10">
          Campus Commutes
        </span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-10 max-w-xl mx-auto lg:mx-0">
        Experience premium AC transport with AI-powered scheduling. <strong>44 rides/month</strong>, 
        <span className="hidden md:inline"> your timetable, your rules.</span>
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-4 items-center lg:items-start">
        <motion.button
          whileHover={{
            y: -3,
            boxShadow: "0 12px 30px -6px rgba(239, 68, 68, 0.5)"
          }}
          transition={{ type: "spring", stiffness: 500 }}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-400 text-white rounded-2xl font-semibold shadow-lg transition-all text-base"
        >
          🚀 Start Free Trial
        </motion.button>

        <motion.button
          whileHover={{
            y: -3,
            backgroundColor: "rgba(255, 255, 255, 0.08)"
          }}
          transition={{ type: "spring", stiffness: 500 }}
          className="px-6 sm:px-8 py-3 sm:py-4 border border-white/40 text-white rounded-2xl font-semibold hover:bg-white/10 backdrop-blur-md transition-all text-base"
        >
          ▶️ Watch Video Tour
        </motion.button>
      </div>
    </motion.div>

    {/* Features List */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="flex flex-wrap justify-center lg:justify-start gap-4 mt-14"
    >
      {[
        { icon: "🚌", text: "Premium AC Buses" },
        { icon: "⚡", text: "USB Charging" },
        { icon: "📱", text: "Tracking" },
        { icon: "🔒", text: "Safe & Secure" }
      ].map((feature, index) => (
        <div 
          key={index}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-200"
        >
          <span className="text-xl">{feature.icon}</span>
          <span className="text-sm font-medium text-white">{feature.text}</span>
        </div>
      ))}
    </motion.div>
  </div>
</div>

    </section>
  );
}