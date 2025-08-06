import { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      try {
        await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/verify-email/${token}`
        );

        // Fetch updated profile to update context
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          const profileRes = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/auth/profile`,
            {
              headers: { Authorization: `Bearer ${storedToken}` },
            }
          );
          setCurrentUser(profileRes.data); // Update context with fresh user data
        }

        setStatus("success");
        setMessage("🎉 Your email has been verified successfully!");
      } catch (err) {
        setStatus("error");
        setMessage("❌ Verification failed or link expired.");
      }
    }
    verify();
  }, [token, setCurrentUser]);

  const handleGoDashboard = () => {
    navigate("/student/dashboard");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md max-w-md w-full p-8 flex flex-col items-center text-center">
        {status === "loading" && (
          <>
            <Loader2 className="animate-spin text-blue-600 mb-6" size={48} />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Verifying your email...
            </h2>
            <p className="text-gray-500">
              Please wait a moment while we confirm your email address.
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle size={56} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              {message}
            </h2>
            <button
              onClick={handleGoDashboard}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg mt-6 transition"
            >
              Go to Dashboard
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <AlertTriangle size={56} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">{message}</h2>
            <button
              onClick={handleGoHome}
              className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg mt-6 transition"
            >
              Go to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
