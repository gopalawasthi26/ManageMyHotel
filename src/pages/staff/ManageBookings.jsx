import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
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
  Box,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckInIcon,
  ExitToApp as CheckOutIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  LocalAtm as LocalAtmIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const ManageBookings = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('desk');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const steps = ['Booked', 'Booked & Paid', 'Checked In', 'Checked Out'];

  useEffect(() => {
    fetchBookings();
    // Initialize RazorPay
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setActiveStep(getStepIndex(booking.status));
    setOpenDialog(true);
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'booked': return 0;
      case 'booked_paid': return 1;
      case 'checked_in': return 2;
      case 'checked_out': return 3;
      default: return 0;
    }
  };

  const handlePayment = async (amount) => {
    if (paymentMethod === 'online' && razorpayLoaded) {
      try {
        const response = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amount * 100 }) // Convert to paise
        });
        const order = await response.json();

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: amount * 100,
          currency: 'INR',
          name: 'Hotel Management',
          description: `Payment for Booking #${selectedBooking.id}`,
          order_id: order.id,
          handler: async (response) => {
            await handlePaymentSuccess(response);
          },
          prefill: {
            email: selectedBooking.userEmail,
            contact: selectedBooking.userPhone
          },
          theme: {
            color: '#556cd6'
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error('Error processing online payment:', error);
        toast.error('Failed to process online payment');
      }
    } else {
      handleDeskPayment(amount);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      const batch = writeBatch(db);
      const bookingRef = doc(db, 'bookings', selectedBooking.id);
      const roomRef = doc(db, 'rooms', selectedBooking.roomId);

      batch.update(bookingRef, {
        status: 'booked_paid',
        paymentStatus: 'completed',
        paymentMethod: 'online',
        paymentId: response.razorpay_payment_id,
        lastUpdated: new Date().toISOString()
      });

      batch.update(roomRef, {
        status: 'booked',
        currentBooking: selectedBooking.id
      });

      const paymentRef = doc(collection(db, 'payments'));
      batch.set(paymentRef, {
        bookingId: selectedBooking.id,
        amount: paymentAmount,
        paymentMethod: 'online',
        paymentId: response.razorpay_payment_id,
        status: 'completed',
        processedAt: new Date().toISOString()
      });

      await batch.commit();
      toast.success('Payment processed successfully');
      setPaymentDialogOpen(false);
      fetchBookings();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    }
  };

  const handleDeskPayment = async (amount) => {
    try {
      const batch = writeBatch(db);
      const bookingRef = doc(db, 'bookings', selectedBooking.id);
      const roomRef = doc(db, 'rooms', selectedBooking.roomId);

      batch.update(bookingRef, {
        status: 'booked_paid',
        paymentStatus: 'completed',
        paymentMethod: 'desk',
        lastUpdated: new Date().toISOString()
      });

      batch.update(roomRef, {
        status: 'booked',
        currentBooking: selectedBooking.id
      });

      const paymentRef = doc(collection(db, 'payments'));
      batch.set(paymentRef, {
        bookingId: selectedBooking.id,
        amount: amount,
        paymentMethod: 'desk',
        status: 'completed',
        processedBy: currentUser.uid,
        processedAt: new Date().toISOString()
      });

      await batch.commit();
      toast.success('Payment recorded successfully');
      setPaymentDialogOpen(false);
      fetchBookings();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    }
  };

  const handleNext = async () => {
    try {
      const batch = writeBatch(db);
      const bookingRef = doc(db, 'bookings', selectedBooking.id);
      const roomRef = doc(db, 'rooms', selectedBooking.roomId);

      switch (activeStep) {
        case 0: // Booked to Booked & Paid
          setPaymentDialogOpen(true);
          return;

        case 1: // Booked & Paid to Checked In
          batch.update(bookingRef, {
            status: 'checked_in',
            checkInDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          });
          batch.update(roomRef, {
            status: 'occupied'
          });
          break;

        case 2: // Checked In to Checked Out
          batch.update(bookingRef, {
            status: 'checked_out',
            checkOutDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          });
          batch.update(roomRef, {
            status: 'needs_cleaning',
            currentBooking: null
          });
          break;
      }

      await batch.commit();
      toast.success('Status updated successfully');
      setOpenDialog(false);
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleCancelBooking = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const batch = writeBatch(db);
      const bookingRef = doc(db, 'bookings', booking.id);
      const roomRef = doc(db, 'rooms', booking.roomId);

      batch.update(bookingRef, {
        status: 'cancelled',
        lastUpdated: new Date().toISOString()
      });

      batch.update(roomRef, {
        status: 'available',
        currentBooking: null
      });

      await batch.commit();
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Bookings
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Guest Name</TableCell>
                <TableCell>Room Number</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id.slice(0, 8)}</TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>{booking.roomNumber}</TableCell>
                  <TableCell>{format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={
                        booking.status === 'booked_paid' ? 'success' :
                        booking.status === 'booked' ? 'primary' :
                        booking.status === 'checked_in' ? 'info' :
                        booking.status === 'checked_out' ? 'default' :
                        booking.status === 'cancelled' ? 'error' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={booking.paymentMethod === 'online' ? <CreditCardIcon /> : <LocalAtmIcon />}
                      label={`${booking.paymentStatus} (${booking.paymentMethod || 'pending'})`}
                      color={booking.paymentStatus === 'completed' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Manage Booking">
                        <IconButton onClick={() => handleOpenDialog(booking)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {booking.status !== 'cancelled' && (
                        <Tooltip title="Cancel Booking">
                          <IconButton onClick={() => handleCancelBooking(booking)} color="error">
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Booking Management Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Manage Booking
          </DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stepper activeStep={activeStep}>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Booking Details
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Guest Name: {selectedBooking.guestName}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Room Number: {selectedBooking.roomNumber}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Check In: {format(new Date(selectedBooking.checkInDate), 'MMM dd, yyyy')}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Check Out: {format(new Date(selectedBooking.checkOutDate), 'MMM dd, yyyy')}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Total Amount: ₹{selectedBooking.totalAmount}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Payment Status: {selectedBooking.paymentStatus || 'Pending'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            {activeStep < steps.length - 1 && (
              <Button onClick={handleNext} variant="contained" color="primary">
                {activeStep === 0 ? 'Process Payment' : 'Next Step'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="desk">Pay at Desk</MenuItem>
                  <MenuItem value="online">Pay Online (RazorPay)</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                InputProps={{
                  startAdornment: '₹'
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => handlePayment(paymentAmount)}
              variant="contained"
              color="primary"
            >
              Process Payment
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ManageBookings; 