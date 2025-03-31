import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-hot-toast";

const StaffProfile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    department: "",
    employeeId: "",
  });

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const staffDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (staffDoc.exists()) {
          setFormData({
            name: staffDoc.data().name || "",
            email: currentUser.email || "",
            phone: staffDoc.data().phone || "",
            address: staffDoc.data().address || "",
            role: staffDoc.data().role || "",
            department: staffDoc.data().department || "",
            employeeId: staffDoc.data().employeeId || "",
          });
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
        toast.error("Failed to load staff data");
      }
    };

    fetchStaffData();
  }, [currentUser]);

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
      await updateDoc(doc(db, "users", currentUser.uid), {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
        department: formData.department,
        employeeId: formData.employeeId,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {/* Profile Header */}
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: "0 auto",
                  mb: 2,
                  bgcolor: "primary.main",
                }}
              >
                {formData.name?.charAt(0)?.toUpperCase() || "S"}
              </Avatar>
              <Typography variant="h4" gutterBottom>
                Staff Profile Settings
              </Typography>
              <Typography color="text.secondary">
                Manage your staff account information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Profile Form */}
            <Grid item xs={12}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      disabled
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Employee ID"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        label="Role"
                        required
                      >
                        <MenuItem value="receptionist">Receptionist</MenuItem>
                        <MenuItem value="manager">Manager</MenuItem>
                        <MenuItem value="housekeeper">Housekeeper</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Department</InputLabel>
                      <Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        label="Department"
                        required
                      >
                        <MenuItem value="front-desk">Front Desk</MenuItem>
                        <MenuItem value="housekeeping">Housekeeping</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                        <MenuItem value="management">Management</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default StaffProfile; 