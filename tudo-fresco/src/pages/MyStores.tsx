import { JSX, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { listByUser } from '../services/StoreService';
import { StoreResponseModel } from '../models/StoreResponseModel';
import { getStoreTypeDisplay, StoreType } from '../enums/StoreType';
import ErrorBanner from '../components/ErrorBanner';

const MyStores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreResponseModel[]>([]);
  const [selectedStoreUuid, setSelectedStoreUuid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      setShowError(false);
      try {
        const response = await listByUser();
        setStores(response);
      } catch (err: any) {
        setError(err.message ?? 'Falha ao carregar suas lojas. Tente novamente.');
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSelectStore = (uuid: string) => {
    setSelectedStoreUuid(uuid === selectedStoreUuid ? null : uuid);
  };

  const handleConfirmSelection = () => {
    if (selectedStoreUuid) {
      navigate(`/dashboard/${selectedStoreUuid}`);
    }
  };

  const handleCreateStore = () => {
    navigate('/store');
  };

  let content: JSX.Element;

  if (isLoading) {
    content = (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  } else if (stores.length === 0) {
    content = (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Você ainda não tem lojas cadastradas.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleCreateStore}
        >
          Adicionar novo negócio
        </Button>
      </Box>
    );
  } else {
    content = (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {stores.map((store) => (
          <Card
            key={store.uuid}
            onClick={() => store.uuid && handleSelectStore(store.uuid)}
            sx={{
              width: '100%',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: selectedStoreUuid === store.uuid ? 'primary.light' : 'transparent',
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              transition: 'border-color 0.2s, background-color 0.2s',
            }}
          >
            <CardContent>
              <Typography variant="h6" component="div">
                {store.legal_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tipo: {getStoreTypeDisplay(store.store_type ?? StoreType.UNKNOWN)}
              </Typography>
            </CardContent>
          </Card>
        ))}
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleConfirmSelection}
          disabled={!selectedStoreUuid}
          sx={{ mt: 2 }}
        >
          Selecionar e Continuar
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Logo />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" color="text.secondary">
            Minhas Lojas 🏬
          </Typography>
          {stores.length > 0 && (
            <IconButton color="primary" onClick={handleCreateStore} size="small">
              <AddIcon />
            </IconButton>
          )}
        </Box>

        <ErrorBanner
          message={error}
          open={showError}
          onClose={() => setShowError(false)}
        />

        {content}
      </Box>
    </Container>
  );
};

export default MyStores;
