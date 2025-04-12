import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Zap, Shield, MessageCircle } from "lucide-react";
const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/students/subs-plans`,
          config
        );
        setPlans(res.data);
      } catch (err) {
        setError("❌ Failed to load plans. Please try again.");
        console.error(err);
      }
    };

    fetchPlans();
  }, []);

  const handleWhatsAppRedirect = (plan) => {
    const phoneNumber = "919065139977"; // Replace with your WhatsApp number
    const message = `Hi! I want to purchase the ${plan.name} (${plan.rides} rides) for ₹${plan.price}. Please guide me through the payment process.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Flexible Ride Plans
            </span>
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center bg-green-50 px-4 py-2 rounded-full">
              <MessageCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-700">
                Secure WhatsApp Payments
              </span>
            </div>
            <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-700">
                100% Payment Protection
              </span>
            </div>
          </div>
        </div>

        {/* Payment Assurance Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Instant Activation
                </h3>
                <p className="text-gray-600">
                  Get your plan activated immediately after WhatsApp
                  confirmation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Safe & Secure Process
                </h3>
                <p className="text-gray-600">
                  Official payment receipt provided for every transaction
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Loading available plans...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="bg-blue-100 px-3 py-1 rounded-full text-sm font-medium text-blue-700">
                      {plan.rides} Rides
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-blue-600">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-500 ml-2">/month</span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">{plan.description}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">
                        Instant WhatsApp Confirmation
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">
                        Dedicated Support Manager
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleWhatsAppRedirect(plan)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact via WhatsApp
                  </button>
                </div>

                {/* Plan Footer */}
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>7-day money back guarantee</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Process Info */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "1. Select Plan",
                description: "Choose your preferred ride package",
                icon: "📦",
              },
              {
                title: "2. WhatsApp Payment",
                description: "Secure transaction via WhatsApp chat",
                icon: "💬",
              },
              {
                title: "3. Instant Activation",
                description: "Rides activated immediately after payment",
                icon: "⚡",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
