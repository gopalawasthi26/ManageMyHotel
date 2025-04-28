import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user is trying to access the correct section
  const path = location.pathname;
  const userType = currentUser.userType || 'user';

  // If user is trying to access staff routes but is not staff
  if (path.startsWith("/staff") && userType !== "staff") {
    // Redirect to user dashboard if they're a guest
    return <Navigate to="/user/dashboard" replace />;
  }

  // If user is trying to access user routes but is staff
  if (path.startsWith("/user") && userType === "staff") {
    // Redirect to staff dashboard if they're staff
    return <Navigate to="/staff" replace />;
  }

  return children;
};

export default PrivateRoute; 