import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const userMenuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/user" },
    { text: "Book a Room", icon: <HotelIcon />, path: "/user/rooms" },
    { text: "Booking History", icon: <HistoryIcon />, path: "/user/bookings" },
    { text: "Profile", icon: <PersonIcon />, path: "/user/profile" },
  ];

  const staffMenuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/staff" },
    { text: "Manage Rooms", icon: <HotelIcon />, path: "/staff/rooms" },
    { text: "Manage Bookings", icon: <HistoryIcon />, path: "/staff/bookings" },
    { text: "Manage Users", icon: <PeopleIcon />, path: "/staff/users" },
    { text: "Profile", icon: <PersonIcon />, path: "/staff/profile" },
  ];

  const menuItems = currentUser?.userType === "staff" ? staffMenuItems : userMenuItems;

  const renderMenuItems = (items) => (
    <List>
      {items.map((item) => (
        <ListItem
          button
          key={item.text}
          onClick={() => navigate(item.path)}
          selected={location.pathname === item.path}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
      <ListItem button onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
          container: document.body,
        }}
        PaperProps={{
          sx: {
            width: 240,
            backgroundColor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" noWrap component="div">
            Hotel Management
          </Typography>
        </Box>
        <Divider />
        {renderMenuItems(currentUser?.userType === 'user' ? userMenuItems : staffMenuItems)}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" noWrap component="div">
            Hotel Management
          </Typography>
        </Box>
        <Divider />
        {renderMenuItems(currentUser?.userType === 'user' ? userMenuItems : staffMenuItems)}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${240}px)` },
          ml: { sm: `${240}px` },
          backgroundColor: 'background.default',
        }}
      >
        {/* Top Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${240}px)` },
            ml: { sm: `${240}px` },
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {currentUser?.userType === 'user' ? 'Guest Dashboard' : 'Staff Dashboard'}
            </Typography>
            <IconButton
              onClick={handleMenuOpen}
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              id="account-menu"
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                },
              }}
            >
              <MenuItem onClick={() => {
                handleMenuClose();
                navigate(currentUser?.userType === 'user' ? '/user/profile' : '/staff/profile');
              }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Toolbar /> {/* Spacer for fixed AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 