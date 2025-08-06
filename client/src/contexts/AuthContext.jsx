import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, try to fetch user profile if token available
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCurrentUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setCurrentUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        { email, password }
      );
      localStorage.setItem("token", data.token);

      // Fetch fresh profile after login
      const profileRes = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${data.token}` },
        }
      );

      setCurrentUser(profileRes.data);
      return profileRes.data;
    } catch (err) {
      throw err.response?.data?.message || "Login failed";
    }
  };

  // Google login function
  const googleLogin = async (tokenId) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/google-login`,
        { tokenId }
      );
      localStorage.setItem("token", data.token);

      // Fetch fresh profile
      const profileRes = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${data.token}` },
        }
      );

      setCurrentUser(profileRes.data);

      return profileRes.data;
    } catch (err) {
      throw err.response?.data?.message || "Google login failed";
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        userData
      );
      localStorage.setItem("token", data.token);

      // Fetch fresh profile after register
      const profileRes = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${data.token}` },
        }
      );

      setCurrentUser(profileRes.data);
      return profileRes.data;
    } catch (err) {
      throw err.response?.data?.message || "Registration failed";
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        googleLogin,
        register,
        logout,
        loading,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
