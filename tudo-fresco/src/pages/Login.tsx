import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Link, CircularProgress } from '@mui/material';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService';
import ErrorBanner from '../components/ErrorBanner';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setIsLoading(true);

    try {
      const loginResponse = await login(username, password);
      localStorage.setItem('access_token', loginResponse.accessToken);
      localStorage.setItem('token_type', loginResponse.tokenType);
      navigate('/');
    } catch (err: any) {
      setError(err.message ?? 'O Login falhou');
      setShowError(true);
    } finally {
      setIsLoading(false);
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

        <ErrorBanner
          message={error}
          open={showError}
          onClose={() => setShowError(false)}
        />

        <TextField
          label="Username"
          type="text"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {isLoading ? 'Loading...' : 'Login'}
        </Button>

        <Typography variant="body2" textAlign="center">
          Primeiro acesso?{' '}
          <Link href="/register" onClick={() => navigate('/register')}>
            Clique Aqui
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;