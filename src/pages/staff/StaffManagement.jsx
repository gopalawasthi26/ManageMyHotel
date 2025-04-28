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
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Engineering as EngineeringIcon,
  CleaningServices as CleaningIcon,
  Restaurant as RestaurantIcon,
  Security as SecurityIcon,
  LocalConvenienceStore as StoreIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const staffRoles = [
  { value: 'manager', label: 'Manager', icon: AdminIcon },
  { value: 'receptionist', label: 'Receptionist', icon: PersonIcon },
  { value: 'housekeeping', label: 'Housekeeping', icon: CleaningIcon },
  { value: 'maintenance', label: 'Maintenance', icon: EngineeringIcon },
  { value: 'restaurant', label: 'Restaurant Staff', icon: RestaurantIcon },
  { value: 'security', label: 'Security', icon: SecurityIcon },
  { value: 'store', label: 'Store Staff', icon: StoreIcon },
];

const StaffManagement = () => {
  const { currentUser } = useAuth();
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    address: '',
    joiningDate: '',
    status: 'active',
  });

  const departments = [
    'Front Desk',
    'Housekeeping',
    'Maintenance',
    'Restaurant',
    'Security',
    'Management',
  ];

  const roles = [
    'Manager',
    'Supervisor',
    'Staff',
    'Intern',
  ];

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const q = query(collection(db, 'users'), where('userType', '==', 'staff'));
      const querySnapshot = await getDocs(q);
      const staff = [];
      querySnapshot.forEach((doc) => {
        staff.push({ id: doc.id, ...doc.data() });
      });
      setStaffMembers(staff);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff members:', error);
      toast.error('Failed to fetch staff members');
      setLoading(false);
    }
  };

  const handleOpenDialog = (staff = null) => {
    if (staff) {
      setSelectedStaff(staff);
      setFormData({
        name: staff.name || '',
        email: staff.email || '',
        role: staff.role || '',
        department: staff.department || '',
        phone: staff.phone || '',
        address: staff.address || '',
        joiningDate: staff.joiningDate || '',
        status: staff.status || 'active',
      });
    } else {
      setSelectedStaff(null);
      setFormData({
        name: '',
        email: '',
        role: '',
        department: '',
        phone: '',
        address: '',
        joiningDate: '',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStaff(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (selectedStaff) {
        await updateDoc(doc(db, 'users', selectedStaff.id), formData);
        toast.success('Staff member updated successfully');
      } else {
        toast.error('Adding new staff is not implemented yet');
      }
      handleCloseDialog();
      fetchStaffMembers();
    } catch (error) {
      console.error('Error saving staff member:', error);
      toast.error('Failed to save staff member');
    }
  };

  const handleDelete = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteDoc(doc(db, 'users', staffId));
        toast.success('Staff member deleted successfully');
        fetchStaffMembers();
      } catch (error) {
        console.error('Error deleting staff member:', error);
        toast.error('Failed to delete staff member');
      }
    }
  };

  const getRoleIcon = (role) => {
    const roleConfig = staffRoles.find(r => r.value === role);
    return roleConfig ? roleConfig.icon : PersonIcon;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'manager':
        return 'primary';
      case 'receptionist':
        return 'secondary';
      case 'housekeeping':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'restaurant':
        return 'error';
      case 'security':
        return 'info';
      case 'store':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'on_leave':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Staff
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="subtitle1" fontWeight="bold">Staff Member</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" fontWeight="bold">Role</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" fontWeight="bold">Department</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" fontWeight="bold">Status</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" fontWeight="bold">Phone</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="subtitle1" fontWeight="bold">Actions</Typography>
            </Grid>
          </Grid>
        </Box>

        {staffMembers.map((staff) => (
          <Box
            key={staff.id}
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={staff.photoURL}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{staff.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {staff.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Chip
                  label={staff.role}
                  color={getRoleColor(staff.role)}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <Typography>{staff.department}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Chip
                  label={staff.status}
                  color={getStatusColor(staff.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <Typography>{staff.phone || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(staff)}
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(staff.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              disabled={!!selectedStaff}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                label="Department"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="on_leave">On Leave</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedStaff ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffManagement; 