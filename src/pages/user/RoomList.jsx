import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { differenceInDays, isBefore, startOfDay } from 'date-fns';

export default function RoomList() {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    checkInDate: null,
    checkOutDate: null,
    guestName: '',
    numberOfGuests: 1,
  });
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const roomsQuery = query(
        collection(db, 'rooms'),
        where('status', '==', 'available')
      );
      const roomsSnapshot = await getDocs(roomsQuery);
      const roomsData = roomsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(roomsData);
    } catch (error) {
      toast.error('Failed to fetch rooms');
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (room) => {
    setSelectedRoom(room);
    setFormData({
      checkInDate: null,
      checkOutDate: null,
      guestName: '',
      numberOfGuests: 1,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
  };

  const handleCloseConfirmationDialog = () => {
    setOpenConfirmationDialog(false);
    setBookingDetails(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom || !formData.checkInDate || !formData.checkOutDate) return 0;
    const days = differenceInDays(formData.checkOutDate, formData.checkInDate);
    return days * selectedRoom.price;
  };

  const validateDates = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return false;
    const today = startOfDay(new Date());
    const checkIn = startOfDay(formData.checkInDate);
    const checkOut = startOfDay(formData.checkOutDate);
    
    return !isBefore(checkIn, today) && !isBefore(checkOut, checkIn);
  };

  const handleSubmit = async () => {
    try {
      if (!validateDates()) {
        toast.error('Please select valid check-in and check-out dates');
        return;
      }

      const bookingData = {
        userId: currentUser.uid,
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.roomNumber,
        roomType: selectedRoom.type,
        guestName: formData.guestName,
        numberOfGuests: formData.numberOfGuests,
        checkInDate: formData.checkInDate.toISOString(),
        checkOutDate: formData.checkOutDate.toISOString(),
        totalAmount: calculateTotalPrice(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
      
      // Update room status to pending
      await updateDoc(doc(db, 'rooms', selectedRoom.id), {
        status: 'pending'
      });

      setBookingDetails({ ...bookingData, id: bookingRef.id });
      setOpenDialog(false);
      setOpenConfirmationDialog(true);
      fetchRooms();
    } catch (error) {
      toast.error('Failed to submit booking request');
      console.error('Error submitting booking:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Rooms
      </Typography>
      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={room.image || 'https://placehold.co/300x200'}
                alt={`Room ${room.roomNumber}`}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Room {room.roomNumber} - {room.type}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {room.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {(Array.isArray(room.amenities) ? room.amenities : []).map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Typography variant="h6" color="primary">
                  ${room.price}/night
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleOpenDialog(room)}
                >
                  Book Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Book Room {selectedRoom?.roomNumber}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="Check-in Date"
                value={formData.checkInDate}
                onChange={(date) => handleDateChange(date, 'checkInDate')}
                minDate={new Date()}
                sx={{ width: '100%', mb: 2 }}
              />
              <DatePicker
                label="Check-out Date"
                value={formData.checkOutDate}
                onChange={(date) => handleDateChange(date, 'checkOutDate')}
                minDate={formData.checkInDate || new Date()}
                sx={{ width: '100%', mb: 2 }}
              />
              <TextField
                fullWidth
                label="Guest Name"
                name="guestName"
                value={formData.guestName}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Number of Guests</InputLabel>
                <Select
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  label="Number of Guests"
                >
                  {[1, 2, 3, 4].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total Price: ${calculateTotalPrice()}
              </Typography>
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.checkInDate || !formData.checkOutDate || !formData.guestName}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmationDialog} onClose={handleCloseConfirmationDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Booking Confirmation</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your booking has been submitted successfully!
          </Alert>
          {bookingDetails && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Booking Details:
              </Typography>
              <Typography>Booking ID: {bookingDetails.id}</Typography>
              <Typography>Room: {bookingDetails.roomNumber} - {bookingDetails.roomType}</Typography>
              <Typography>Guest: {bookingDetails.guestName}</Typography>
              <Typography>
                Check-in: {new Date(bookingDetails.checkInDate).toLocaleDateString()}
              </Typography>
              <Typography>
                Check-out: {new Date(bookingDetails.checkOutDate).toLocaleDateString()}
              </Typography>
              <Typography>Total Amount: ${bookingDetails.totalAmount}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 