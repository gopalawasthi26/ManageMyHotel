import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

// Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/Dashboard";
import RoomList from "./pages/user/RoomList";
import BookingHistory from "./pages/user/BookingHistory";
import UserProfile from "./pages/user/UserProfile";
import StaffDashboard from "./pages/staff/Dashboard";
import RoomManagement from "./pages/staff/RoomManagement";
import BookingManagement from "./pages/staff/BookingManagement";
import StaffProfile from "./pages/staff/StaffProfile";

// Create theme with default props for modal components
const theme = createTheme({
  components: {
    MuiPopover: {
      defaultProps: {
        container: document.body,
        slotProps: {
          paper: {
            sx: {
              overflow: 'visible',
            },
          },
        },
      },
    },
    MuiPopper: {
      defaultProps: {
        container: document.body,
      },
    },
    MuiDialog: {
      defaultProps: {
        container: document.body,
        slotProps: {
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      },
    },
    MuiModal: {
      defaultProps: {
        container: document.body,
        slotProps: {
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
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
              <Route path="/register" element={<Register />} />

              {/* User Routes */}
              <Route
                path="/user/*"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<UserDashboard />} />
                        <Route path="/rooms" element={<RoomList />} />
                        <Route path="/bookings" element={<BookingHistory />} />
                        <Route path="/profile" element={<UserProfile />} />
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
                    <Layout>
                      <Routes>
                        <Route path="/" element={<StaffDashboard />} />
                        <Route path="/rooms" element={<RoomManagement />} />
                        <Route path="/bookings" element={<BookingManagement />} />
                        <Route path="/profile" element={<StaffProfile />} />
                      </Routes>
                    </Layout>
                  </PrivateRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
