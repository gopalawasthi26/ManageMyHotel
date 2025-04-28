import React, { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Zoom,
  Stack,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SpaIcon from "@mui/icons-material/Spa";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import CasinoIcon from "@mui/icons-material/Casino";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AppBar from "../components/AppBar";
import { Pool, FitnessCenter, ChildCare, LocalActivity, LocalTaxi, Security, RoomService, BusinessCenter, Restaurant, Wifi, Spa } from "@mui/icons-material";

const HeroSection = styled(Box)(({ theme }) => ({
  height: "100vh",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  background: "linear-gradient(135deg, #000000 0%, #1a237e 100%)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.3,
    zIndex: 1,
  },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: theme.spacing(4),
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  borderRadius: "20px",
  overflow: "hidden",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "30px",
  padding: "12px 30px",
  fontSize: "1.1rem",
  textTransform: "none",
  background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  "&:hover": {
    background: "linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)",
    boxShadow: "0 6px 10px 4px rgba(255, 105, 135, .3)",
  },
}));

const MotionDiv = forwardRef((props, ref) => (
  <motion.div ref={ref} {...props} />
));

const Welcome = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleAuth = () => {
    navigate("/login");
  };

  const features = [
    {
      title: "Luxury Suites",
      description: "Experience unparalleled comfort in our premium suites with panoramic views and modern amenities.",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      details: ["King-size beds", "Ocean view", "Private balcony", "Mini bar"],
    },
    {
      title: "Fine Dining",
      description: "Savor exquisite cuisine at our world-class restaurants featuring international and local specialties.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      details: ["24/7 room service", "Multiple restaurants", "Special dietary options", "Wine cellar"],
    },
    {
      title: "Premium Services",
      description: "Enjoy personalized service with our dedicated staff and exclusive amenities.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      details: ["Spa & wellness", "Concierge service", "Airport transfer", "Event planning"],
    },
    {
      title: "Recreation",
      description: "Stay active and entertained with our comprehensive recreational facilities.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      details: ["Swimming pool", "Fitness center", "Tennis courts", "Golf course"],
    },
  ];

  const amenities = [
    { icon: <WifiIcon />, text: "Free High-Speed WiFi" },
    { icon: <PoolIcon />, text: "Infinity Pool" },
    { icon: <RestaurantIcon />, text: "Fine Dining Restaurants" },
    { icon: <SpaIcon />, text: "Luxury Spa" },
    { icon: <LocalParkingIcon />, text: "Free Parking" },
    { icon: <FitnessCenterIcon />, text: "State-of-the-art Gym" },
    { icon: <BeachAccessIcon />, text: "Private Beach Access" },
    { icon: <CasinoIcon />, text: "Casino" },
  ];

  const stats = [
    { value: 150, label: "Luxury Rooms" },
    { value: 5000, label: "Happy Guests" },
    { value: 100, label: "Staff Members" },
    { value: 15, label: "Restaurants" },
  ];

  return (
    <Box sx={{ width: "100vw", overflow: "hidden", position: "relative", left: 0, right: 0 }}>
      <AppBar />

      <HeroSection>
        <Container maxWidth={false} sx={{ position: "relative", zIndex: 2, px: { xs: 2, sm: 4 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12}>
              <MotionDiv
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "2.5rem", md: "4.5rem" },
                    fontWeight: "bold",
                    color: "white",
                    mb: 2,
                    lineHeight: 1.2,
                  }}
                >
                  Experience Luxury Like Never Before
                </Typography>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1.2rem", md: "1.8rem" },
                    mb: 4,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  Discover the perfect blend of comfort and elegance
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                  <Chip
                    icon={<StarIcon />}
                    label="5-Star Rated"
                    sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }}
                  />
                  <Chip
                    icon={<PoolIcon />}
                    label="Infinity Pool"
                    sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white" }}
                  />
                </Stack>
                <StyledButton
                  size="large"
                  onClick={handleAuth}
                  sx={{ mr: 2 }}
                >
                  Book Now
                </StyledButton>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Explore More
                </Button>
              </MotionDiv>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            animation: "bounce 2s infinite",
          }}
        >
          <KeyboardArrowDownIcon sx={{ color: "white", fontSize: 40 }} />
        </Box>
      </HeroSection>

      <Container maxWidth={false} sx={{ py: 12, px: { xs: 2, sm: 4 } }}>
        <Box sx={{ maxWidth: "lg", mx: "auto" }}>
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              align="center"
              sx={{
                mb: 6,
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              Why Choose Us
            </Typography>
          </MotionDiv>
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FeatureCard>
                    <CardMedia
                      component="img"
                      height="200"
                      image={feature.image}
                      alt={feature.title}
                    />
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: "bold" }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                        {feature.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {feature.details.map((detail, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            color="primary"
                            sx={{ display: "flex", alignItems: "center", mb: 1 }}
                          >
                            • {detail}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </FeatureCard>
                </MotionDiv>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Box sx={{ py: 8, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
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
            Hotel Amenities
          </Typography>

          <Grid container spacing={4}>
            {/* Highlighted Amenities */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                  height: "100%",
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: "primary.main" }}>
                  Highlighted Amenities
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Pool />
                    </ListItemIcon>
                    <ListItemText primary="Swimming Pool" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FitnessCenter />
                    </ListItemIcon>
                    <ListItemText primary="Gym" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ChildCare />
                    </ListItemIcon>
                    <ListItemText primary="Kids Play Area" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocalActivity />
                    </ListItemIcon>
                    <ListItemText primary="Indoor Games" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Restaurant />
                    </ListItemIcon>
                    <ListItemText primary="Restaurant" />
                  </ListItem>
                </List>
              </Box>
            </Grid>

            {/* Family & Entertainment */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                  height: "100%",
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: "primary.main" }}>
                  Family & Entertainment
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <ChildCare />
                    </ListItemIcon>
                    <ListItemText primary="Kids Menu" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocalActivity />
                    </ListItemIcon>
                    <ListItemText primary="Activity Centre" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Restaurant />
                    </ListItemIcon>
                    <ListItemText primary="Coffee Shop" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Restaurant />
                    </ListItemIcon>
                    <ListItemText primary="Cafe" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Wifi />
                    </ListItemIcon>
                    <ListItemText primary="Smart TV" />
                  </ListItem>
                </List>
              </Box>
            </Grid>

            {/* Services & Facilities */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 1,
                  height: "100%",
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: "primary.main" }}>
                  Services & Facilities
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LocalTaxi />
                    </ListItemIcon>
                    <ListItemText primary="Airport Transfer" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText primary="CCTV & Security" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Spa />
                    </ListItemIcon>
                    <ListItemText primary="Yoga & Wellness" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <RoomService />
                    </ListItemIcon>
                    <ListItemText primary="Butler Service" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessCenter />
                    </ListItemIcon>
                    <ListItemText primary="Business Centre" />
                  </ListItem>
                </List>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "grey.50", py: 12 }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4 } }}>
          <Box sx={{ maxWidth: "lg", mx: "auto" }}>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                align="center"
                sx={{
                  mb: 6,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: "bold",
                  color: "primary.main",
                }}
              >
                Book Your Stay
              </Typography>
            </MotionDiv>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: "16px",
                background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                Ready to Experience Luxury?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Book your stay now and enjoy our exclusive offers
              </Typography>
              <StyledButton
                size="large"
                onClick={handleAuth}
              >
                Book Now
              </StyledButton>
            </Paper>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "grey.50", py: 12 }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4 } }}>
          <Box sx={{ maxWidth: "lg", mx: "auto" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <MotionDiv
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                    }}
                  >
                    Contact Us
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary="123 Luxury Avenue, Paradise City, PC 12345"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary="+1 (555) 123-4567"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary="info@luxuryhotel.com"
                      />
                    </ListItem>
                  </List>
                </MotionDiv>
              </Grid>
              <Grid item xs={12} md={6}>
                <MotionDiv
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                    }}
                  >
                    Hotel Statistics
                  </Typography>
                  <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            textAlign: "center",
                            bgcolor: "white",
                            borderRadius: "12px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                          }}
                        >
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{ color: "primary.main", fontWeight: "bold" }}
                          >
                            <CountUp end={stat.value} duration={2.5} />
                            +
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {stat.label}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </MotionDiv>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Welcome;
