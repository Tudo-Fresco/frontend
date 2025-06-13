import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Autocomplete
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { search } from '../services/ProductService';
import { create as createDemand } from '../services/DemandService';
import { decodeToken } from '../services/TokenService';
import DemandRequestModel from '../models/DemandRequestModel';
import ProductResponseModel from '../models/ProductResponseModel';
import { DemandStatus } from '../enums/DemandStatus';
import ProfileMenu from '../components/ProfileMenu';

const CreateDemand: React.FC = () => {
  const { storeUUID } = useParams<{ storeUUID: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductResponseModel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponseModel | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const [demandData, setDemandData] = useState<DemandRequestModel>({
    store_uuid: storeUUID ?? '',
    product_uuid: '',
    responsible_uuid: decodeToken()?.sub ?? '',
    needed_count: 1,
    description: '',
    deadline: new Date().toISOString(),
    status: DemandStatus.OPENED,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleProductSearch = async (term: string) => {
    setIsSearching(true);
    try {
      const results = await search(term);
      setProducts(results);
    } catch (err: any) {
      setErrorMessage('Erro ao buscar produtos');
      setShowError(true);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchInput.length >= 2) {
      handleProductSearch(searchInput);
    }
  }, [searchInput]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDemandData((prev) => ({
      ...prev,
      [name]: name === 'needed_count' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      setErrorMessage('Você precisa selecionar um produto');
      setShowError(true);
      return;
    }

    try {
      await createDemand({ ...demandData, product_uuid: selectedProduct.uuid });
      setShowSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    } catch (err: any) {
      setErrorMessage('Erro ao criar demanda');
      setShowError(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <ProfileMenu />
        <Typography variant="h6" textAlign="center">
          Criar Nova Demanda 📦
        </Typography>

        <Autocomplete
          options={products}
          getOptionLabel={(option) => option.name}
          loading={isSearching}
          onInputChange={(_, value) => setSearchInput(value)}
          onChange={(_, value) => setSelectedProduct(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Produto"
              fullWidth
              required
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <TextField
          label="Quantidade Necessária"
          name="needed_count"
          type="number"
          value={demandData.needed_count}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Descrição"
          name="description"
          value={demandData.description}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          label="Prazo"
          name="deadline"
          type="datetime-local"
          value={demandData.deadline.slice(0, 16)}
          onChange={(e) =>
            setDemandData((prev) => ({
              ...prev,
              deadline: new Date(e.target.value).toISOString(),
            }))
          }
          required
          fullWidth
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Criar Demanda
        </Button>
      </Box>

      <Snackbar open={showSuccess} autoHideDuration={3000}>
        <Alert severity="success">Demanda criada com sucesso!</Alert>
      </Snackbar>

      <Snackbar open={showError} autoHideDuration={3000} onClose={() => setShowError(false)}>
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateDemand;
