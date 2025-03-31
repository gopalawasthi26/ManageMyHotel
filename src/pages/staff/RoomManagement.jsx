import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Presidential Suite'];
const roomStatuses = ['available', 'occupied', 'maintenance', 'needs_cleaning'];

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: '',
    price: '',
    status: 'available',
    amenities: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const roomsSnapshot = await getDocs(collection(db, 'rooms'));
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

  const handleOpenDialog = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData(room);
    } else {
      setEditingRoom(null);
      setFormData({
        roomNumber: '',
        type: '',
        price: '',
        status: 'available',
        amenities: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRoom(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingRoom) {
        await updateDoc(doc(db, 'rooms', editingRoom.id), formData);
        toast.success('Room updated successfully');
      } else {
        await addDoc(collection(db, 'rooms'), formData);
        toast.success('Room added successfully');
      }
      handleCloseDialog();
      fetchRooms();
    } catch (error) {
      toast.error('Failed to save room');
      console.error('Error saving room:', error);
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteDoc(doc(db, 'rooms', roomId));
        toast.success('Room deleted successfully');
        fetchRooms();
      } catch (error) {
        toast.error('Failed to delete room');
        console.error('Error deleting room:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Room Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Room
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amenities</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.roomNumber}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>${room.price}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: room.status === 'available' ? 'success.main' :
                        room.status === 'occupied' ? 'primary.main' :
                        room.status === 'maintenance' ? 'error.main' :
                        'warning.main'
                    }}
                  >
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </Typography>
                </TableCell>
                <TableCell>{room.amenities}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenDialog(room)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(room.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRoom ? 'Edit Room' : 'Add New Room'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Room Number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Room Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                label="Room Type"
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
              >
                {roomStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Amenities"
              name="amenities"
              value={formData.amenities}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRoom ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 