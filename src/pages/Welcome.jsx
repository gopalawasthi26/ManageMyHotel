import React from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(8),
  textAlign: 'center',
  borderRadius: 0,
  marginBottom: theme.spacing(4),
  width: '100%',
  maxWidth: '100%',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const Welcome = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const features = [
    {
      title: 'Luxury Rooms',
      description: 'Experience comfort in our well-appointed rooms with modern amenities.',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Fine Dining',
      description: 'Savor exquisite cuisine at our restaurants and cafes.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Premium Services',
      description: 'Enjoy world-class service with our dedicated staff.',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <StyledPaper elevation={3}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 'bold'
            }}
          >
            Welcome to Hotel Management
          </Typography>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              mb: 4
            }}
          >
            Your perfect stay awaits
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleLogin}
              sx={{ 
                minWidth: '150px',
                fontSize: '1.1rem'
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={handleSignUp}
              sx={{ 
                minWidth: '150px',
                fontSize: '1.1rem'
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Container>
      </StyledPaper>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 6,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <FeatureCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'grey.100', py: 8, width: '100%' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{ 
              fontSize: { xs: '1.8rem', md: '2.2rem' }
            }}
          >
            Ready to Experience Luxury?
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            paragraph
            sx={{ 
              maxWidth: '600px',
              mx: 'auto',
              mb: 4
            }}
          >
            Join our community of satisfied guests and experience the perfect blend of comfort and luxury.
          </Typography>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSignUp}
              sx={{ 
                minWidth: '200px',
                fontSize: '1.1rem'
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Welcome; 