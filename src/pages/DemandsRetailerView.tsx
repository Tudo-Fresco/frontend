import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Pagination,
  Fab,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  CheckCircleOutline as CloseIcon,
} from '@mui/icons-material';
import { listByStore } from '../services/DemandService';
import { getDemandStatusDisplay, DemandStatus } from '../enums/DemandStatus';
import ProfileMenu from '../components/ProfileMenu';

const statusColorMap = {
  [DemandStatus.OPENED]: 'success',
  [DemandStatus.CLOSED]: 'error',
  [DemandStatus.CANCELED]: 'default',
};

const DemandsRetailerView = () => {
  const { storeUUID } = useParams();
  const navigate = useNavigate();
  const [demands, setDemands] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedDemandId, setExpandedDemandId] = useState(null);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchDemands = async () => {
      if (!storeUUID) {
        setError('ID da loja não fornecido.');
        return;
      }
      setIsLoading(true);
      try {
        const result = await listByStore(storeUUID, page, PAGE_SIZE);
        const validResult = Array.isArray(result) ? result : [];
        const filtered = validResult.filter((d) => d.status === DemandStatus.OPENED);
        const sorted = filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setDemands(sorted);
        setTotalPages(Math.ceil(filtered.length / PAGE_SIZE) || 1);
        setError('');
      } catch (error) {
        setError('Falha ao carregar demandas. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDemands();
  }, [storeUUID, page]);

  const getCountdown = (deadline) => {
    const timeDiff = new Date(deadline) - new Date();
    if (timeDiff <= 0) return 'Prazo expirado';
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${minutes}min`;
  };

  if (!storeUUID) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="body1" color="error">
          Erro: ID da loja não fornecido.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <ProfileMenu />
        <Typography variant="h6">Demandas da Loja 🛒</Typography>
      </Box>

      {error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : Array.isArray(demands) && demands.length > 0 ? (
        <Paper elevation={1} sx={{ mt: 1, borderRadius: 2 }}>
          <List disablePadding>
            {demands.map((demand, index) => (
              <ListItem
                key={demand.id || demand.uuid || index}
                divider
                button
                onClick={() =>
                  setExpandedDemandId((prev) => (prev === demand.uuid ? null : demand.uuid))
                }
              >
                <ListItemText
                  primary={
                    <>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {demand.product?.name || 'Produto desconhecido'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {demand.description || 'Sem descrição'}
                      </Typography>
                    </>
                  }
                  secondary={
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption">Total: {demand.needed_count || 'N/A'}</Typography>
                      <Typography variant="caption">Entrega mínima: {demand.minimum_count || 'N/A'}</Typography>
                      <Typography variant="caption" sx={{ color: '#f57c00' }}>
                        Prazo: {getCountdown(demand.deadline)}
                      </Typography>
                      <Chip
                        label={getDemandStatusDisplay(demand.status)}
                        color={statusColorMap[demand.status] || 'default'}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Mostrar opção de desativação para', demand.uuid);
                        }}
                        sx={{ width: 'fit-content' }}
                      />
                      {expandedDemandId === demand.uuid && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                          <IconButton
                            edge="end"
                            aria-label="editar"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/demand/update/${storeUUID}/${demand.uuid}`);
                            }}
                            sx={{ mt: 1, alignSelf: 'flex-end' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </Paper>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Nenhuma demanda encontrada para esta loja.
        </Typography>
      )}

      <Fab
        color="primary"
        aria-label="nova demanda"
        onClick={() => storeUUID && navigate(`/demands-retailer/${storeUUID}/new`)}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default DemandsRetailerView;
