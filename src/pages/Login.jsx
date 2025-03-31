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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Hotel as HotelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password, formData.userType);
      toast.success("Login successful!");
      navigate(formData.userType === "user" ? "/user" : "/staff");
    } catch (error) {
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        py: 3,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <HotelIcon
              sx={{
                fontSize: 48,
                color: 'primary.main',
                mb: 2,
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              }}
            />
            <Typography
              component="h1"
              variant={isMobile ? "h5" : "h4"}
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                textAlign: 'center',
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                mb: 2,
              }}
            >
              Sign in to your account
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <FormControl fullWidth margin="normal" variant="outlined">
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

            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                },
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Divider
              sx={{
                my: 3,
                '&::before, &::after': {
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  px: 2,
                }}
              >
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 1,
                }}
              >
                Don't have an account?
              </Typography>
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up now
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 