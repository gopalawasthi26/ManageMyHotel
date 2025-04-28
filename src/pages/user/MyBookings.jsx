import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Grid, Chip, Button } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { writeBatch, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const bookingsQuery = query(collection(db, 'bookings'));
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsData = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      // Start a batch write to ensure atomic updates
      const batch = writeBatch(db);

      // Update booking status
      const bookingRef = doc(db, 'bookings', booking.id);
      batch.update(bookingRef, {
        status: 'cancelled',
        lastUpdated: new Date().toISOString()
      });

      // Update room status if the room exists
      const roomsQuery = query(collection(db, 'rooms'), where('roomNumber', '==', booking.roomNumber));
      const roomsSnapshot = await getDocs(roomsQuery);
      
      if (!roomsSnapshot.empty) {
        const roomDoc = roomsSnapshot.docs[0];
        const roomData = roomDoc.data();

        // Only update room status if it's currently booked for this booking
        if (roomData.currentBooking === booking.id) {
          batch.update(doc(db, 'rooms', roomDoc.id), {
            status: 'available',
            currentBooking: null,
            lastUpdated: new Date().toISOString()
          });
        }
      }

      // Commit the batch
      await batch.commit();

      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bookings
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : bookings.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No bookings found
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booking) => (
              <Grid item xs={12} key={booking.id}>
                <Paper sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <img
                        src={booking.roomImage || 'https://placehold.co/300x200'}
                        alt={`Room ${booking.roomNumber}`}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {booking.roomType} Room
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Room {booking.roomNumber}
                          </Typography>
                        </Box>
                        <Chip
                          label={booking.status}
                          color={
                            booking.status === 'confirmed' ? 'success' :
                            booking.status === 'pending' ? 'warning' :
                            booking.status === 'cancelled' ? 'error' : 'default'
                          }
                        />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Check-in: {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Check-out: {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Guests: {booking.numberOfGuests}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Amount: ₹{booking.totalAmount}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        {booking.status === 'pending' && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleCancelBooking(booking)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleCancelBooking(booking)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default MyBookings; 