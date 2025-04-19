import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../services/LoginService';
import ErrorBanner from '../components/ErrorBanner'; // Don't forget this!

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false); // Add this state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);

    try {
      const loginData = await loginService(username, password);
      localStorage.setItem('access_token', loginData.accessToken);
      localStorage.setItem('token_type', loginData.tokenType);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setShowError(true);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Logo />
        </Box>

        <Typography variant="subtitle1" textAlign="center" color="text.secondary">
          Login to connect producers and buyers 🌱
        </Typography>

        {/* Error Banner */}
        <ErrorBanner
          message="Hardcoded test error"
          open={true}
          onClose={() => console.log("Banner close clicked")}
        />


        {/* Username input */}
        <TextField
          label="Username"
          type="text"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password input */}
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button variant="contained" color="primary" size="large" type="submit">
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
