import { JSX, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Fab,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { listByUser } from '../services/StoreService';
import { StoreResponseModel } from '../models/StoreResponseModel';
import { getStoreTypeDisplay, StoreType } from '../enums/StoreType';
import ErrorBanner from '../components/ErrorBanner';
import ProfileMenu from '../components/ProfileMenu';

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
    if (!selectedStoreUuid) return;
    const selectedStore = stores.find(store => store.uuid === selectedStoreUuid);
    if (!selectedStore) return;
    if (selectedStore.store_type === StoreType.RETAILER) {
      navigate(`/demands-retailer/${selectedStoreUuid}`);
    } else {
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
                Tipo: {getStoreTypeDisplay(store.store_type)}
              </Typography>
            </CardContent>
          </Card>
        ))}
        <Box width='10en' display='flex' alignItems='center' justifyContent='center'>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={handleConfirmSelection}
            disabled={!selectedStoreUuid}
            sx={{ mt: 2 }}
          >
            Continuar
          </Button>
        </Box>
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
          <ProfileMenu />
          <Typography variant="subtitle1" color="text.secondary">
            Minhas Lojas 🏬
          </Typography>
        </Box>

        <ErrorBanner
          message={error}
          open={showError}
          onClose={() => setShowError(false)}
        />

        {content}
      </Box>
      <Fab
        color="primary"
        aria-label="nova loja"
        onClick={handleCreateStore}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default MyStores;
