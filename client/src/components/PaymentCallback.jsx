import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentCallback = () => {
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing your payment...");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get query parameters from URL
        const params = new URLSearchParams(location.search);
        const orderId = params.get("order_id");
        const planId = params.get("plan_id");

        if (!orderId) {
          setStatus("failed");
          setMessage("Missing order information");
          return;
        }

        // Verify payment with backend
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/payments/verify?order_id=${orderId}&plan_id=${planId}`
        );

        // Based on verification result, set status
        setStatus("success");
        setMessage("Payment successful! Your rides have been added.");

        // Redirect after short delay
        setTimeout(() => {
          navigate("/book-ride?payment_status=success");
        }, 2000);
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setMessage("Payment verification failed. Please contact support.");

        // Redirect after short delay
        setTimeout(() => {
          navigate("/book-ride?payment_status=failed");
        }, 2000);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="mb-6">
          {status === "processing" && (
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto"></div>
          )}
          {status === "success" && (
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {status === "failed" && (
            <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2">
          {status === "processing" && "Processing Payment"}
          {status === "success" && "Payment Successful"}
          {status === "failed" && "Payment Failed"}
        </h2>

        <p className="text-gray-600 mb-6">{message}</p>

        {status !== "processing" && (
          <button
            onClick={() => navigate("/book-ride")}
            className="rounded-full px-6 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            Return to Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
