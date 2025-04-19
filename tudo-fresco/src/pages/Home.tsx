import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the Organic Market 🌱
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Connect with producers and buyers in the organic food industry. Explore, buy, and sell fresh organic products.
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/login')}
      >
        Go to Your Profile
      </Button>
    </Container>
  );
};

export default Home;
