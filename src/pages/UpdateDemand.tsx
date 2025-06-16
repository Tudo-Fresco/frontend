import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  Paper,
  MenuItem,
} from '@mui/material';
import { getByUUID, update } from '../services/DemandService';
import { DemandStatus, demandStatusDisplayMap, getDemandStatusDisplay } from '../enums/DemandStatus';
import DemandRequestModel from '../models/DemandRequestModel';
import DemandResponseModel from '../models/DemandResposeModel';

const UpdateDemand = () => {
  const { storeUUID, demandUUID } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<DemandRequestModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDemand = async () => {
      if (!storeUUID || !demandUUID) return setError('Parâmetros inválidos.');
      try {
        const response: DemandResponseModel = await getByUUID(demandUUID, storeUUID);

        // Transform response into request model
        const requestModel: DemandRequestModel = {
          store_uuid: response.store.uuid,
          product_uuid: response.product.uuid,
          responsible_uuid: response.responsible.uuid,
          needed_count: response.needed_count,
          description: response.description,
          deadline: response.deadline,
          status: response.status,
          minimum_count: response.minimum_count,
        };

        setForm(requestModel);
      } catch (e) {
        setError('Erro ao carregar dados da demanda.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDemand();
  }, [storeUUID, demandUUID]);

  const handleChange = (field: keyof DemandRequestModel, value: any) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form || !demandUUID) return;
    try {
      await update(demandUUID, form);
      navigate(`/demands-retailer/${storeUUID}`);
    } catch (e) {
      setError('Erro ao atualizar a demanda.');
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!form) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography color="error">{error || 'Demanda não encontrada.'}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Atualizar Demanda
        </Typography>

        <TextField
          label="Produto"
          fullWidth
          margin="normal"
          value={form.product_uuid}
          InputProps={{ readOnly: true }}
          helperText="Produto não pode ser alterado"
        />

        <TextField
          label="Descrição"
          fullWidth
          margin="normal"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />

        <TextField
          label="Quantidade Necessária"
          type="number"
          fullWidth
          margin="normal"
          value={form.needed_count}
          onChange={(e) => handleChange('needed_count', Number(e.target.value))}
        />

        <TextField
          label="Quantidade Mínima"
          type="number"
          fullWidth
          margin="normal"
          value={form.minimum_count || ''}
          onChange={(e) => handleChange('minimum_count', Number(e.target.value))}
        />

        <TextField
          label="Prazo"
          type="datetime-local"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={form.deadline.slice(0, 16)} // Format for datetime-local input
          onChange={(e) => handleChange('deadline', e.target.value)}
        />

        <TextField
          select
          label="Status"
          fullWidth
          margin="normal"
          value={form.status}
          onChange={(e) => handleChange('status', e.target.value as DemandStatus)}
        >
          {Object.entries(demandStatusDisplayMap).map(([key, label]) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button onClick={() => navigate(-1)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Atualizar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UpdateDemand;
