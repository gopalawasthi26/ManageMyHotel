import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Hotel as HotelIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  CleanHands as CleanIcon,
  House as RoomIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import MaintenanceRequests from '../../pages/staff/MaintenanceRequests';

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/staff/dashboard' },
    { text: 'Room Management', icon: <HotelIcon />, path: '/staff/rooms' },
    { text: 'Booking Management', icon: <CalendarIcon />, path: '/staff/bookings' },
    { text: 'Room Status', icon: <RoomIcon />, path: '/staff/room-status' },
    { text: 'Maintenance Requests', icon: <CleanIcon />, path: '/staff/maintenance' },
    { text: 'Staff Management', icon: <GroupIcon />, path: '/staff/staff' },
    { text: 'Profile', icon: <PersonIcon />, path: '/staff/profile' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          Hotel Management
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Staff Portal
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.text}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': {
                  bgcolor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 