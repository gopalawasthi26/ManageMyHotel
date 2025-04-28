import React, { useState, useEffect, forwardRef } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {
  Hotel as HotelIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  Notifications,
  Refresh,
  TrendingUp,
  CalendarToday,
} from "@mui/icons-material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";
import { motion } from "framer-motion";

const MotionCard = forwardRef((props, ref) => {
  const { children, ...otherProps } = props;
  return (
    <motion.div ref={ref} {...otherProps}>
      <Card {...otherProps}>
        {children}
      </Card>
    </motion.div>
  );
});

MotionCard.displayName = 'MotionCard';

const UserDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [currentUser.uid]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "checked-in":
        return "info";
      case "checked-out":
        return "default";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed" &&
      new Date(booking.checkInDate) > new Date()
  );

  const recentBookings = bookings
    .sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate))
    .slice(0, 3);

  const completedBookings = bookings.filter((b) => b.status === "checked-out").length;
  const totalBookings = bookings.length;
  const bookingCompletionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome back, {currentUser?.displayName || "Guest"}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's what's happening with your bookings
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchBookings} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton color="primary">
              <Notifications />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <MotionCard
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(135deg, #2196F3 30%, #21CBF3 90%)",
              color: "white",
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(33, 150, 243, 0.2)",
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Your Hotel Experience
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Manage your bookings and explore our services
            </Typography>
          </MotionCard>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <MotionCard
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #2196F310 0%, #2196F305 100%)',
              border: '1px solid #2196F320',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#2196F320',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EventIcon sx={{ color: '#2196F3' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 600 }}>
                    Upcoming Bookings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Next stays planned
                  </Typography>
                </Box>
              </Box>
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#2196F3' }} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>
                  {upcomingBookings.length}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View All
              </Button>
            </CardActions>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #4CAF5010 0%, #4CAF5005 100%)',
              border: '1px solid #4CAF5020',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#4CAF5020',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HotelIcon sx={{ color: '#4CAF50' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                    Total Bookings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All-time stays
                  </Typography>
                </Box>
              </Box>
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#4CAF50' }} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                  {bookings.length}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View History
              </Button>
            </CardActions>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #FF980010 0%, #FF980005 100%)',
              border: '1px solid #FF980020',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: '#FF980020',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <StarIcon sx={{ color: '#FF9800' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#FF9800', fontWeight: 600 }}>
                    Completed Stays
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Past experiences
                  </Typography>
                </Box>
              </Box>
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#FF9800' }} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>
                  {completedBookings}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
            </CardActions>
          </MotionCard>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={8}>
          <MotionCard
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #2196F310 0%, #2196F305 100%)',
              border: '1px solid #2196F320',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ color: '#2196F3', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 600 }}>
                  Recent Bookings
                </Typography>
              </Box>
              <List>
                {recentBookings.map((booking) => (
                  <React.Fragment key={booking.id}>
                    <ListItem>
                      <ListItemIcon>
                        <HotelIcon sx={{ color: '#2196F3' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Room ${booking.roomNumber} - ${booking.roomType}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              Check-in: {format(new Date(booking.checkInDate), "MMM dd, yyyy")}
                            </Typography>
                            {" — "}
                            <Typography component="span" variant="body2">
                              Check-out: {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
                            </Typography>
                          </>
                        }
                      />
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <MotionCard
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #4CAF5010 0%, #4CAF5005 100%)',
              border: '1px solid #4CAF5020',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon sx={{ color: '#4CAF50', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                  Quick Actions
                </Typography>
              </Box>
              <List>
                <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <HotelIcon sx={{ color: '#4CAF50' }} />
                  </ListItemIcon>
                  <ListItemText primary="Book a Room" />
                </ListItem>
                <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <EventIcon sx={{ color: '#4CAF50' }} />
                  </ListItemIcon>
                  <ListItemText primary="View Calendar" />
                </ListItem>
                <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <PersonIcon sx={{ color: '#4CAF50' }} />
                  </ListItemIcon>
                  <ListItemText primary="Update Profile" />
                </ListItem>
                <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <PaymentIcon sx={{ color: '#4CAF50' }} />
                  </ListItemIcon>
                  <ListItemText primary="Payment History" />
                </ListItem>
                <ListItem button sx={{ borderRadius: 1 }}>
                  <ListItemIcon>
                    <StarIcon sx={{ color: '#4CAF50' }} />
                  </ListItemIcon>
                  <ListItemText primary="Leave a Review" />
                </ListItem>
              </List>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard; 