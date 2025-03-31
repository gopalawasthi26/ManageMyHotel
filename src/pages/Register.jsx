import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
  Grid,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Hotel as HotelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const steps = ["Account Type", "Personal Info", "Create Account"];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.userType) {
        toast.error("Please select an account type");
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        toast.error("Please fill in all fields");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      if (!/^\d{10}$/.test(formData.phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.userType);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Account Type</InputLabel>
            <Select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              label="Account Type"
              startAdornment={
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              }
            >
              <MenuItem value="user">Guest</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
          </FormControl>
        );

      case 1:
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 2,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <HotelIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography component="h1" variant="h4" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Join our hotel management system
          </Typography>

          <Stepper activeStep={activeStep} sx={{ width: "100%", mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                    },
                  }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                    },
                  }}
                >
                  Next
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Already have an account?
              </Typography>
              <Link
                component={RouterLink}
                to="/login"
                variant="body1"
                sx={{
                  textDecoration: "none",
                  color: "primary.main",
                  fontWeight: 600,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign in instead
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 