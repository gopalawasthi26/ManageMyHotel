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
  Container,
  IconButton,
  Tooltip,
  Rating,
  Divider,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  useTheme,
  useMediaQuery,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Wifi,
  LocalParking,
  Pool,
  Restaurant,
  FitnessCenter,
  Spa,
  AcUnit,
  Tv,
  KingBed,
  Bathtub,
  Coffee,
  Pets,
  SmokingRooms,
  Block,
  Cancel,
  Image as ImageIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
  Close as CloseIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Info as InfoIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, arrayUnion, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { differenceInDays, isBefore, startOfDay } from 'date-fns';
import { motion } from 'framer-motion';
import { ROOM_STATUS, ROOM_STATUS_COLORS, ROOM_STATUS_LABELS } from '../../constants/roomStatus';

const MotionCard = motion(Card);

const roomTypes = [
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'presidential', label: 'Presidential' },
];

const amenities = [
  { value: 'wifi', label: 'WiFi', icon: Wifi },
  { value: 'parking', label: 'Parking', icon: LocalParking },
  { value: 'pool', label: 'Pool', icon: Pool },
  { value: 'restaurant', label: 'Restaurant', icon: Restaurant },
  { value: 'gym', label: 'Gym', icon: FitnessCenter },
  { value: 'spa', label: 'Spa', icon: Spa },
  { value: 'ac', label: 'Air Conditioning', icon: AcUnit },
  { value: 'tv', label: 'TV', icon: Tv },
  { value: 'king_bed', label: 'King Bed', icon: KingBed },
  { value: 'bathtub', label: 'Bathtub', icon: Bathtub },
  { value: 'coffee', label: 'Coffee Maker', icon: Coffee },
  { value: 'pets_allowed', label: 'Pets Allowed', icon: Pets },
  { value: 'no_pets', label: 'No Pets', icon: Block },
  { value: 'smoking_allowed', label: 'Smoking Allowed', icon: SmokingRooms },
  { value: 'no_smoking', label: 'No Smoking', icon: Cancel },
];

const RoomList = () => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
    totalAmount: 0
  });
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
    guests: 1,
    checkIn: null,
    checkOut: null,
  });
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [paymentMethod, setPaymentMethod] = useState('pay_at_desk');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (currentUser) {
    fetchRooms();
    }
    // Initialize RazorPay
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [currentUser]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyFilters = (rooms) => {
    return rooms.filter(room => {
      // Type filter
      if (filters.type !== 'all' && room.type !== filters.type) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (room.price < min || (max && room.price > max)) {
          return false;
        }
      }

      // Guests filter
      if (room.capacity < filters.guests) {
        return false;
      }

      return true;
    });
  };

  const applySorting = (rooms) => {
    return [...rooms].sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'rating') {
        return sortOrder === 'asc' 
          ? (a.rating || 0) - (b.rating || 0)
          : (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const roomsRef = collection(db, 'rooms');
      const q = query(roomsRef);
      const querySnapshot = await getDocs(q);
      
      const roomsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter out unavailable rooms
      const availableRooms = roomsData.filter(room => 
        room.status === ROOM_STATUS.AVAILABLE
      );

      setRooms(availableRooms);
      
      // Apply filters and sorting
      const filtered = applyFilters(availableRooms);
      const sorted = applySorting(filtered);
      
      setFilteredRooms(sorted);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRooms();
    }
  }, [currentUser]);

  useEffect(() => {
    // Re-apply filters and sorting when they change
    const filtered = applyFilters(rooms);
    const sorted = applySorting(filtered);
    setFilteredRooms(sorted);
  }, [filters, sortBy, sortOrder]);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setCurrentImageIndex(0);
  };

  const handleOpenDialog = (room) => {
    setSelectedRoom(room);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedRoom(null);
    setCurrentImageIndex(0);
    setOpenDialog(false);
    setBookingDetails({
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      specialRequests: '',
      totalAmount: 0
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'numberOfGuests') {
      // For guest selection, we'll use the value directly since it's from a dropdown
      setBookingDetails(prev => ({
        ...prev,
        [name]: parseInt(value)
      }));
    } else {
      setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom || !bookingDetails.checkInDate || !bookingDetails.checkOutDate) return 0;
    
    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights * selectedRoom.price;
  };

  const handlePayment = async (amount) => {
    if (paymentMethod === 'pay_at_desk') {
      return true;
    }

    try {
      // For testing purposes, create a mock order
      const mockOrder = {
        id: `order_${Date.now()}`,
        amount: amount * 100, // Convert to paise
        currency: 'INR'
      };

      console.log('Creating payment with options:', {
        amount: mockOrder.amount,
        currency: mockOrder.currency,
        orderId: mockOrder.id
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_test_key',
        amount: mockOrder.amount,
        currency: mockOrder.currency,
        name: 'Hotel Management',
        description: 'Room Booking Payment',
        order_id: mockOrder.id,
        handler: function (response) {
          console.log('Payment successful:', response);
          toast.success('Payment successful!');
          return true;
        },
        prefill: {
          name: currentUser?.displayName || 'Guest',
          email: currentUser?.email || 'guest@example.com',
          contact: '9999999999' // Add a default contact number
        },
        theme: {
          color: '#1976d2',
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            toast.info('Payment cancelled');
          }
        },
        notes: {
          booking_id: mockOrder.id
        }
      };

      if (!window.Razorpay) {
        console.error('Razorpay script not loaded');
        toast.error('Payment gateway not available. Please try again later.');
        return false;
      }

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
      });

      razorpay.open();
      return true;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(`Payment failed: ${error.message || 'Unknown error occurred'}`);
      return false;
    }
  };

  const handleBookRoom = async (e) => {
    e.preventDefault();
    try {
      if (!currentUser) {
        toast.error('Please login to book a room');
        return;
      }

      if (!selectedRoom) {
        toast.error('No room selected');
        return;
      }

      if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
        toast.error('Please select check-in and check-out dates');
        return;
      }

      const checkIn = new Date(bookingDetails.checkInDate);
      const checkOut = new Date(bookingDetails.checkOutDate);

      // Validate dates
      if (checkIn >= checkOut) {
        toast.error('Check-out date must be after check-in date');
        return;
      }

      if (checkIn < new Date()) {
        toast.error('Check-in date cannot be in the past');
        return;
      }

      // Check if room is still available
      const roomsQuery = query(collection(db, 'rooms'), where('roomNumber', '==', selectedRoom.roomNumber));
      const roomsSnapshot = await getDocs(roomsQuery);
      
      if (roomsSnapshot.empty) {
        toast.error('Room not found');
        return;
      }

      const roomDoc = roomsSnapshot.docs[0];
      const roomData = roomDoc.data();

      if (roomData.status !== ROOM_STATUS.AVAILABLE) {
        toast.error('This room is not available for booking');
        return;
      }

      // Calculate number of nights
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const totalAmount = selectedRoom.price * nights;

      // Process payment
      const paymentSuccess = await handlePayment(totalAmount);
      if (!paymentSuccess) return;

      // Start a batch write to ensure atomic updates
      const batch = writeBatch(db);

      // Create booking
      const bookingRef = doc(collection(db, 'bookings'));
      batch.set(bookingRef, {
        roomNumber: selectedRoom.roomNumber,
        roomId: selectedRoom.id,
        userId: currentUser.uid,
        guestName: currentUser.displayName || 'Guest',
        email: currentUser.email,
        checkInDate: checkIn.toISOString(),
        checkOutDate: checkOut.toISOString(),
        numberOfGuests: bookingDetails.numberOfGuests,
        specialRequests: bookingDetails.specialRequests,
        totalAmount,
        status: paymentMethod === 'pay_at_desk' ? 'booked' : 'booked_and_paid',
        paymentMethod,
        paymentStatus: paymentMethod === 'pay_at_desk' ? 'pending' : 'completed',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });

      // Update room status
      batch.update(doc(db, 'rooms', roomDoc.id), {
        status: 'booked',
        currentBooking: bookingRef.id,
        lastUpdated: new Date().toISOString()
      });

      await batch.commit();

      toast.success(`Room booked successfully! ${paymentMethod === 'pay_at_desk' ? 'Please pay at the reception.' : 'Payment completed.'}`);
      handleCloseDialog();
      fetchRooms();
    } catch (error) {
      console.error('Error booking room:', error);
      toast.error('Failed to book room');
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      (prev + 1) % (selectedRoom.images?.length || 1)
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      (prev - 1 + (selectedRoom.images?.length || 1)) % (selectedRoom.images?.length || 1)
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
        Available Rooms
      </Typography>
        <Box>
          <IconButton onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <ViewListIcon /> : <GridViewIcon />}
          </IconButton>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      ) : rooms.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No rooms available at the moment. Please check back later.
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Enhanced Filters */}
          <Paper sx={{ p: 2, mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Room Type</InputLabel>
                  <Select
                    value={filters.type}
                    label="Room Type"
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    {roomTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    value={filters.priceRange}
                    label="Price Range"
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  >
                    <MenuItem value="all">All Prices</MenuItem>
                    <MenuItem value="0-5000">Budget (₹0-₹5000)</MenuItem>
                    <MenuItem value="5001-10000">Mid-Range (₹5001-₹10000)</MenuItem>
                    <MenuItem value="10001-20000">Luxury (₹10001-₹20000)</MenuItem>
                    <MenuItem value="20001-">Premium (₹20001+)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Number of Guests</InputLabel>
                  <Select
                    value={filters.guests}
                    label="Number of Guests"
                    onChange={(e) => handleFilterChange('guests', e.target.value)}
                  >
                    {[1, 2, 3, 4].map(num => (
                      <MenuItem key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="price">Price</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Room List/Grid */}
          {viewMode === 'grid' ? (
      <Grid container spacing={3}>
              {filteredRooms.map(room => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
                  <MotionCard 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => handleRoomClick(room)}
                  >
              <CardMedia
                component="img"
                height="200"
                      image={room.images?.[0] || room.imageUrl || 'https://placehold.co/300x200'}
                      alt={`${room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room`}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Room {room.roomNumber}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Rating value={room.rating || 0} readOnly precision={0.5} />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({room.reviews?.length || 0} reviews)
                </Typography>
                      </Box>
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        ₹{room.price}/night
                </Typography>
                      <Box sx={{ mt: 2 }}>
                        {room.amenities?.slice(0, 3).map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                        {room.amenities?.length > 3 && (
                          <Chip
                            label={`+${room.amenities.length - 3} more`}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        )}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                        fullWidth
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(room);
                        }}
                >
                  Book Now
                </Button>
              </CardActions>
                  </MotionCard>
          </Grid>
        ))}
      </Grid>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRooms.map(room => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={room.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                            sx={{ width: 56, height: 56, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="subtitle1">Room {room.roomNumber}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {roomTypes.find(t => t.value === room.type)?.label}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{roomTypes.find(t => t.value === room.type)?.label}</TableCell>
                      <TableCell>₹{room.price}/night</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={room.rating || 0} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({room.reviews?.length || 0})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${room.capacity} ${room.capacity === 1 ? 'Guest' : 'Guests'}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoomClick(room);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      
      {/* Room Details Dialog */}
      <Dialog
        open={!!selectedRoom}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: 0,
            boxShadow: 'none',
            background: '#ffffff',
            overflow: 'hidden',
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Image Gallery Section */}
          <Box sx={{ 
            position: 'relative',
            height: { xs: '300px', md: '400px' },
            bgcolor: 'grey.100'
          }}>
            <Box sx={{ 
              position: 'relative',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={selectedRoom?.images?.[currentImageIndex] || selectedRoom?.imageUrl || 'https://placehold.co/300x200'}
                alt={`Room ${selectedRoom?.roomNumber}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {(selectedRoom?.images?.length || 0) > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': { bgcolor: 'white' }
                    }}
                  >
                    <ArrowBackIosIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': { bgcolor: 'white' }
                    }}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Thumbnail Gallery */}
            <Box sx={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              bgcolor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
            }}>
              {selectedRoom?.images?.map((image, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    flexShrink: 0,
                    width: '80px',
                    height: '60px',
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: currentImageIndex === index ? 'primary.main' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Box>

            {/* Room Type and Close Button */}
            <Box sx={{ 
              position: 'absolute',
              top: 16,
              left: 16,
              right: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Chip
                label={roomTypes.find(t => t.value === selectedRoom?.type)?.label}
                color="primary"
                
              />
              <IconButton 
                onClick={handleCloseDialog}
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { bgcolor: 'white' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Content Section */}
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Left Column - Room Details */}
              <Grid item xs={12} md={8}>
                {/* Room Title and Rating */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 600,
                    mb: 1,
                    background: 'linear-gradient(45deg, #2196f3, #00bcd4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {selectedRoom?.type.charAt(0).toUpperCase() + selectedRoom?.type.slice(1)} Room
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Rating value={selectedRoom?.rating || 0} readOnly precision={0.5} />
                    <Typography variant="body2" color="text.secondary">
                      ({selectedRoom?.reviews?.length || 0} reviews)
                    </Typography>
                  </Box>
                </Box>

                {/* Room Description */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <InfoIcon sx={{ color: 'primary.main' }} />
                    About This Room
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-line'
                  }}>
                    {selectedRoom?.description}
                  </Typography>
                </Box>

                {/* Room Features */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ 
                    mb: 2, 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <StarIcon sx={{ color: 'primary.main' }} />
                    Room Features
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedRoom?.amenities?.map((amenity, index) => {
                      const amenityData = amenities.find(a => a.value === amenity);
                      if (!amenityData) return null;
                      
                      return (
                        <Grid item xs={6} sm={4} key={index}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'rgba(33,150,243,0.04)',
                              transform: 'translateY(-2px)'
                            }
                          }}>
                            <amenityData.icon sx={{ color: 'primary.main' }} />
                            <Typography variant="body2">
                              {amenityData.label}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </Grid>

              {/* Right Column - Booking Card */}
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'sticky',
                  top: 0,
                  height: 'fit-content'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Booking Information
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Room Number
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedRoom?.roomNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Maximum Capacity
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedRoom?.capacity} {selectedRoom?.capacity === 1 ? 'Guest' : 'Guests'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Price per night
                    </Typography>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                      ₹{selectedRoom?.price}
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      handleCloseDialog();
                      handleOpenDialog(selectedRoom);
                    }}
                    sx={{ 
                      py: 1.5,
                      bgcolor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Book Room</DialogTitle>
        <form onSubmit={handleBookRoom}>
        <DialogContent>
            <Grid container spacing={3}>
              {/* Room Image */}
              <Grid item xs={12}>
                <CardMedia
                  component="img"
                  height="200"
                  image={selectedRoom?.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={`${roomTypes.find(t => t.value === selectedRoom?.type)?.label} Room`}
                  sx={{ borderRadius: 1 }}
                />
              </Grid>

              {/* Room Details */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Room Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Price per night
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ₹{selectedRoom?.price}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Capacity
                      </Typography>
                      <Typography variant="h6">
                        {selectedRoom?.capacity} {selectedRoom?.capacity === 1 ? 'Guest' : 'Guests'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Booking Form */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Booking Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Check-in Date"
                        value={bookingDetails.checkInDate ? new Date(bookingDetails.checkInDate) : null}
                        onChange={(newValue) => {
                          setBookingDetails(prev => ({
                            ...prev,
                            checkInDate: newValue ? newValue.toISOString().split('T')[0] : ''
                          }));
                        }}
                minDate={new Date()}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            error={!bookingDetails.checkInDate}
                            helperText={!bookingDetails.checkInDate ? 'Check-in date is required' : ''}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Check-out Date"
                        value={bookingDetails.checkOutDate ? new Date(bookingDetails.checkOutDate) : null}
                        onChange={(newValue) => {
                          setBookingDetails(prev => ({
                            ...prev,
                            checkOutDate: newValue ? newValue.toISOString().split('T')[0] : ''
                          }));
                        }}
                        minDate={bookingDetails.checkInDate ? new Date(bookingDetails.checkInDate) : new Date()}
                        renderInput={(params) => (
              <TextField
                            {...params}
                fullWidth
                required
                            error={!bookingDetails.checkOutDate}
                            helperText={!bookingDetails.checkOutDate ? 'Check-out date is required' : ''}
                          />
                        )}
              />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                <InputLabel>Number of Guests</InputLabel>
                <Select
                  name="numberOfGuests"
                        value={bookingDetails.numberOfGuests}
                        label="Number of Guests"
                  onChange={handleInputChange}
                >
                        {Array.from({ length: selectedRoom?.capacity || 1 }, (_, i) => i + 1).map(num => (
                    <MenuItem key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </MenuItem>
                  ))}
                </Select>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Maximum capacity: {selectedRoom?.capacity || 1} guests
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Special Requests"
                      name="specialRequests"
                      value={bookingDetails.specialRequests}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                      placeholder="Any special requirements or preferences?"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Payment Method */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Payment Method
                </Typography>
                <FormControl fullWidth>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel
                      value="pay_at_desk"
                      control={<Radio />}
                      label="Pay at Desk"
                    />
                    <FormControlLabel
                      value="online"
                      control={<Radio />}
                      label="Pay Now (Online)"
                    />
                  </RadioGroup>
              </FormControl>
              </Grid>

              {/* Price Summary */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">
                        Total Price
                      </Typography>
                      <Typography variant="body2">
                        {bookingDetails.checkInDate && bookingDetails.checkOutDate
                          ? `${differenceInDays(new Date(bookingDetails.checkOutDate), new Date(bookingDetails.checkInDate))} nights`
                          : 'Select dates to calculate total'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h5" align="right">
                        ₹{calculateTotalPrice()}
              </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
        </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Cancel
            </Button>
          <Button
              type="submit" 
            variant="contained"
              color="primary"
              disabled={!bookingDetails.checkInDate || !bookingDetails.checkOutDate || !razorpayLoaded}
          >
              {paymentMethod === 'pay_at_desk' ? 'Book Now' : 'Pay Now'}
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default RoomList; 