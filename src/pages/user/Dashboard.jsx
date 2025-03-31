import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Hotel as HotelIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
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

    fetchBookings();
  }, [currentUser.uid]);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              color: "white",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Welcome back, {currentUser?.displayName || "Guest"}!
            </Typography>
            <Typography variant="subtitle1">
              Here's what's happening with your bookings
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Upcoming Bookings
              </Typography>
              <Typography variant="h3">{upcomingBookings.length}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h3">{bookings.length}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View History
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed Stays
              </Typography>
              <Typography variant="h3">
                {bookings.filter((b) => b.status === "checked-out").length}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>
            <List>
              {recentBookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  <ListItem>
                    <ListItemIcon>
                      <HotelIcon />
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
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <HotelIcon />
                </ListItemIcon>
                <ListItemText primary="Book a Room" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="View Calendar" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Update Profile" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <PaymentIcon />
                </ListItemIcon>
                <ListItemText primary="Payment History" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText primary="Leave a Review" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDashboard; 