import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from "@mui/icons-material";
import AppBar from "../components/AppBar";
import { toast } from "react-toastify";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
  },
}));

const ContactIcon = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
  color: "white",
}));

const SocialIcon = styled(Button)(({ theme }) => ({
  minWidth: 40,
  height: 40,
  borderRadius: "50%",
  margin: theme.spacing(1),
  color: theme.palette.primary.main,
  "&:hover": {
    background: "rgba(26, 35, 126, 0.1)",
  },
}));

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    toast.success("Message sent successfully!");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const contactInfo = [
    {
      icon: <LocationOn sx={{ fontSize: 30 }} />,
      title: "Address",
      content: "123 Hotel Street, City, Country",
      description: "Find us at the heart of the city",
    },
    {
      icon: <Phone sx={{ fontSize: 30 }} />,
      title: "Phone",
      content: "+1 234 567 890",
      description: "Call us anytime",
    },
    {
      icon: <Email sx={{ fontSize: 30 }} />,
      title: "Email",
      content: "info@managemyhotel.com",
      description: "Send us an email",
    },
    {
      icon: <AccessTime sx={{ fontSize: 30 }} />,
      title: "Working Hours",
      content: "24/7",
      description: "We're always here for you",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar />
      <Box sx={{ pt: 10, pb: 6 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 4,
              background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Contact Us
          </Typography>

          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            Get in Touch with Our Team
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {contactInfo.map((info, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StyledPaper elevation={3}>
                  <ContactIcon>{info.icon}</ContactIcon>
                  <Typography variant="h6" gutterBottom>
                    {info.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {info.content}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {info.description}
                  </Typography>
                </StyledPaper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Send us a Message
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{
                      mt: 2,
                      background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #FF6B6B 50%, #4ECDC4 100%)",
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </form>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4, height: "100%" }}>
                <Typography variant="h5" gutterBottom>
                  Follow Us
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Stay connected with us on social media for the latest updates and
                  special offers.
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <SocialIcon>
                    <Facebook />
                  </SocialIcon>
                  <SocialIcon>
                    <Twitter />
                  </SocialIcon>
                  <SocialIcon>
                    <Instagram />
                  </SocialIcon>
                  <SocialIcon>
                    <LinkedIn />
                  </SocialIcon>
                </Box>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Location Map
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: 300,
                      bgcolor: "grey.200",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      Map will be displayed here
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact; 