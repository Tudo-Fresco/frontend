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
  Fab,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { listByStore } from '../services/DemandService';
import { getDemandStatusDisplay, DemandStatus } from '../enums/DemandStatus';
import Header from '../components/Header';


const statusColorMap = {
  [DemandStatus.OPENED]: 'warning',
  [DemandStatus.CLOSED]: 'success',
  [DemandStatus.CANCELED]: 'default',
};

const PAGE_SIZE = 5;

const DemandsRetailerView = () => {
  const { storeUUID } = useParams();
  const navigate = useNavigate();
  const [demands, setDemands] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<DemandStatus>(DemandStatus.OPENED);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchDemands = async () => {
      if (!storeUUID) return setError('ID da loja não fornecido.');

      setIsLoading(true);
      try {
        const result = await listByStore(storeUUID, page, PAGE_SIZE, 10000, 'ANY', statusFilter);
        const demandsArray = Array.isArray(result) ? result : [];
        setDemands(demandsArray);
        setHasMore(demandsArray.length === PAGE_SIZE);
        setError('');
      } catch {
        setError('Falha ao carregar demandas. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemands();
  }, [storeUUID, page, statusFilter]);

  const getCountdown = (deadline: string) => {
    const timeDiff = new Date(deadline).getTime() - new Date().getTime();
    if (timeDiff <= 0) return 'Prazo expirado';
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${minutes}min`;
  };

  return (
    <Box>
      <Header/>
      <Container maxWidth="sm" sx={{ mt: '80px', mb: 8 }}>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="status-filter-label">Filtrar por status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Filtrar por status"
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value as DemandStatus);
            }}
          >
            <MenuItem value={DemandStatus.ANY}>Todos</MenuItem>
            <MenuItem value={DemandStatus.OPENED}>Aberto</MenuItem>
            <MenuItem value={DemandStatus.CANCELED}>Cancelado</MenuItem>
            <MenuItem value={DemandStatus.CLOSED}>Fechado</MenuItem>
          </Select>
        </FormControl>

        {error ? (
          <Typography variant="body1" color="error">{error}</Typography>
        ) : isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={1} sx={{ mt: 1, borderRadius: 2 }}>
            <List disablePadding>
              {demands.map((demand, index) => (
                <ListItem
                  key={demand.id || demand.uuid || index}
                  divider
                  button
                  onClick={() => navigate(`/demand/update/${storeUUID}/${demand.uuid}`)}
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
                        <Typography variant="caption">Total: {demand.needed_count}</Typography>
                        <Typography variant="caption">Entrega mínima: {demand.minimum_count}</Typography>
                        <Typography variant="caption" sx={{ color: '#f57c00' }}>
                          Prazo em: {getCountdown(demand.deadline)}
                        </Typography>
                        <Typography variant="caption">
                          Prazo final: {new Date(demand.deadline).toLocaleString('pt-BR')}
                        </Typography>
                        <Chip
                          label={getDemandStatusDisplay(demand.status)}
                          color={statusColorMap[demand.status] || 'default'}
                          size="small"
                          sx={{ width: 'fit-content', mt: 1 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 2 }}>
              <Button
                variant="outlined"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outlined"
                disabled={!hasMore}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Próximo
              </Button>
            </Box>
          </Paper>
        )}

        <Fab
          color="primary"
          aria-label="nova demanda"
          onClick={() => storeUUID && navigate(`/demand/${storeUUID}`)}
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
};

export default DemandsRetailerView;
