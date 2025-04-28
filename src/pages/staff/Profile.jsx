import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Engineering as EngineeringIcon,
  CleaningServices as CleaningIcon,
  Restaurant as RestaurantIcon,
  Security as SecurityIcon,
  LocalConvenienceStore as StoreIcon,
} from '@mui/icons-material';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const staffRoles = [
  { value: 'manager', label: 'Manager', icon: AdminIcon },
  { value: 'receptionist', label: 'Receptionist', icon: PersonIcon },
  { value: 'housekeeping', label: 'Housekeeping', icon: CleaningIcon },
  { value: 'maintenance', label: 'Maintenance', icon: EngineeringIcon },
  { value: 'restaurant', label: 'Restaurant Staff', icon: RestaurantIcon },
  { value: 'security', label: 'Security', icon: SecurityIcon },
  { value: 'store', label: 'Store Staff', icon: StoreIcon },
];

const Profile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    address: '',
    joiningDate: '',
    status: 'active',
  });
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [currentUser]);

  const fetchProfileData = async () => {
    try {
      if (currentUser) {
        const docRef = doc(db, 'staff', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          setIsManager(data.role === 'manager');
        }
      }
    } catch (error) {
      toast.error('Failed to fetch profile data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfileData();
  };

  const handleSave = async () => {
    try {
      if (!currentUser) {
        toast.error('No user logged in');
        return;
      }

      // Validate required fields
      if (!profileData.name || !profileData.role || !profileData.department) {
        toast.error('Please fill in all required fields');
        return;
      }

      const docRef = doc(db, 'staff', currentUser.uid);
      
      // Create update object with only changed fields
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
      };

      // Only include role and department if user is manager
      if (isManager) {
        updateData.role = profileData.role;
        updateData.department = profileData.department;
        updateData.status = profileData.status;
        updateData.joiningDate = profileData.joiningDate;
      }

      await updateDoc(docRef, updateData);
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        ...updateData
      }));

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
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

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Profile
            </Typography>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Edit Profile
              </Button>
            ) : (
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={currentUser?.photoURL}
                  sx={{ width: 120, height: 120, mb: 2 }}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    {profileData.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {profileData.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    icon={getRoleIcon(profileData.role)}
                    label={profileData.role}
                    color={getRoleColor(profileData.role)}
                  />
                  <Chip
                    label={profileData.department}
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Joined: {new Date(profileData.joiningDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={profileData.email}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={profileData.role}
                      onChange={handleChange}
                      label="Role"
                      disabled={!isEditing || !isManager}
                    >
                      {staffRoles.map(role => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={profileData.department}
                    onChange={handleChange}
                    disabled={!isEditing || !isManager}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Joining Date"
                    name="joiningDate"
                    type="date"
                    value={profileData.joiningDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    disabled={!isEditing || !isManager}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={profileData.status}
                      onChange={handleChange}
                      label="Status"
                      disabled={!isEditing || !isManager}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="on_leave">On Leave</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 