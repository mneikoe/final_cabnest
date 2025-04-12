import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

const PaymentResult = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const isSuccess = status === "success";

  useEffect(() => {
    // Redirect to booking page after a few seconds
    const timer = setTimeout(() => {
      navigate("/book-ride");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        {isSuccess ? (
          <div className="text-green-600 mx-auto mb-6">
            <CheckCircle size={64} strokeWidth={1.5} className="mx-auto" />
          </div>
        ) : (
          <div className="text-red-600 mx-auto mb-6">
            <XCircle size={64} strokeWidth={1.5} className="mx-auto" />
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">
          {isSuccess ? "Payment Successful!" : "Payment Failed"}
        </h1>

        <p className="text-gray-600 mb-8">
          {isSuccess
            ? "Your payment was successful and your rides have been added to your account."
            : "Your payment could not be processed. Please try again or contact support if the issue persists."}
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate("/book-ride")}
            className="rounded-full bg-red-600 text-white py-2 px-6 font-medium hover:bg-red-700 transition-colors"
          >
            Return to Booking
          </button>

          {!isSuccess && (
            <button
              onClick={() => navigate("/contact")}
              className="text-red-600 hover:underline"
            >
              Contact Support
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
