import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiConnector } from '../utils/ApiConnector';

const PublicHome = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const api = new ApiConnector();
    api.setUseAuthorization(false);
    api.get('/').catch(() => {
    });
  }, []);

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          backgroundImage: `url(/assets/field-vegetables-farm-lettuce-flower-agriculture-559734-wallhere.com.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(93, 163, 255, 0.14)',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            px: 3,
            background: 'rgba(255, 255, 255, 0.16)',
            py: 5,
            borderRadius: 3,
            backdropFilter: 'blur(6px)',
            boxShadow: 4,
            maxWidth: 400,
          }}
        >
          <Box
            component="img"
            src="/assets/logo.png"
            alt="Logo Tudo Fresco"
            sx={{
              width: isMobile ? 160 : 220,
              height: isMobile ? 160 : 220,
              borderRadius: '50%',
              mb: 6,
              backgroundColor: '#f9ffe6',
              padding: '6px',
              mx: 'auto',
              display: 'block',
            }}
          />
          <Typography variant={isMobile ? 'body1' : 'h5'} mt={1} color="white">
            Direto do produtor para seu negócio
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 4,
              fontWeight: 'bold',
              px: 5,
              py: 1.5,
              backgroundColor: '#005a2c',
              '&:hover': {
                backgroundColor: '#006330',
              },
            }}
            onClick={() => navigate('/login')}
          >
            Entrar na Plataforma
        </Button>
        </Box>
      </Box>
      <Box
      sx={{
        width: '100%',
        py: 8,
        bgcolor: '#f3ffcc',
        textAlign: 'center',
        color: 'black',
      }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Fale com a gente
      </Typography>
      <Typography variant="body1">Email: gbrl.volt@gmail.com</Typography>
      <Typography variant="body1">Telefone: + 55 (47) 99771-3715</Typography>
      <Typography variant="body1">Instagram: @tudofresco</Typography>
    </Box>
      <Box
        sx={{
          width: '100%',
          py: 3,
          bgcolor: '#333',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">© {new Date().getFullYear()} Tudo Fresco. Todos os direitos reservados.</Typography>
      </Box>
    </Box>
  );
};

export default PublicHome;
