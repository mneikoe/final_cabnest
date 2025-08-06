import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if google accounts script is loaded
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // env variable me aapka client id hona chahiye
        callback: async (response) => {
          try {
            await googleLogin(response.credential);
            navigate("/student/dashboard");
          } catch (error) {
            alert("Google login failed");
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInBtn"),
        {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          position: "center",
        }
      );

      // Optional: prompt Google One Tap (comment out if not needed)
      // window.google.accounts.id.prompt();
    } else {
      console.error("Google script not loaded");
    }
  }, [googleLogin, navigate]);

  return <div id="googleSignInBtn"></div>;
};

export default GoogleLoginButton;
