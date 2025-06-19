import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { create } from '../services/ProductService';
import { UnitType, unitTypeDisplayMap } from '../enums/UnitType';
import { ProductType, productTypeDisplayMap } from '../enums/ProductType';
import SuccessBanner from '../components/SuccessBanner';
import ErrorBanner from '../components/ErrorBanner';
import ProfileMenu from '../components/ProfileMenu';

const CreateProduct: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialName = searchParams.get('name') || '';

  const [name, setName] = useState(initialName);
  const [unitType, setUnitType] = useState<UnitType>(UnitType.PIECE);
  const [productType, setProductType] = useState<ProductType>(ProductType.VEGETABLE);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const returnToCreateDemand = () => {
    navigate(-1);
  };

  const handleSuccessFinished = () => {
    returnToCreateDemand();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    try {
      await create({
        name,
        unit_type: unitType,
        type: productType,
        images: [],
        search_name: name.toLowerCase(),
        uuid: '',
        created_at: '',
        updated_at: '',
      });

      setSuccessMessage('Produto cadastrado com sucesso!');
      setShowSuccess(true);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Erro ao criar produto.');
    } finally {
      setLoading(false);
    }
  };

  // Disable form while loading or showing success banner
  const disableForm = loading || showSuccess;

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <ProfileMenu />
        <Typography variant="h6" textAlign="center">
          Cadastrar Produto
        </Typography>

        <SuccessBanner
          message={successMessage}
          open={showSuccess}
          onClose={() => setShowSuccess(false)}
          onFinished={handleSuccessFinished}
        />

        <ErrorBanner
          message={errorMessage}
          open={!!errorMessage}
          onClose={() => setErrorMessage('')}
        />

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
          <TextField
            label="Nome do Produto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Tipo de Unidade"
            value={unitType}
            onChange={(e) => setUnitType(e.target.value as UnitType)}
            select
            fullWidth
            required
          >
            {Object.values(UnitType).map((type) => (
              <MenuItem key={type} value={type}>
                {unitTypeDisplayMap[type]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Tipo de Produto"
            value={productType}
            onChange={(e) => setProductType(e.target.value as ProductType)}
            select
            fullWidth
            required
          >
            {Object.values(ProductType).map((type) => (
              <MenuItem key={type} value={type}>
                {productTypeDisplayMap[type]}
              </MenuItem>
            ))}
          </TextField>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={() => navigate(-1)} disabled={disableForm}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" type="submit" disabled={!name || disableForm}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Produto'}
            </Button>
          </Box>
        </fieldset>
      </Box>
    </Container>
  );
};

export default CreateProduct;
