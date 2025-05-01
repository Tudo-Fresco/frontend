import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, CircularProgress, MenuItem } from '@mui/material';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { create } from '../services/StoreService';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import CreateAddress from './CreateAddress';
import { StoreRequestModel } from '../models/StoreRequestModel';
import { StoreType } from '../enums/StoreType';

const CreateStore = () => {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<StoreRequestModel>({
    cnpj: '',
    trade_name: '',
    legal_name: '',
    legal_phone_contact: '',
    preferred_phone_contact: '',
    legal_email_contact: '',
    preferred_email_contact: '',
    address_uuid: '',
    store_type: StoreType.SUPPLIER,
    opening_date: '',
    size: '',
    legal_nature: '',
    cnae_code: '',
    images: [],
    branch_classification: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [addressUuid, setAddressUuid] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStoreTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreData((prev) => ({
      ...prev,
      store_type: e.target.value as StoreType,
    }));
  };

  const handleAddressCreated = (address_uuid: string) => {
    setAddressUuid(address_uuid);
    setStoreData((prev) => ({
      ...prev,
      address_uuid,
    }));
    setShowAddressForm(false);
  };

  const handleSuccessFinished = () => {
    navigate('/');
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressUuid) {
      setError('Por favor, crie um endereço primeiro.');
      setShowError(true);
      return;
    }
    setIsLoading(true);
    setShowError(false);

    try {
      await create(storeData);
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message ?? 'Falha ao criar loja');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Logo />
        </Box>

        <Typography variant="subtitle1" textAlign="center" color="text.secondary">
          Cadastre sua loja 🏬
        </Typography>

        {showAddressForm ? (
          <CreateAddress onAddressCreated={handleAddressCreated} />
        ) : (
          <Box
            component="form"
            onSubmit={handleCreateStore}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <ErrorBanner
              message={error}
              open={showError}
              onClose={() => setShowError(false)}
            />

            <TextField
              label="CNPJ"
              name="cnpj"
              fullWidth
              required
              value={storeData.cnpj}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              label="Nome Fantasia"
              name="trade_name"
              fullWidth
              required
              value={storeData.trade_name}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              label="Razão Social"
              name="legal_name"
              fullWidth
              required
              value={storeData.legal_name}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              label="Telefone Legal"
              name="legal_phone_contact"
              fullWidth
              required
              value={storeData.legal_phone_contact}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              label="Telefone Preferencial"
              name="preferred_phone_contact"
              fullWidth
              value={storeData.preferred_phone_contact}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              label="Email Legal"
              name="legal_email_contact"
              fullWidth
              required
              value={storeData.legal_email_contact}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              label="Email Preferencial"
              name="preferred_email_contact"
              fullWidth
              value={storeData.preferred_email_contact}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              select
              label="Tipo de Loja"
              name="store_type"
              fullWidth
              required
              value={storeData.store_type}
              onChange={handleStoreTypeChange}
              disabled={isLoading}
            >
              {Object.values(StoreType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Data de Abertura"
              name="opening_date"
              type="date"
              fullWidth
              required
              value={storeData.opening_date}
              onChange={handleChange}
              disabled={isLoading}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Tamanho (m²)"
              name="size"
              fullWidth
              required
              value={storeData.size}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              label="Natureza Jurídica"
              name="legal_nature"
              fullWidth
              required
              value={storeData.legal_nature}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              label="Código CNAE"
              name="cnae_code"
              fullWidth
              required
              value={storeData.cnae_code}
              onChange={handleChange}
              disabled={isLoading}
            />
            <TextField
              label="Classificação da Filial"
              name="branch_classification"
              fullWidth
              value={storeData.branch_classification}
              onChange={handleChange}
              disabled={isLoading}
            />
            {/* Note: images field omitted for simplicity; add file input if needed */}

            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
            >
              {isLoading ? 'Salvando...' : 'Salvar Loja'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowAddressForm(true)}
              disabled={isLoading}
            >
              Alterar Endereço
            </Button>
          </Box>
        )}

        <SuccessBanner
          message="Loja criada com sucesso!"
          open={showSuccess}
          onClose={() => setShowSuccess(false)}
          onFinished={handleSuccessFinished}
        />
      </Box>
    </Container>
  );
};

export default CreateStore;