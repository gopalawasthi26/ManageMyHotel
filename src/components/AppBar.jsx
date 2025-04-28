import React, { useState, useEffect } from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Fade,
  useScrollTrigger,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Menu as MenuIcon,
  Person,
  Settings,
  Help,
  Info,
  Hotel,
  Restaurant,
  LocalActivity,
  Spa,
  Pool,
  FitnessCenter,
  BeachAccess,
  Casino,
  LocalParking,
  Wifi,
  Star,
  LocationOn,
  Phone,
  Email,
  Logout,
  LocalOffer,
  ContactSupport,
  AccessTime,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const StyledAppBar = styled(MuiAppBar)`
  background: ${({ istransparent }) =>
    istransparent === "true"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(255, 255, 255, 0.95)"};
  backdrop-filter: blur(10px);
  box-shadow: ${({ istransparent }) =>
    istransparent === "true"
      ? "none"
      : "0 2px 4px rgba(0, 0, 0, 0.1)"};
  transition: all 0.3s ease;
  border-bottom: ${({ istransparent }) =>
    istransparent === "true"
      ? "none"
      : "1px solid rgba(0, 0, 0, 0.1)"};
`;

const Logo = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 700,
  cursor: "pointer",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const NavButton = styled(Button)(({ theme, istransparent }) => ({
  color: istransparent === "true" ? "#fff" : "#000",
  margin: "0 8px",
  position: "relative",
  fontWeight: 700,
  "&::after": {
    content: '""',
    position: "absolute",
    width: "0",
    height: "2px",
    bottom: "0",
    left: "50%",
    backgroundColor: istransparent === "true" ? "#fff" : "#000",
    transition: "all 0.3s ease",
    transform: "translateX(-50%)",
  },
  "&:hover::after": {
    width: "100%",
  },
  "&:hover": {
    color: istransparent === "true" ? "#fff" : "#000",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  cursor: "pointer",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const AppBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const isWelcomePage = location.pathname === "/";
  const isTransparent = isWelcomePage && !trigger;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const menuItems = [
    { text: "About", icon: <Info />, path: "/about" },
    { text: "Services", icon: <LocalOffer />, path: "/services" },
    { text: "Contact", icon: <ContactSupport />, path: "/contact" },
  ];

  const services = [
    {
      title: "Luxury Rooms",
      description: "Experience ultimate comfort in our premium accommodations",
      icon: "🏠",
    },
    {
      title: "Fine Dining",
      description: "Savor exquisite cuisine at our world-class restaurants",
      icon: "🍽️",
    },
    {
      title: "Spa & Wellness",
      description: "Rejuvenate your senses with our luxury spa treatments",
      icon: "💆",
    },
    {
      title: "Event Venues",
      description: "Host memorable events in our elegant spaces",
      icon: "🎉",
    },
  ];

  const contactInfo = [
    {
      icon: <LocationOn />,
      title: "Address",
      content: "123 Luxury Street, City, Country",
      description: "Find us in the heart of the city",
    },
    {
      icon: <Phone />,
      title: "Phone",
      content: "+1 234 567 890",
      description: "24/7 customer support",
    },
    {
      icon: <Email />,
      title: "Email",
      content: "info@luxuryhotel.com",
      description: "Get in touch with us",
    },
    {
      icon: <AccessTime />,
      title: "Working Hours",
      content: "24/7",
      description: "Always at your service",
    },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Logo onClick={() => navigate("/")}>
          LUXURY HOTEL
        </Logo>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText
            primary="Contact Us"
            secondary="Get in touch with our team"
          />
        </ListItem>
        {contactInfo.map((info) => (
          <ListItem key={info.title}>
            <ListItemIcon>{info.icon}</ListItemIcon>
            <ListItemText
              primary={info.title}
              secondary={info.content}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar
        position="fixed"
        istransparent={isTransparent.toString()}
        elevation={isTransparent ? 0 : 4}
      >
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                color={isTransparent ? "default" : "inherit"}
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Logo
              variant="h6"
              component="div"
              sx={{ flexGrow: 0, display: { xs: "none", md: "flex" }, mr: 2 }}
              onClick={() => navigate("/")}
            >
              Manage My Hotel
            </Logo>

            {isMobile ? (
              <Logo
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
                onClick={() => navigate("/")}
              >
                MMH
              </Logo>
            ) : (
              <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                {menuItems.map((item) => (
                  <NavButton
                    key={item.text}
                    onClick={() => navigate(item.path)}
                    istransparent={isTransparent.toString()}
                  >
                    {item.text}
                  </NavButton>
                ))}
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center" }}>
              {user ? (
                <>
                  <Tooltip title="Account settings" TransitionComponent={Fade}>
                    <StyledAvatar
                      onClick={handleProfileMenuOpen}
                      src={user.photoURL}
                      alt={user.displayName}
                    >
                      {user.displayName?.[0] || <Person />}
                    </StyledAvatar>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        borderRadius: 2,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <MenuItem onClick={() => navigate("/profile")}>
                      <Person sx={{ mr: 1 }} /> Profile
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/settings")}>
                      <Settings sx={{ mr: 1 }} /> Settings
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/help")}>
                      <Help sx={{ mr: 1 }} /> Help
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <Logout sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <NavButton
                  onClick={() => navigate("/login")}
                  istransparent={isTransparent.toString()}
                >
                  Login
                </NavButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default AppBar; 