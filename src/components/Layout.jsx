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
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  CleaningServices as CleaningServicesIcon,
  Build as BuildIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import ChatBot from "./ChatBot";

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

  const getMenuItems = () => {
    const userType = currentUser?.userType || 'user';
    if (userType === 'staff') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/staff' },
        { text: 'Room Management', icon: <HotelIcon />, path: '/staff/rooms' },
        { text: 'Room Status', icon: <CleaningServicesIcon />, path: '/staff/room-status' },
        { text: 'Maintenance', icon: <BuildIcon />, path: '/staff/maintenance' },
        { text: 'Booking Management', icon: <HistoryIcon />, path: '/staff/bookings' },
        { text: 'Profile', icon: <PersonIcon />, path: '/staff/profile' },
      ];
    } else {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/user/dashboard' },
        { text: 'Rooms', icon: <HotelIcon />, path: '/user/rooms' },
        { text: 'My Bookings', icon: <HistoryIcon />, path: '/user/bookings' },
        { text: 'Profile', icon: <PersonIcon />, path: '/user/profile' },
      ];
    }
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          {currentUser?.userType === 'staff' ? 'Staff Portal' : 'Guest Portal'}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (mobileOpen) {
                setMobileOpen(false);
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
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
            Hotel Management System
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            sx={{ p: 0 }}
          >
            <Avatar
              alt={currentUser?.name || 'User'}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate(currentUser?.userType === 'staff' ? '/staff/profile' : '/user/profile'); }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate(currentUser?.userType === 'staff' ? '/staff/settings' : '/user/settings'); }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {mobileOpen ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Toolbar />
        {children}
      </Box>
      <ChatBot />
    </Box>
  );
};

export default Layout;
