import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from '@mui/material';
import {
  Hotel as HotelIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  CleaningServices as CleaningServicesIcon,
  Build as BuildIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { collection, query, getDocs, doc, updateDoc, onSnapshot, where, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { ROOM_STATUS, ROOM_STATUS_COLORS, ROOM_STATUS_LABELS } from '../../constants/roomStatus';

const RoomStatusOverview = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editForm, setEditForm] = useState({
    status: '',
    notes: '',
  });

  const statusOptions = [
    { value: ROOM_STATUS.AVAILABLE, label: ROOM_STATUS_LABELS[ROOM_STATUS.AVAILABLE] },
    { value: ROOM_STATUS.OCCUPIED, label: ROOM_STATUS_LABELS[ROOM_STATUS.OCCUPIED] },
    { value: ROOM_STATUS.MAINTENANCE, label: ROOM_STATUS_LABELS[ROOM_STATUS.MAINTENANCE] },
    { value: ROOM_STATUS.NEEDS_CLEANING, label: ROOM_STATUS_LABELS[ROOM_STATUS.NEEDS_CLEANING] }
  ];

  useEffect(() => {
    // Subscribe to rooms collection
    const unsubscribeRooms = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      const roomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(roomsData);
      setLoading(false);
    });

    // Subscribe to maintenance requests
    const unsubscribeMaintenance = onSnapshot(collection(db, 'maintenance_requests'), (snapshot) => {
      const maintenanceRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Update room statuses based on maintenance requests
      setRooms(prevRooms => {
        return prevRooms.map(room => {
          const activeMaintenance = maintenanceRequests.find(
            request => 
              request.roomNumber === room.roomNumber && 
              request.status !== 'completed' && 
              request.status !== 'cancelled'
          );

          if (activeMaintenance) {
            return { 
              ...room, 
              status: 'maintenance',
              maintenanceDetails: {
                issue: activeMaintenance.issue,
                priority: activeMaintenance.priority,
                assignedTo: activeMaintenance.assignedTo,
                requestId: activeMaintenance.id
              }
            };
          } else if (room.status === 'maintenance') {
            return { 
              ...room, 
              status: 'vacant',
              maintenanceDetails: null
            };
          }
          return room;
        });
      });
    });

    return () => {
      unsubscribeRooms();
      unsubscribeMaintenance();
    };
  }, []);

  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setEditForm({
      status: room.status,
      notes: room.notes || '',
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRoom(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedRoom) {
        const updateData = {
          ...editForm,
          updatedAt: new Date().toISOString(),
        };

        // If changing to maintenance status
        if (editForm.status === 'maintenance' && selectedRoom.status !== 'maintenance') {
          // Create maintenance request
          const maintenanceRef = await addDoc(collection(db, 'maintenance_requests'), {
            roomNumber: selectedRoom.roomNumber,
            issue: editForm.notes || 'Room marked for maintenance',
            description: editForm.notes || 'Room requires maintenance',
            priority: 'medium',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          updateData.maintenanceDetails = {
            requestId: maintenanceRef.id,
            issue: editForm.notes || 'Room marked for maintenance',
            priority: 'medium',
            status: 'pending'
          };
        }
        // If changing from maintenance status
        else if (selectedRoom.status === 'maintenance' && editForm.status !== 'maintenance') {
          // Update maintenance request status
          if (selectedRoom.maintenanceDetails?.requestId) {
            await updateDoc(doc(db, 'maintenance_requests', selectedRoom.maintenanceDetails.requestId), {
              status: 'cancelled',
              updatedAt: new Date().toISOString(),
            });
          }
          updateData.maintenanceDetails = null;
        }

        await updateDoc(doc(db, 'rooms', selectedRoom.id), updateData);
        toast.success('Room status updated successfully');
      }
      handleDialogClose();
    } catch (error) {
      console.error('Error updating room status:', error);
      toast.error('Failed to update room status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'maintenance':
        return <BuildIcon color="error" />;
      case 'occupied':
        return <HotelIcon color="info" />;
      case 'vacant':
        return <HotelIcon color="success" />;
      default:
        return <HotelIcon />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <CheckCircleIcon color="success" />;
      default:
        return <WarningIcon />;
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.notes && room.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = rooms.reduce((acc, room) => {
    acc[room.status] = (acc[room.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Room Status Overview
      </Typography>

      {/* Status Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statusOptions.map((status) => (
          <Grid item xs={12} sm={4} key={status.value}>
            <Card sx={{ 
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getStatusIcon(status.value)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {status.label}
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {statusCounts[status.value] || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Rooms Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Maintenance Details</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredRooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No rooms found
                </TableCell>
              </TableRow>
            ) : (
              filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.roomNumber}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Price:</strong> ₹{room.price}/night
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ROOM_STATUS_LABELS[room.status] || 'Unknown'}
                      color={ROOM_STATUS_COLORS[room.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{room.notes || '-'}</TableCell>
                  <TableCell>
                    {room.maintenanceDetails && (
                      <Box>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getPriorityIcon(room.maintenanceDetails.priority)}
                          Issue: {room.maintenanceDetails.issue}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 3 }}>
                          Priority: {room.maintenanceDetails.priority}
                        </Typography>
                        {room.maintenanceDetails.assignedTo && (
                          <Typography variant="body2" sx={{ ml: 3 }}>
                            Assigned to: {room.maintenanceDetails.assignedTo}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ ml: 3, color: 'text.secondary' }}>
                          Status: {room.maintenanceDetails.status}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{new Date(room.updatedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditClick(room)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Room Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.status}
                label="Status"
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomStatusOverview; 