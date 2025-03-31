import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setFormData({
            name: userDoc.data().name || '',
            phone: userDoc.data().phone || '',
            address: userDoc.data().address || '',
          });
        }
      } catch (error) {
        toast.error('Failed to fetch profile data');
      }
    };

    fetchUserProfile();
  }, [currentUser.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Settings
        </Typography>
        <Paper sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                }}
              >
                {currentUser.email[0].toUpperCase()}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {currentUser.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  disabled={loading}
                >
                  Update Profile
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserProfile; 