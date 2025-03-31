import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
    } catch (error) {
      toast.error('Error fetching bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelClose = () => {
    setCancelDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleCancelBooking = async () => {
    try {
      const bookingRef = doc(db, 'bookings', selectedBooking.id);
      await updateDoc(bookingRef, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });
      
      // Update room status back to available
      const roomRef = doc(db, 'rooms', selectedBooking.roomId);
      await updateDoc(roomRef, {
        status: 'available'
      });

      toast.success('Booking cancelled successfully');
      fetchBookings();
      handleCancelClose();
    } catch (error) {
      toast.error('Error cancelling booking');
      console.error('Error cancelling booking:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'checked-in':
        return 'info';
      case 'checked-out':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Booking History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Room Type</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.roomType}</TableCell>
                <TableCell>{formatDate(booking.checkInDate)}</TableCell>
                <TableCell>{formatDate(booking.checkOutDate)}</TableCell>
                <TableCell>${booking.totalAmount}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {booking.status === 'confirmed' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleCancelClick(booking)}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    Receipt
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={cancelDialogOpen} onClose={handleCancelClose}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose}>Keep Booking</Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingHistory; 