import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, ArrowLeft, CreditCard, Clock } from "lucide-react";

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Payment recovery logic
    const recoverPendingPayment = () => {
      const pendingPayment = localStorage.getItem("pendingPayment");
      if (pendingPayment) {
        const { paymentSessionId, timestamp } = JSON.parse(pendingPayment);
        const expiryTime = 30 * 60 * 1000; // 30 minutes

        if (Date.now() - timestamp < expiryTime) {
          window.location.href = `https://payments-test.cashfree.com/order/#/${paymentSessionId}`;
        } else {
          localStorage.removeItem("pendingPayment");
        }
      }
    };

    const fetchPlanDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/students/subs-plans/${planId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPlan(res.data);
        recoverPendingPayment();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load plan details");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId]);

  const initiatePayment = async () => {
    try {
      setInitiatingPayment(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/payments/initiate-plan-payment`,
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Store critical payment session data
        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            paymentSessionId: response.data.payment_session_id,
            planId,
            timestamp: Date.now(),
          })
        );

        // Validate payment URL format
        if (!response.data.paymentUrl.includes("payment_session_id")) {
          throw new Error("Invalid payment URL format received from server");
        }

        // Redirect to Cashfree payment page
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error(response.data.message || "Payment initiation failed");
      }
    } catch (err) {
      let errorMessage = err.response?.data?.error?.message || err.message;

      // Handle specific Cashfree errors
      if (errorMessage.includes("order_id")) {
        errorMessage = "Invalid order configuration. Please try again.";
      }

      setError(errorMessage);
      localStorage.removeItem("pendingPayment");
    } finally {
      setInitiatingPayment(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Payment Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/student/plans")}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
            >
              Back to Plans
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Plan not found state
  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Plan Not Found
          </h2>
          <button
            onClick={() => navigate("/student/plans")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  // Main checkout UI
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/student/plans")}
          className="flex items-center text-blue-600 hover:underline mb-8"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to plans
        </button>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

          {/* Order Summary */}
          <div className="mb-8 border-b pb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Description:</span>
                <span className="text-right">{plan.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rides Included:</span>
                <span>{plan.rideCount || plan.rides}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-blue-700">₹{plan.price}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Payment Security
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CreditCard className="text-blue-600 mr-3" />
                <span className="font-medium">Secure Card Processing</span>
              </div>
              <p className="text-sm text-gray-500">
                Your payment is securely processed by Cashfree. We never store
                your card details.
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={initiatePayment}
            disabled={initiatingPayment}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initiatingPayment ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" /> Processing Payment...
              </span>
            ) : (
              `Pay ₹${plan.price}`
            )}
          </button>

          {/* Security Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <Clock className="inline-block mr-1" size={14} />
            <span>Your payment session will expire in 30 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
