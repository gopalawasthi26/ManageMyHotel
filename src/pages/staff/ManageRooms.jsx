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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';

const roomTypes = [
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
  { value: 'presidential', label: 'Presidential' },
];

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    price: '',
    capacity: '',
    amenities: '',
    description: '',
    status: 'available',
    imageUrl: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rooms'));
      const roomsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(roomsData);
    } catch (error) {
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
        amenities: room.amenities || '',
        description: room.description || '',
        status: room.status || 'available',
        imageUrl: room.imageUrl || '',
      });
    } else {
      setSelectedRoom(null);
      setFormData({
        roomNumber: '',
        type: '',
        price: '',
        capacity: '',
        amenities: '',
        description: '',
        status: 'available',
        imageUrl: '',
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
      amenities: '',
      description: '',
      status: 'available',
      imageUrl: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedRoom) {
        await updateDoc(doc(db, 'rooms', selectedRoom.id), formData);
        toast.success('Room updated successfully');
      } else {
        await addDoc(collection(db, 'rooms'), formData);
        toast.success('Room added successfully');
      }
      handleCloseDialog();
      fetchRooms();
    } catch (error) {
      toast.error(selectedRoom ? 'Failed to update room' : 'Failed to add room');
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
      case 'available':
        return 'success';
      case 'occupied':
        return 'error';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Manage Rooms
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Room
          </Button>
        </Box>

        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={room.imageUrl || 'https://via.placeholder.com/300x200'}
                  alt={`Room ${room.roomNumber}`}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Room {room.roomNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Capacity: {room.capacity} persons
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Price: ${room.price}/night
                  </Typography>
                  <Chip
                    label={room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                    color={getStatusColor(room.status)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <Tooltip title="Edit">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(room)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add/Edit Room Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Room Number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Room Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Room Type"
                required
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price per Night"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Amenities"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
                required
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="occupied">Occupied</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedRoom ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ManageRooms; 