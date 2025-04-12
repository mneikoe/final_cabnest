import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const PaymentHandler = () => {
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Parse the query parameters from the URL
        const queryParams = new URLSearchParams(location.search);
        const orderId = queryParams.get("order_id");
        const planId = queryParams.get("plan_id");

        if (!orderId) {
          throw new Error("Order ID not found in the response");
        }

        // Clear the pending payment from localStorage
        localStorage.removeItem("pendingPayment");

        // Get the authentication token
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Call your backend to verify the payment
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/payments/verify`,
          {
            params: {
              order_id: orderId,
              plan_id: planId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Based on the response, navigate to success or failure page
        if (response.data && response.data.success) {
          navigate("/payment-success");
        } else {
          navigate("/payment-failed");
        }
      } catch (err) {
        setError(err.message || "Payment verification failed");
        console.error("Payment verification error:", err);
        navigate("/payment-failed", {
          state: {
            error: err.response?.data?.message || err.message,
          },
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [navigate, location.search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {verifying ? (
        <>
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Verifying your payment...</p>
        </>
      ) : error ? (
        <div className="text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={() => navigate("/student/plans")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Return to Plans
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default PaymentHandler;
