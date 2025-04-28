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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
} from '@mui/material';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Billing = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    paymentMethod: '',
    transactionId: '',
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('paymentStatus', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      
      const bookingsData = querySnapshot.docs.map(doc => ({
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

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setPaymentDetails({
      amount: booking.totalAmount.toString(),
      paymentMethod: '',
      transactionId: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedBooking(null);
    setOpenDialog(false);
    setPaymentDetails({
      amount: '',
      paymentMethod: '',
      transactionId: '',
    });
  };

  const handlePaymentUpdate = async () => {
    try {
      if (!selectedBooking) return;

      const bookingRef = doc(db, 'bookings', selectedBooking.id);
      await updateDoc(bookingRef, {
        paymentStatus: 'completed',
        paymentMethod: paymentDetails.paymentMethod,
        transactionId: paymentDetails.transactionId,
        updatedAt: new Date().toISOString(),
      });

      toast.success('Payment updated successfully');
      handleCloseDialog();
      fetchBookings();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Billing Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Guest Name</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.guestName}</TableCell>
                <TableCell>{booking.roomNumber}</TableCell>
                <TableCell>₹{booking.totalAmount}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.paymentStatus}
                    color={booking.paymentStatus === 'completed' ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenDialog(booking)}
                    disabled={booking.paymentStatus === 'completed'}
                  >
                    Update Payment
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Payment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                value={paymentDetails.amount}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Method"
                value={paymentDetails.paymentMethod}
                onChange={(e) => setPaymentDetails(prev => ({
                  ...prev,
                  paymentMethod: e.target.value
                }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction ID"
                value={paymentDetails.transactionId}
                onChange={(e) => setPaymentDetails(prev => ({
                  ...prev,
                  transactionId: e.target.value
                }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handlePaymentUpdate}
            variant="contained"
            disabled={!paymentDetails.paymentMethod || !paymentDetails.transactionId}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Billing; 