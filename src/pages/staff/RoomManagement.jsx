import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
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
  Box,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  RemoveRedEyeOutlined as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
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
  Close as CloseIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Info as InfoIcon,
  Link as LinkIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
  Badge as BadgeIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from '@mui/icons-material';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ROOM_STATUS, ROOM_STATUS_COLORS, ROOM_STATUS_LABELS } from '../../constants/roomStatus';

const MotionCard = motion.create(Card);

const roomTypes = [
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'presidential', label: 'Presidential' },
];

const statusOptions = [
  { value: ROOM_STATUS.AVAILABLE, label: ROOM_STATUS_LABELS[ROOM_STATUS.AVAILABLE] },
  { value: ROOM_STATUS.OCCUPIED, label: ROOM_STATUS_LABELS[ROOM_STATUS.OCCUPIED] },
  { value: ROOM_STATUS.MAINTENANCE, label: ROOM_STATUS_LABELS[ROOM_STATUS.MAINTENANCE] },
  { value: ROOM_STATUS.NEEDS_CLEANING, label: ROOM_STATUS_LABELS[ROOM_STATUS.NEEDS_CLEANING] }
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

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    price: '',
    capacity: '',
    amenities: [],
    description: '',
    status: ROOM_STATUS.AVAILABLE,
    imageUrl: '',
    images: [],
    rating: 4.5,
    featured: false,
    cleaningSchedule: '',
    maintenanceNotes: '',
  });
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priceRange: 'all',
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const roomsRef = collection(db, 'rooms');
      const q = query(roomsRef);
      const querySnapshot = await getDocs(q);
      
      // Fetch current bookings
      const bookingsRef = collection(db, 'bookings');
      const bookingsQuery = query(bookingsRef, where('status', 'in', ['booked', 'confirmed', 'checked-in']));
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const currentBookings = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const roomsData = querySnapshot.docs.map(doc => {
        const roomData = doc.data();
        const booking = currentBookings.find(b => b.roomNumber === roomData.roomNumber);
        
        return {
          id: doc.id,
          ...roomData,
          status: booking 
            ? (booking.status === 'checked-in' ? ROOM_STATUS.OCCUPIED : ROOM_STATUS.BOOKED)
            : (roomData.status || ROOM_STATUS.AVAILABLE),
          currentBooking: booking?.id || null
        };
      });

      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (room = null) => {
    if (room) {
      setSelectedRoom(room);
      setFormData({
        roomNumber: room.roomNumber || '',
        type: room.type || '',
        price: room.price || '',
        capacity: room.capacity || '',
        amenities: room.amenities || [],
        description: room.description || '',
        status: room.status || ROOM_STATUS.AVAILABLE,
        imageUrl: room.imageUrl || '',
        images: room.images || [],
        rating: room.rating || 4.5,
        featured: room.featured || false,
        cleaningSchedule: room.cleaningSchedule || '',
        maintenanceNotes: room.maintenanceNotes || '',
      });
    } else {
      setSelectedRoom(null);
      setFormData({
        roomNumber: '',
        type: '',
        price: '',
        capacity: '',
        amenities: [],
        description: '',
        status: ROOM_STATUS.AVAILABLE,
        imageUrl: '',
        images: [],
        rating: 4.5,
        featured: false,
        cleaningSchedule: '',
        maintenanceNotes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
    setFormData({
      roomNumber: '',
      type: '',
      price: '',
      capacity: '',
      amenities: [],
      description: '',
      status: ROOM_STATUS.AVAILABLE,
      imageUrl: '',
      images: [],
      rating: 4.5,
      featured: false,
      cleaningSchedule: '',
      maintenanceNotes: '',
    });
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'featured' ? checked : value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAddImage = () => {
    if (!newImageUrl) {
      setImageError("Image URL is required");
      return;
    }

    try {
      // Validate URL format
      new URL(newImageUrl);
      
      // Add the image to the form data
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl]
      }));
      
      // Clear the input and error
      setNewImageUrl("");
      setImageError("");
    } catch (error) {
      setImageError("Invalid URL format");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.roomNumber || !formData.type || !formData.price || !formData.capacity) {
        toast.error('Please fill in all required fields');
        return;
      }

      // If editing an existing room
      if (selectedRoom) {
        // Check if the room is currently booked
        const bookingsRef = collection(db, 'bookings');
        const q = query(
          bookingsRef,
          where('roomId', '==', selectedRoom.id),
          where('status', 'in', ['pending', 'confirmed', 'checked-in'])
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          toast.error('Cannot update status of a booked or occupied room');
          return;
        }

        // Update existing room
        const roomRef = doc(db, 'rooms', selectedRoom.id);
        await updateDoc(roomRef, {
          ...formData,
          status: formData.status || ROOM_STATUS.AVAILABLE
        });
        toast.success('Room updated successfully');
      } else {
        // Create new room
        const roomsRef = collection(db, 'rooms');
        await addDoc(roomsRef, {
          ...formData,
          status: ROOM_STATUS.AVAILABLE,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });
        toast.success('Room created successfully');
      }

      handleCloseDialog();
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error(`Failed to ${selectedRoom ? 'update' : 'create'} room`);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteDoc(doc(db, 'rooms', roomId));
        toast.success('Room deleted successfully');
        fetchRooms();
      } catch (error) {
        toast.error('Failed to delete room');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ROOM_STATUS.AVAILABLE:
        return 'success';
      case ROOM_STATUS.OCCUPIED:
        return 'error';
      case ROOM_STATUS.MAINTENANCE:
        return 'warning';
      case ROOM_STATUS.NEEDS_CLEANING:
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (filters.type !== 'all' && room.type !== filters.type) return false;
    if (filters.status !== 'all' && room.status !== filters.status) return false;
    if (filters.priceRange !== 'all') {
      const price = Number(room.price);
      switch (filters.priceRange) {
        case 'budget':
          if (price > 100) return false;
          break;
        case 'mid':
          if (price <= 100 || price > 200) return false;
          break;
        case 'luxury':
          if (price <= 200) return false;
          break;
      }
    }
    return true;
  });

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      (prev + 1) % (selectedRoom?.images?.length || 1)
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      (prev - 1 + (selectedRoom?.images?.length || 1)) % (selectedRoom?.images?.length || 1)
    );
  };

  const handleViewRoom = (room) => {
    setSelectedRoom(room);
    setViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialog(false);
    setSelectedRoom(null);
  };

  const handleEditFromView = () => {
    setViewDialog(false);
    handleOpenDialog(selectedRoom);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Manage Rooms
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Add, edit, and manage hotel rooms
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Room
          </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Room Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  label="Room Type"
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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {statusOptions.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Price Range</InputLabel>
                <Select
                  value={filters.priceRange}
                  label="Price Range"
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                >
                  <MenuItem value="all">All Prices</MenuItem>
                  <MenuItem value="budget">Budget (₹0-₹5000)</MenuItem>
                  <MenuItem value="mid">Mid-Range (₹5001-₹10000)</MenuItem>
                  <MenuItem value="luxury">Luxury (₹10001+)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {filteredRooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <MotionCard
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={room.images?.[0] || room.imageUrl || 'https://placehold.co/300x200'}
                  alt={`Room ${room.roomNumber}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Room {room.roomNumber}
                    </Typography>
                    <Chip
                      label={ROOM_STATUS_LABELS[room.status] || 'Unknown'}
                      color={ROOM_STATUS_COLORS[room.status] || 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Capacity: {room.capacity} persons
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Price: ₹{room.price}/night
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={1}>
                      {(Array.isArray(room.amenities) ? room.amenities : []).map((amenity, index) => {
                        const amenityConfig = amenities.find(a => a.value === amenity);
                        if (amenityConfig) {
                          const Icon = amenityConfig.icon;
                          return (
                            <Grid item key={index}>
                              <Tooltip title={amenityConfig.label}>
                                <IconButton size="small" sx={{ color: 'primary.main' }}>
                                  <Icon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          );
                        }
                        return null;
                      })}
                    </Grid>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Rating value={room.rating || 4.5} precision={0.5} readOnly />
                    {room.featured && (
                      <Chip
                        label="Featured"
                        color="secondary"
                        size="small"
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleViewRoom(room)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Room Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            boxShadow: 'none',
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
          }
        }}
      >
        <Box sx={{ 
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2196f3, #00bcd4)',
          }
        }}>
          <DialogTitle sx={{ 
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            bgcolor: 'rgba(0,0,0,0.02)'
          }}>
            <Box sx={{ 
              width: 48, 
              height: 48, 
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 2px 8px rgba(33,150,243,0.3)'
            }}>
              {selectedRoom ? <EditIcon sx={{ fontSize: 24 }} /> : <AddIcon sx={{ fontSize: 24 }} />}
            </Box>
            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: 0.5,
                background: 'linear-gradient(45deg, #2196f3, #00bcd4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {selectedRoom ? 'Edit Room Details' : 'Create New Room'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedRoom ? 'Update the room information' : 'Fill in the details to add a new room'}
              </Typography>
            </Box>
          </DialogTitle>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ 
            display: 'flex',
            height: 'calc(100vh - 200px)',
            overflow: 'hidden'
          }}>
            {/* Left Panel - Form */}
            <Box sx={{ 
              flex: 1,
              p: 3,
              overflowY: 'auto',
              borderRight: '1px solid rgba(0,0,0,0.1)',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.05)',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0,0,0,0.1)',
                borderRadius: '3px',
              },
            }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main'
                }}>
                  <BadgeIcon /> Room Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Room Number"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Room Type</InputLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        label="Room Type"
                        variant="outlined"
                      >
                        {roomTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Price per Night"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">guests</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      variant="outlined"
                      placeholder="Describe the room features, view, and special amenities..."
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main'
                }}>
                  <ImageIcon /> Room Images
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2,
                  p: 3,
                  border: '1px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  bgcolor: 'rgba(33,150,243,0.02)'
                }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      label="Image URL"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      error={!!imageError}
                      helperText={imageError}
                      variant="outlined"
                      placeholder="https://example.com/image.jpg"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LinkIcon /></InputAdornment>,
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddPhotoIcon />}
                      onClick={handleAddImage}
                      disabled={!newImageUrl}
                      sx={{ 
                        minWidth: '120px',
                        bgcolor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.dark'
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2,
                    minHeight: '150px',
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 1,
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}>
                    {formData.images.length > 0 ? (
                      formData.images.map((image, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <img
                            src={image}
                            alt={`Room ${index + 1}`}
                            style={{
                              width: '120px',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: 'white',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              '&:hover': { bgcolor: 'grey.100' }
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '150px',
                          color: 'text.secondary'
                        }}
                      >
                        <ImageIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          No images added yet
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main'
                }}>
                  <StarIcon /> Amenities & Features
                </Typography>
                <Grid container spacing={2}>
                  {amenities.map(amenity => (
                    <Grid item xs={6} sm={4} key={amenity.value}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.amenities.includes(amenity.value)}
                            onChange={() => handleAmenityChange(amenity.value)}
                            color="primary"
                          />
                        }
                        label={
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            color: formData.amenities.includes(amenity.value) ? 'primary.main' : 'text.secondary'
                          }}>
                            <amenity.icon />
                            <Typography variant="body2">{amenity.label}</Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>

            {/* Right Panel - Settings */}
            <Box sx={{ 
              width: '300px',
              p: 3,
              bgcolor: 'rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              borderLeft: '1px solid rgba(0,0,0,0.1)'
            }}>
              <Box>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'primary.main'
                }}>
                  <SettingsIcon /> Room Settings
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2,
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.1)'
                }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      label="Status"
                      variant="outlined"
                    >
                      {statusOptions.map(status => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 1,
                    p: 2,
                    bgcolor: 'rgba(0,0,0,0.02)',
                    borderRadius: 1
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Room Rating
                    </Typography>
                    <Rating
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      precision={0.5}
                      size="large"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: 'primary.main',
                        },
                        '& .MuiRating-iconHover': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.featured}
                        onChange={handleChange}
                        name="featured"
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: formData.featured ? 'primary.main' : 'text.secondary'
                      }}>
                        <StarIcon />
                        <Typography variant="body2">Featured Room</Typography>
                      </Box>
                    }
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 'auto' }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!formData.roomNumber || !formData.type || !formData.price || !formData.capacity}
                  sx={{ 
                    py: 1.5,
                    mb: 2,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(0,0,0,0.12)',
                      color: 'rgba(0,0,0,0.26)'
                    }
                  }}
                >
                  {selectedRoom ? 'Update Room' : 'Create Room'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCloseDialog}
                  sx={{ 
                    py: 1.5,
                    borderColor: 'rgba(0,0,0,0.12)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(33,150,243,0.04)'
                    }
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Room Details Dialog */}
      <Dialog
        open={viewDialog}
        onClose={handleCloseViewDialog}
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
                src={selectedRoom?.images?.[currentImageIndex] || selectedRoom?.imageUrl || '/room-placeholder.jpg'}
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
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 16, 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1
                  }}>
                    {selectedRoom?.images?.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: currentImageIndex === index ? 'primary.main' : 'white',
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'primary.light' }
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </Box>
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
              '&::-webkit-scrollbar': {
                height: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255,255,255,0.1)',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '2px',
              },
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
                // sx={{ 
                //   bgcolor: 'rgba(255, 255, 255, 0.9)',
                //   '& .MuiChip-label': { fontWeight: 600 }
                // }}
              />
              <IconButton 
                onClick={handleCloseViewDialog}
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

              {/* Right Column - Room Status */}
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
                    Room Information
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
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Status
                    </Typography>
                    <Chip
                      label={ROOM_STATUS_LABELS[selectedRoom?.status] || 'Unknown'}
                      color={ROOM_STATUS_COLORS[selectedRoom?.status] || 'default'}
                      size="small"
                    />
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleEditFromView}
                    sx={{ 
                      py: 1.5,
                      bgcolor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    Edit Room
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ManageRooms; 