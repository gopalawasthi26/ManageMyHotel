import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Restaurant,
  Spa,
  Pool,
  FitnessCenter,
  BeachAccess,
  Casino,
  LocalParking,
  Wifi,
  RoomService,
  LocalLaundryService,
  BusinessCenter,
  Pets,
  ChildCare,
  LocalTaxi,
  Security,
  Star,
  LocalActivity,
  LocalOffer,
} from "@mui/icons-material";
import AppBar from "../components/AppBar";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
  },
}));

const ServiceIcon = styled(Box)(({ theme }) => ({
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

const Services = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const services = [
    {
      title: "Luxury Suites",
      description: "Experience royal comfort in our heritage-inspired suites with traditional Indian decor",
      icon: "🏰",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Fine Dining",
      description: "Savor authentic Indian cuisine and international delicacies at our multi-cuisine restaurants",
      icon: "🍽️",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Ayurvedic Spa",
      description: "Rejuvenate with traditional Ayurvedic treatments and wellness therapies",
      icon: "🧘",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Wedding Venues",
      description: "Host grand Indian weddings in our majestic banquet halls and outdoor spaces",
      icon: "🎉",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  const amenities = [
    // Highlighted Amenities
    {
      title: "Swimming Pool",
      icon: <Pool />,
      description: "Infinity pool with panoramic views",
      category: "Highlighted"
    },
    {
      title: "Gym",
      icon: <FitnessCenter />,
      description: "24/7 fully equipped fitness center",
      category: "Highlighted"
    },
    {
      title: "Kids Play Area",
      icon: <ChildCare />,
      description: "Supervised play area with modern equipment",
      category: "Highlighted"
    },
    {
      title: "Indoor Games",
      icon: <LocalActivity />,
      description: "Table tennis, chess, and more",
      category: "Highlighted"
    },
    {
      title: "Restaurant",
      icon: <Restaurant />,
      description: "Multi-cuisine restaurant with live cooking stations",
      category: "Highlighted"
    },

    // Basic Facilities
    {
      title: "Free Wi-Fi",
      icon: <Wifi />,
      description: "High-speed internet throughout the hotel",
      category: "Basic"
    },
    {
      title: "Housekeeping",
      icon: <RoomService />,
      description: "24/7 housekeeping service",
      category: "Basic"
    },
    {
      title: "Air Conditioning",
      icon: <LocalOffer />,
      description: "Centralized air conditioning",
      category: "Basic"
    },

    // Transfers
    {
      title: "Airport Transfer",
      icon: <LocalTaxi />,
      description: "Luxury airport transfers with meet & greet",
      category: "Transfers"
    },
    {
      title: "Railway Transfer",
      icon: <LocalTaxi />,
      description: "Comfortable railway station transfers",
      category: "Transfers"
    },
    {
      title: "Shuttle Service",
      icon: <LocalTaxi />,
      description: "Regular shuttle service to city center",
      category: "Transfers"
    },

    // Family and Kids
    {
      title: "Kids Menu",
      icon: <ChildCare />,
      description: "Special menu for young guests",
      category: "Family"
    },
    {
      title: "Activity Centre",
      icon: <LocalActivity />,
      description: "Daily activities and entertainment",
      category: "Family"
    },

    // Food and Drinks
    {
      title: "Coffee Shop",
      icon: <Restaurant />,
      description: "24/7 coffee shop with snacks",
      category: "Food"
    },
    {
      title: "Cafe",
      icon: <Restaurant />,
      description: "Casual dining with international cuisine",
      category: "Food"
    },

    // Safety and Security
    {
      title: "CCTV Surveillance",
      icon: <Security />,
      description: "24/7 security monitoring",
      category: "Safety"
    },
    {
      title: "Security Guards",
      icon: <Security />,
      description: "Trained security personnel",
      category: "Safety"
    },

    // Health and Wellness
    {
      title: "Yoga",
      icon: <Spa />,
      description: "Daily yoga sessions",
      category: "Health"
    },
    {
      title: "First-aid Services",
      icon: <Spa />,
      description: "24/7 medical assistance",
      category: "Health"
    },

    // Media and Technology
    {
      title: "Smart TV",
      icon: <Wifi />,
      description: "Smart TVs with streaming services",
      category: "Media"
    },

    // General Services
    {
      title: "Butler Service",
      icon: <RoomService />,
      description: "Personal butler for premium rooms",
      category: "General"
    },
    {
      title: "Concierge",
      icon: <RoomService />,
      description: "24/7 concierge service",
      category: "General"
    },
    {
      title: "Medical Centre",
      icon: <Spa />,
      description: "In-house medical facility",
      category: "General"
    },

    // Business Center
    {
      title: "Conference Room",
      icon: <BusinessCenter />,
      description: "Modern conference facilities",
      category: "Business"
    },
    {
      title: "Business Centre",
      icon: <BusinessCenter />,
      description: "Full-service business center",
      category: "Business"
    }
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
            Our Services
          </Typography>

          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            Experience the Grandeur of Indian Hospitality
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {services.map((service, index) => (
              <Grid item xs={12} md={6} key={index}>
                <StyledCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={service.image}
                    alt={service.title}
                    sx={{
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                  <CardContent>
                    <ServiceIcon>{service.icon}</ServiceIcon>
                    <Typography variant="h5" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {service.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #FF6B6B 50%, #4ECDC4 100%)",
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ mb: 4 }}
            >
              Hotel Amenities & Facilities
            </Typography>

            {["Highlighted", "Basic", "Transfers", "Family", "Food", "Safety", "Health", "Media", "General", "Business"].map((category) => (
              <Box key={category} sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  {category}
                </Typography>
                <Grid container spacing={3}>
                  {amenities
                    .filter((amenity) => amenity.category === category)
                    .map((amenity, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            bgcolor: "background.paper",
                            borderRadius: 2,
                            boxShadow: 1,
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-5px)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              mr: 2,
                              color: "primary.main",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {amenity.icon}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {amenity.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {amenity.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Services; 