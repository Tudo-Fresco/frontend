import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const NotFound = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Header />

      <Typography variant="h3" component="h1" gutterBottom>
        404
      </Typography>

      <Typography variant="h5" gutterBottom>
        Página não encontrada
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Desculpe, a página que você procura não existe ou foi removida.
      </Typography>

      <Button component={Link} to="/" variant="contained" color="primary">
        Ir para Home
      </Button>
    </Container>
  );
};

export default NotFound;
