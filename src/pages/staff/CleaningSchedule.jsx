import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CleaningServices,
  CheckCircle,
  Warning,
  Schedule,
} from '@mui/icons-material';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

const cleaningStatuses = ['pending', 'in_progress', 'completed', 'verified'];

export default function CleaningSchedule() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    lastCleaned: '',
    nextCleaning: '',
    notes: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const roomsQuery = query(
        collection(db, 'rooms'),
        where('status', 'in', ['needs_cleaning', 'occupied'])
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
      status: room.cleaningStatus || 'pending',
      lastCleaned: room.lastCleaned || '',
      nextCleaning: room.nextCleaning || '',
      notes: room.cleaningNotes || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
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
      const roomRef = doc(db, 'rooms', selectedRoom.id);
      await updateDoc(roomRef, {
        cleaningStatus: formData.status,
        lastCleaned: formData.lastCleaned,
        nextCleaning: formData.nextCleaning,
        cleaningNotes: formData.notes,
        status: formData.status === 'completed' ? 'available' : selectedRoom.status,
      });
      toast.success('Cleaning status updated successfully');
      handleCloseDialog();
      fetchRooms();
    } catch (error) {
      toast.error('Failed to update cleaning status');
      console.error('Error updating cleaning status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'pending':
        return 'warning';
      case 'verified':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'in_progress':
        return <CleaningServices />;
      case 'pending':
        return <Warning />;
      case 'verified':
        return <Schedule />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cleaning Schedule
      </Typography>

      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Room {room.roomNumber}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(room.cleaningStatus)}
                    label={room.cleaningStatus?.charAt(0).toUpperCase() + room.cleaningStatus?.slice(1) || 'Pending'}
                    color={getStatusColor(room.cleaningStatus)}
                    size="small"
                  />
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  Type: {room.type}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Last Cleaned: {room.lastCleaned ? new Date(room.lastCleaned).toLocaleDateString() : 'Never'}
                </Typography>
                <Typography color="text.secondary">
                  Next Cleaning: {room.nextCleaning ? new Date(room.nextCleaning).toLocaleDateString() : 'Not scheduled'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleOpenDialog(room)}
                >
                  Update Status
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Cleaning Status - Room {selectedRoom?.roomNumber}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
              >
                {cleaningStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Last Cleaned"
              name="lastCleaned"
              type="datetime-local"
              value={formData.lastCleaned}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Next Cleaning"
              name="nextCleaning"
              type="datetime-local"
              value={formData.nextCleaning}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
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
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 