import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/profile`,
        config
      );
      setCurrentUser(response.data);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("token");
      setError("Session expired. Please login again.");
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
        userData
      );

      localStorage.setItem("token", response.data.token);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };
  const updateUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/students/me`,
        config
      );

      setCurrentUser(data);
      return true;
    } catch (error) {
      console.error("Error updating user data:", error);
      return false;
    }
  };
  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    error,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
