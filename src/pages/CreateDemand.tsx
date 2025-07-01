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
import { ProductType } from '../enums/ProductType';
import SuccessBanner from '../components/SuccessBanner';
import ErrorBanner from '../components/ErrorBanner';
import Header from '../components/Header';

const filter = createFilterOptions<
  ProductResponseModel | { inputValue: string; isNew: boolean }
>();

const getDescriptionPlaceholderByProductType = (type: ProductType | undefined): string => {
  switch (type) {
    case ProductType.VEGETABLE:
    case ProductType.ROOT_VEGETABLE:
      return 'Ex: Preferência por entregas matinais para manter os vegetais frescos.';
    case ProductType.FRUIT:
      return 'Ex: Frutas maduras, se possível entregues semanalmente.';
    case ProductType.EGG:
      return 'Ex: Ovos caipiras com validade mínima de 7 dias.';
    case ProductType.DAIRY:
      return 'Ex: Laticínios devem ser refrigerados e entregues em até 24h.';
    case ProductType.BEEF:
    case ProductType.PORK:
    case ProductType.WHITE_MEAT:
      return 'Ex: Cortes embalados a vácuo, entregues sob refrigeração.';
    case ProductType.SEAFOOD:
    case ProductType.SEAWEED:
      return 'Ex: Entrega com isopor e gelo para preservar o frescor.';
    case ProductType.SPICE:
    case ProductType.HERB:
      return 'Ex: Embalagem hermética para preservar aroma e frescor.';
    case ProductType.NUT:
      return 'Ex: Castanhas cruas ou torradas, sem sal.';
    case ProductType.GRAIN:
      return 'Ex: Preferência por grãos a granel ou embalagens sustentáveis.';
    case ProductType.MUSHROOM:
      return 'Ex: Cogumelos frescos, colhidos no mesmo dia da entrega.';
    case ProductType.PROCESSED_MEAT:
    case ProductType.PRESERVED_MEAT:
    case ProductType.PRESERVED_PRODUCT:
      return 'Ex: Produtos com validade mínima de 15 dias e bem lacrados.';
    case ProductType.ANY:
    default:
      return 'Ex: Preferir por entregas matinais, para manter os produtos frescos.';
  }
};

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
    minimum_count: 1,
    description: '',
    deadline: new Date().toISOString().slice(0, 16), // "yyyy-MM-ddTHH:mm"
    status: DemandStatus.OPENED,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [disableForm, setDisableForm] = useState(false);
  const [loading, setLoading] = useState(false);

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
      [name]: ['needed_count', 'minimum_count'].includes(name)
        ? parseInt(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      setErrorMessage('Você precisa selecionar um produto');
      setShowError(true);
      return;
    }

    // Optional: Validate deadline is future date/time
    if (new Date(demandData.deadline) <= new Date()) {
      setErrorMessage('O prazo deve ser uma data futura');
      setShowError(true);
      return;
    }

    setDisableForm(true);
    setLoading(true);

    try {
      await createDemand({
        ...demandData,
        product_uuid: selectedProduct.uuid,
        deadline: new Date(demandData.deadline).toISOString(),
      });
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
        <Header />

        <Typography
          variant="h9"
          fontWeight={100}
          color="text.primary"
          align="center"
          sx={{ mt: 2 }}
        >
          Nova demanda
        </Typography>

        <fieldset
          disabled={disableForm}
          style={{
            border: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
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
              if (typeof option === 'string') return option;
              if ('isNew' in option && option.isNew)
                return `Cadastrar novo produto "${option.inputValue}"`;
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
                  <li
                    {...props}
                    style={{
                      fontStyle: 'italic',
                      fontWeight: 'bold',
                      color: '#1976d2',
                    }}
                  >
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

          {/* Quantities stacked */}
          <TextField
            label="Quantidade desejada"
            name="needed_count"
            type="number"
            value={demandData.needed_count}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Quantidade mínima para entrega"
            name="minimum_count"
            type="number"
            value={demandData.minimum_count}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Descrição"
            name="description"
            value={demandData.description}
            onChange={handleChange}
            placeholder={getDescriptionPlaceholderByProductType(selectedProduct?.type)}
            fullWidth
            multiline
            minRows={3}
          />

          <TextField
            label="Prazo"
            name="deadline"
            type="datetime-local"
            value={demandData.deadline}
            onChange={handleChange}
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
