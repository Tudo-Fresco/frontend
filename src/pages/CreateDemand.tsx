import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useParams, useNavigate } from 'react-router-dom';
import { search } from '../services/ProductService';
import { create as createDemand } from '../services/DemandService';
import { decodeToken } from '../services/TokenService';
import DemandRequestModel from '../models/DemandRequestModel';
import ProductResponseModel from '../models/ProductResponseModel';
import { DemandStatus } from '../enums/DemandStatus';
import ProfileMenu from '../components/ProfileMenu';
import SuccessBanner from '../components/SuccessBanner';   // <-- import success banner
import ErrorBanner from '../components/ErrorBanner';       // <-- import error banner

const filter = createFilterOptions<
  ProductResponseModel | { inputValue: string; isNew: boolean }
>();

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
  
  const [disableForm, setDisableForm] = useState(false); // <-- lock form inputs while submitting
  const [loading, setLoading] = useState(false);         // <-- loading spinner for submit button

  const handleProductSearch = async (term: string) => {
    setIsSearching(true);
    try {
      const results = await search(term);
      setProducts(results);
    } catch {
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

    setDisableForm(true);
    setLoading(true);

    try {
      await createDemand({ ...demandData, product_uuid: selectedProduct.uuid });
      setShowSuccess(true);
      setTimeout(() => navigate(-1), 1500);
    } catch {
      setErrorMessage('Erro ao criar demanda');
      setShowError(true);
    } finally {
      setLoading(false);
      setDisableForm(false);
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

        <fieldset
          disabled={disableForm}
          style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <Autocomplete
            freeSolo
            options={products}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              const isExisting = options.some(
                (option) =>
                  'search_name' in option &&
                  option.search_name.toLowerCase() === inputValue.toLowerCase()
              );

              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  isNew: true,
                } as any);
              }

              return filtered;
            }}
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                return option;
              }
              if ('isNew' in option && option.isNew) {
                return `Cadastrar novo produto "${option.inputValue}"`;
              }
              return option.search_name;
            }}
            loading={isSearching}
            onInputChange={(_, value) => setSearchInput(value)}
            onChange={(_, value) => {
              if (value && typeof value !== 'string' && 'isNew' in value && value.isNew) {
                navigate(`/product?name=${encodeURIComponent(value.inputValue)}`);
              } else {
                setSelectedProduct(value as ProductResponseModel | null);
              }
            }}
            renderOption={(props, option) => {
              if (typeof option !== 'string' && 'isNew' in option && option.isNew) {
                return (
                  <li {...props} style={{ fontStyle: 'italic', fontWeight: 'bold', color: '#1976d2' }}>
                    <AddCircleOutlineIcon fontSize="small" style={{ marginRight: 8 }} />
                    {`Cadastrar novo produto "${option.inputValue}"`}
                  </li>
                );
              }
              return <li {...props}>{option.search_name}</li>;
            }}
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={() => navigate(-1)} disabled={disableForm}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={disableForm}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Demanda'}
            </Button>
          </Box>
        </fieldset>
      </Box>

      <SuccessBanner
        open={showSuccess}
        message="Demanda criada com sucesso!"
        onClose={() => setShowSuccess(false)}
        onFinished={() => navigate(-1)}
      />

      <ErrorBanner
        open={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </Container>
  );
};

export default CreateDemand;
