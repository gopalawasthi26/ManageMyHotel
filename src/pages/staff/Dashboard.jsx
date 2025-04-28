import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {
  Hotel,
  People,
  CleaningServices,
  Warning,
  TrendingUp,
  CalendarToday,
  Notifications,
  Refresh,
} from '@mui/icons-material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

export default function StaffDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    roomsNeedingCleaning: 0,
    maintenanceIssues: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch rooms data
      const roomsQuery = query(collection(db, 'rooms'));
      const roomsSnapshot = await getDocs(roomsQuery);
      const rooms = roomsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch bookings data
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('status', '==', 'active')
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const activeBookings = bookingsSnapshot.docs.length;

      // Calculate statistics
      const totalRooms = rooms.length;
      const occupancyRate = totalRooms > 0 ? (activeBookings / totalRooms) * 100 : 0;

      setStats({
        totalRooms,
        occupiedRooms: activeBookings,
        roomsNeedingCleaning: rooms.filter(room => room.status === 'needs_cleaning').length,
        maintenanceIssues: rooms.filter(room => room.status === 'maintenance').length,
        occupancyRate,
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Staff Dashboard
        </Typography>
        <Box>
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchDashboardData} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(135deg, #1976d2 30%, #2196f3 90%)",
              color: "white",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(25, 118, 210, 0.2)",
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: "0 6px 24px rgba(25, 118, 210, 0.3)",
              }
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Hotel Management Overview
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Monitor and manage hotel operations efficiently
            </Typography>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #1976d210 0%, #1976d205 100%)',
              border: '1px solid #1976d220',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#1976d220',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Hotel sx={{ color: '#1976d2' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                    Total Rooms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available for booking
                  </Typography>
                </Box>
              </Box>
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#1976d2' }} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  {stats.totalRooms}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #2e7d3210 0%, #2e7d3205 100%)',
              border: '1px solid #2e7d3220',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#2e7d3220',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <People sx={{ color: '#2e7d32' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                    Occupied Rooms
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Currently in use
                  </Typography>
                </Box>
              </Box>
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#2e7d32' }} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                  {stats.occupiedRooms}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #ed6c0210 0%, #ed6c0205 100%)',
              border: '1px solid #ed6c0220',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#ed6c0220',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CleaningServices sx={{ color: '#ed6c02' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#ed6c02', fontWeight: 600 }}>
                    Needs Cleaning
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending housekeeping
                  </Typography>
                </Box>
              </Box>
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#ed6c02' }} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02' }}>
                  {stats.roomsNeedingCleaning}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #d32f2f10 0%, #d32f2f05 100%)',
              border: '1px solid #d32f2f20',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#d32f2f20',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Warning sx={{ color: '#d32f2f' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                    Maintenance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Requires attention
                  </Typography>
                </Box>
              </Box>
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#d32f2f' }} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                  {stats.maintenanceIssues}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Occupancy Rate Card */}
        <Grid item xs={12}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #1976d210 0%, #1976d205 100%)',
              border: '1px solid #1976d220',
              borderRadius: 2,
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                Occupancy Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ color: '#1976d2', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                  {stats.occupancyRate.toFixed(1)}%
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stats.occupancyRate}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: '#1976d220',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  backgroundColor: '#1976d2',
                },
              }}
            />
          </Card>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #2e7d3210 0%, #2e7d3205 100%)',
              border: '1px solid #2e7d3220',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ color: '#2e7d32', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                  Today's Schedule
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                No upcoming tasks for today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #ed6c0210 0%, #ed6c0205 100%)',
              border: '1px solid #ed6c0220',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CleaningServices sx={{ color: '#ed6c02', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#ed6c02', fontWeight: 600 }}>
                  Quick Actions
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                No pending actions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 