import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Hotel,
  People,
  CleaningServices,
  Warning,
} from '@mui/icons-material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    roomsNeedingCleaning: 0,
    maintenanceIssues: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
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
        setStats({
          totalRooms: rooms.length,
          occupiedRooms: activeBookings,
          roomsNeedingCleaning: rooms.filter(room => room.status === 'needs_cleaning').length,
          maintenanceIssues: rooms.filter(room => room.status === 'maintenance').length,
        });
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Staff Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Rooms"
            value={stats.totalRooms}
            icon={<Hotel sx={{ color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Occupied Rooms"
            value={stats.occupiedRooms}
            icon={<People sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Needs Cleaning"
            value={stats.roomsNeedingCleaning}
            icon={<CleaningServices sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Maintenance Issues"
            value={stats.maintenanceIssues}
            icon={<Warning sx={{ color: '#d32f2f' }} />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      {/* Recent Activity Section */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No recent activity to display
        </Typography>
      </Paper>
    </Box>
  );
} 