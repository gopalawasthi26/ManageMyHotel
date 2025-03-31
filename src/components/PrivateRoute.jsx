import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if the user is trying to access the correct section
  const path = window.location.pathname;
  if (path.startsWith("/user") && currentUser.userType !== "user") {
    return <Navigate to="/staff/dashboard" />;
  }
  if (path.startsWith("/staff") && currentUser.userType !== "staff") {
    return <Navigate to="/user/dashboard" />;
  }

  return children;
};

export default PrivateRoute; 