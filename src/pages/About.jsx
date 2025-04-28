import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Hotel,
  Star,
  History,
  EmojiEvents,
  Groups,
  Security,
} from "@mui/icons-material";
import AppBar from "../components/AppBar";

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

const IconWrapper = styled(Box)(({ theme }) => ({
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

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const features = [
    {
      icon: <Hotel sx={{ fontSize: 30 }} />,
      title: "Luxury Accommodation",
      description:
        "Experience world-class comfort with our premium rooms and suites, designed to provide the perfect blend of luxury and convenience.",
    },
    {
      icon: <Star sx={{ fontSize: 30 }} />,
      title: "5-Star Service",
      description:
        "Our dedicated staff ensures exceptional service, making your stay memorable with personalized attention and care.",
    },
    {
      icon: <History sx={{ fontSize: 30 }} />,
      title: "Rich Heritage",
      description:
        "Established in 1990, we have been serving guests with excellence for over three decades, building a legacy of hospitality.",
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 30 }} />,
      title: "Award-Winning",
      description:
        "Recognized globally for our exceptional service and facilities, we continue to set new standards in hospitality.",
    },
    {
      icon: <Groups sx={{ fontSize: 30 }} />,
      title: "Expert Team",
      description:
        "Our professional team brings years of experience in hospitality, ensuring the best service for our guests.",
    },
    {
      icon: <Security sx={{ fontSize: 30 }} />,
      title: "Safe & Secure",
      description:
        "Your safety is our priority, with 24/7 security and modern safety protocols in place.",
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
            About Manage My Hotel
          </Typography>

          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            Your Premier Destination for Luxury Hospitality
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StyledPaper elevation={3}>
                  <IconWrapper>{feature.icon}</IconWrapper>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </StyledPaper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom align="center">
              Our Story
            </Typography>
            <Typography
              variant="body1"
              paragraph
              align="center"
              sx={{ maxWidth: 800, mx: "auto" }}
            >
              Founded in 1990, Manage My Hotel has grown from a small boutique
              establishment to one of the most prestigious hotel chains in the
              industry. Our commitment to excellence, innovation, and guest
              satisfaction has earned us numerous accolades and a loyal customer
              base.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              align="center"
              sx={{ maxWidth: 800, mx: "auto" }}
            >
              Today, we continue to evolve and adapt to the changing needs of our
              guests while maintaining our core values of luxury, comfort, and
              exceptional service. Our hotels are designed to provide an
              unforgettable experience, combining modern amenities with timeless
              elegance.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default About; 