import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import StaffLayout from "./components/StaffLayout";
import StaffManagement from './pages/staff/StaffManagement';
import Billing from './pages/staff/Billing';

// Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import UserDashboard from "./pages/user/Dashboard";
import RoomList from "./pages/user/RoomList";
import BookingHistory from "./pages/user/BookingHistory";
import UserProfile from "./pages/user/UserProfile";
import StaffDashboard from "./pages/staff/Dashboard";
import ManageRooms from "./pages/staff/RoomManagement";
import BookingManagement from "./pages/staff/ManageBookings";
import StaffProfile from "./pages/staff/StaffProfile";
import RoomStatusOverview from "./pages/staff/RoomStatusOverview";
import MaintenanceRequests from "./pages/staff/MaintenanceRequests";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

// Create theme with default props for modal components
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPopover: {
      defaultProps: {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      },
    },
    MuiDialog: {
      defaultProps: {
        maxWidth: 'sm',
        fullWidth: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '&.chatbot-paper': {
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />

              {/* User Routes */}
              <Route
                path="/user/*"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/rooms" element={<RoomList />} />
                        <Route path="/bookings" element={<BookingHistory />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
                      </Routes>
                    </Layout>
                  </PrivateRoute>
                }
              />

              {/* Staff Routes */}
              <Route
                path="/staff/*"
                element={
                  <PrivateRoute>
                    <StaffLayout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/staff/dashboard" replace />} />
                        <Route path="/dashboard" element={<StaffDashboard />} />
                        <Route path="/rooms" element={<ManageRooms />} />
                        <Route path="/bookings" element={<BookingManagement />} />
                        <Route path="/profile" element={<StaffProfile />} />
                        <Route path="/room-status" element={<RoomStatusOverview />} />
                        <Route path="/maintenance" element={<MaintenanceRequests />} />
                        <Route path="/staff" element={<StaffManagement />} />
                        <Route path="/billing" element={<Billing />} />
                        <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
                      </Routes>
                    </StaffLayout>
                  </PrivateRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
