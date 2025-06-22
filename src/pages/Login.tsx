import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Logo from '../components/Logo';
import ErrorBanner from '../components/ErrorBanner';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { token_is_valid, login } from '../services/AuthService';

const Login = () => {
  const navigate = useNavigate();
  const [checkingToken, setCheckingToken] = useState(true); // ✅ novo estado
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  // ✅ Executa a verificação com segurança
  useEffect(() => {
    if (token_is_valid()) {
      navigate('/my-stores');
    } else {
      setCheckingToken(false); // agora sim libera a renderização
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setIsLoading(true);
  
    try {
      await login(username, password);
      window.location.href = '/my-stores';
    } catch (err: any) {
      setError(err.message ?? 'O Login falhou');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTogglePasswordConfirmation = () =>
    setShowPasswordConfirmation((prev) => !prev);

  // ✅ Enquanto estiver verificando o token, mostra só loading
  if (checkingToken) {
    return (
      <Container
        maxWidth="xs"
        sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Logo size={177} />
        </Box>

        <ErrorBanner message={error} open={showError} onClose={() => setShowError(false)} />

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
          type={showPasswordConfirmation ? 'text' : 'password'}
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordConfirmation} edge="end">
                    {showPasswordConfirmation ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {isLoading ? 'Carregando...' : 'Login'}
        </Button>

        <Typography variant="body2" textAlign="center">
          Primeiro acesso?{' '}
          <Link href="/register" onClick={() => navigate('/register')}>
            Cadastre-se
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
