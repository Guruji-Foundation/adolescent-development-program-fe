// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import Services from "../common/ServiCeProvider/Services";

// Create context for authentication
const AuthContext = createContext();

// Custom hook to access the authentication state
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider to wrap your app and provide the authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Load the user from localStorage or API when the app mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile();
    }
  }, []);

  const getProfile = async () => {
    try {
      const res = await Services.getProfile();
      const profile = res;
      // const profile = {
      //   role: res?.data?.role,
      //   name: res?.data?.name,
      //   email: res?.data?.email,
      // };
      setUser(profile);
      return profile; // Return the profile for immediate use
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUser(null); // Ensure the user is cleared if fetching fails
      throw new Error("Failed to fetch user profile.");
    }
  };

  const login = async (userToken) => {
    try {
      console.log(userToken);
      localStorage.setItem("token", userToken); // Store token

      const profile = await getProfile(); // Wait for profile to load
      console.log(profile);
      return profile; // Return profile after successful login
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed. Please try again.");
    }
  };

  // Logout function to clear the user and token
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
