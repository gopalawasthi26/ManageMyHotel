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
  Build as BuildIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editForm, setEditForm] = useState({
    roomNumber: '',
    issue: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'in_progress', label: 'In Progress', color: 'info' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'error' },
  ];

  const priorityOptions = [
    { value: 'high', label: 'High', color: 'error' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'low', label: 'Low', color: 'success' },
  ];

  useEffect(() => {
    // Subscribe to rooms collection
    const unsubscribeRooms = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      const roomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(roomsData);
    });

    // Subscribe to maintenance requests
    const unsubscribeMaintenance = onSnapshot(collection(db, 'maintenance_requests'), (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestsData);
      setLoading(false);
    });

    return () => {
      unsubscribeRooms();
      unsubscribeMaintenance();
    };
  }, []);

  const handleAddClick = () => {
    setSelectedRequest(null);
    setEditForm({
      roomNumber: '',
      issue: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      assignedTo: '',
    });
    setOpenDialog(true);
  };

  const handleEditClick = (request) => {
    setSelectedRequest(request);
    setEditForm({
      roomNumber: request.roomNumber,
      issue: request.issue,
      description: request.description,
      priority: request.priority,
      status: request.status,
      assignedTo: request.assignedTo,
    });
    setOpenDialog(true);
  };

  const handleDeleteClick = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this maintenance request?')) {
      try {
        const request = requests.find(r => r.id === requestId);
        await deleteDoc(doc(db, 'maintenance_requests', requestId));

        // Update room status and remove maintenance details
        if (request && request.status !== 'completed' && request.status !== 'cancelled') {
          const roomsQuery = query(collection(db, 'rooms'), where('roomNumber', '==', request.roomNumber));
          const roomsSnapshot = await getDocs(roomsQuery);
          if (!roomsSnapshot.empty) {
            const roomDoc = roomsSnapshot.docs[0];
            await updateDoc(doc(db, 'rooms', roomDoc.id), {
              status: 'vacant',
              maintenanceDetails: null,
              updatedAt: new Date().toISOString(),
            });
          }
        }

        setRequests(requests.filter(request => request.id !== requestId));
        toast.success('Maintenance request deleted successfully');
      } catch (error) {
        console.error('Error deleting maintenance request:', error);
        toast.error('Failed to delete maintenance request');
      }
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedRequest) {
        // Update existing request
        const updateData = {
          ...editForm,
          updatedAt: new Date().toISOString(),
        };

        // Update maintenance request
        await updateDoc(doc(db, 'maintenance_requests', selectedRequest.id), updateData);

        // Update room status and maintenance details
        const roomsQuery = query(collection(db, 'rooms'), where('roomNumber', '==', editForm.roomNumber));
        const roomsSnapshot = await getDocs(roomsQuery);
        if (!roomsSnapshot.empty) {
          const roomDoc = roomsSnapshot.docs[0];
          const roomData = roomDoc.data();

          if (editForm.status === 'completed' || editForm.status === 'cancelled') {
            // Update room status to vacant
            await updateDoc(doc(db, 'rooms', roomDoc.id), {
              status: 'vacant',
              maintenanceDetails: null,
              updatedAt: new Date().toISOString(),
            });
          } else {
            // Update room maintenance details
            await updateDoc(doc(db, 'rooms', roomDoc.id), {
              status: 'maintenance',
              maintenanceDetails: {
                requestId: selectedRequest.id,
                issue: editForm.issue,
                priority: editForm.priority,
                status: editForm.status,
                assignedTo: editForm.assignedTo
              },
              updatedAt: new Date().toISOString(),
            });
          }
        }

        setRequests(requests.map(request =>
          request.id === selectedRequest.id
            ? { ...request, ...editForm }
            : request
        ));
        toast.success('Maintenance request updated successfully');
      } else {
        // Create new request
        const docRef = await addDoc(collection(db, 'maintenance_requests'), {
          ...editForm,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Update room status and maintenance details
        const roomsQuery = query(collection(db, 'rooms'), where('roomNumber', '==', editForm.roomNumber));
        const roomsSnapshot = await getDocs(roomsQuery);
        if (!roomsSnapshot.empty) {
          const roomDoc = roomsSnapshot.docs[0];
          await updateDoc(doc(db, 'rooms', roomDoc.id), {
            status: 'maintenance',
            maintenanceDetails: {
              requestId: docRef.id,
              issue: editForm.issue,
              priority: editForm.priority,
              status: editForm.status,
              assignedTo: editForm.assignedTo
            },
            updatedAt: new Date().toISOString(),
          });
        }

        setRequests([{ id: docRef.id, ...editForm }, ...requests]);
        toast.success('Maintenance request created successfully');
      }
      handleDialogClose();
    } catch (error) {
      console.error('Error saving maintenance request:', error);
      toast.error('Failed to save maintenance request');
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

  const filteredRequests = requests
    .filter(request => {
      const matchesSearch = 
        request.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
      
      // Date filtering
      const requestDate = new Date(request.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let matchesDate = true;
      switch (filterDate) {
        case 'today':
          matchesDate = requestDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          matchesDate = requestDate.toDateString() === yesterday.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = requestDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = requestDate >= monthAgo;
          break;
        default:
          matchesDate = true;
      }
      
      return matchesSearch && matchesStatus && matchesPriority && matchesDate;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const order = sortOrder === 'asc' ? 1 : -1;
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        return order * (new Date(aValue) - new Date(bValue));
      }
      return order * (aValue > bValue ? 1 : -1);
    });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Maintenance Requests
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3
            }
          }}
        >
          New Request
        </Button>
      </Box>

      {/* Enhanced Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            placeholder="Search requests..."
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
        <Grid item xs={12} md={2}>
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
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filterPriority}
              label="Priority"
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={filterDate}
              label="Date Range"
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="yesterday">Yesterday</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="createdAt">Created Date</MenuItem>
              <MenuItem value="updatedAt">Last Updated</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={1}>
          <IconButton 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            sx={{ height: '100%', width: '100%' }}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </IconButton>
        </Grid>
      </Grid>

      {/* Enhanced Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room</TableCell>
              <TableCell>Room Details</TableCell>
              <TableCell>Issue</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No maintenance requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => {
                const room = rooms.find(r => r.roomNumber === request.roomNumber);
                return (
                  <TableRow 
                    key={request.id}
                    sx={{
                      transition: 'background-color 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <TableCell>{request.roomNumber}</TableCell>
                    <TableCell>
                      {room && (
                        <Box>
                          <Typography variant="body2">Type: {room.type}</Typography>
                          <Typography variant="body2">Price: ₹{room.price}/night</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{request.issue}</Typography>
                        {request.description && (
                          <Typography variant="body2" color="text.secondary">
                            {request.description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getPriorityIcon(request.priority)}
                        label={priorityOptions.find(opt => opt.value === request.priority)?.label}
                        color={priorityOptions.find(opt => opt.value === request.priority)?.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusOptions.find(opt => opt.value === request.status)?.label}
                        color={statusOptions.find(opt => opt.value === request.status)?.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{request.assignedTo || 'Unassigned'}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.updatedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton 
                          onClick={() => handleEditClick(request)}
                          sx={{
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => handleDeleteClick(request.id)}
                          sx={{
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRequest ? 'Edit Maintenance Request' : 'New Maintenance Request'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Room</InputLabel>
              <Select
                value={editForm.roomNumber}
                label="Room"
                onChange={(e) => setEditForm({ ...editForm, roomNumber: e.target.value })}
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.roomNumber}>
                    Room {room.roomNumber} - {room.type} ({room.status})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Issue"
              value={editForm.issue}
              onChange={(e) => setEditForm({ ...editForm, issue: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editForm.priority}
                label="Priority"
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
              >
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              label="Assigned To"
              value={editForm.assignedTo}
              onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!editForm.roomNumber}
          >
            {selectedRequest ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MaintenanceRequests; 