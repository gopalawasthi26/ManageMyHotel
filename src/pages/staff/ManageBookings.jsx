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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckInIcon,
  ExitToApp as CheckOutIcon,
} from '@mui/icons-material';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    checkInDate: '',
    checkOutDate: '',
    totalAmount: '',
  });

  useEffect(() => {
    fetchBookings();
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
    setFormData({
      status: booking.status || '',
      checkInDate: booking.checkInDate || '',
      checkOutDate: booking.checkOutDate || '',
      totalAmount: booking.totalAmount || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
    setFormData({
      status: '',
      checkInDate: '',
      checkOutDate: '',
      totalAmount: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateBooking = async () => {
    try {
      await updateDoc(doc(db, 'bookings', selectedBooking.id), formData);
      toast.success('Booking updated successfully');
      handleCloseDialog();
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId));
        toast.success('Booking deleted successfully');
        fetchBookings();
      } catch (error) {
        toast.error('Failed to delete booking');
      }
    }
  };

  const handleCheckIn = async (booking) => {
    try {
      await updateDoc(doc(db, 'bookings', booking.id), {
        status: 'checked-in'
      });
      await updateDoc(doc(db, 'rooms', booking.roomId), {
        status: 'occupied'
      });
      toast.success('Guest checked in successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to check in guest');
    }
  };

  const handleCheckOut = async (booking) => {
    try {
      await updateDoc(doc(db, 'bookings', booking.id), {
        status: 'checked-out'
      });
      await updateDoc(doc(db, 'rooms', booking.roomId), {
        status: 'available'
      });
      toast.success('Guest checked out successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to check out guest');
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Bookings
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Guest Name</TableCell>
                <TableCell>Room</TableCell>
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
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>Room {booking.roomNumber}</TableCell>
                  <TableCell>
                    {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>${booking.totalAmount}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(booking)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Check In">
                      <IconButton
                        color="primary"
                        onClick={() => handleCheckIn(booking)}
                        disabled={booking.status === 'checked-in'}
                      >
                        <CheckInIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Check Out">
                      <IconButton
                        color="secondary"
                        onClick={() => handleCheckOut(booking)}
                        disabled={booking.status !== 'checked-in'}
                      >
                        <CheckOutIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Booking Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
                required
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="checked-in">Checked In</MenuItem>
                <MenuItem value="checked-out">Checked Out</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Check In Date"
              name="checkInDate"
              type="date"
              value={formData.checkInDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Check Out Date"
              name="checkOutDate"
              type="date"
              value={formData.checkOutDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Total Amount"
              name="totalAmount"
              type="number"
              value={formData.totalAmount}
              onChange={handleChange}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleUpdateBooking} variant="contained" color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ManageBookings; 