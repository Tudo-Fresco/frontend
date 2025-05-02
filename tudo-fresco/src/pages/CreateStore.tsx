import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, CircularProgress, MenuItem, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { create, freshFill } from '../services/StoreService';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import CreateAddress from './CreateAddress';
import { StoreRequestModel } from '../models/StoreRequestModel';
import { StoreResponseModel } from '../models/StoreResponseModel';
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
  const [isFreshFillLoading, setIsFreshFillLoading] = useState(false);
  const [isCnpjFound, setIsCnpjFound] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [addressUuid, setAddressUuid] = useState<string | null>(null);

  const storeTypeDisplayMap: Record<StoreType, string> = {
    [StoreType.SUPPLIER]: 'Produtor',
    [StoreType.RETAILER]: 'Comprador',
  };

  const formatToBrazilianDate = (isoDate: string): string => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };
  
  const applyCnpjMask = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const match = numbers.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/);
    if (match) {
      const [, p1, p2, p3, p4, p5] = match;
      let masked = '';
      if (p1) masked += p1;
      if (p2) masked += `.${p2}`;
      if (p3) masked += `.${p3}`;
      if (p4) masked += `/${p4}`;
      if (p5) masked += `-${p5}`;
      return masked;
    }
    return value;
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const maskedValue = applyCnpjMask(rawValue);
    setStoreData((prev) => ({
      ...prev,
      cnpj: maskedValue,
    }));
    // Reset CNPJ found state if user changes CNPJ
    setIsCnpjFound(false);
  };

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

  const handleFreshFill = async () => {
    if (!storeData.cnpj) {
      setError('Por favor, insira um CNPJ válido.');
      setShowError(true);
      return;
    }
    setIsFreshFillLoading(true);
    setShowError(false);

    try {
      const response: StoreResponseModel = await freshFill(storeData.cnpj);
      setStoreData((prev) => {
        let openingDate: string = prev.opening_date;
        if (response.opening_date) {
          if (response.opening_date instanceof Date) {
            openingDate = response.opening_date.toISOString().split('T')[0];
          } else if (typeof response.opening_date === 'string') {
            openingDate = response.opening_date;
          }
        }

        return {
          ...prev,
          trade_name: response.trade_name ?? prev.trade_name,
          legal_name: response.legal_name ?? prev.legal_name,
          legal_phone_contact: response.legal_phone_contact ?? prev.legal_phone_contact,
          preferred_phone_contact: response.preferred_phone_contact ?? prev.preferred_phone_contact,
          legal_email_contact: response.legal_email_contact ?? prev.legal_email_contact,
          preferred_email_contact: response.preferred_email_contact ?? prev.preferred_email_contact,
          store_type: response.store_type ?? prev.store_type,
          opening_date: openingDate,
          size: response.size ?? prev.size,
          legal_nature: response.legal_nature ?? prev.legal_nature,
          cnae_code: response.cnae_code ?? prev.cnae_code,
          branch_classification: response.branch_classification ?? prev.branch_classification,
        };
      });
      setIsCnpjFound(true);
    } catch (err: any) {
      setError(err.message ?? 'Falha ao buscar dados do CNPJ. Verifique o CNPJ ou tente novamente.');
      setShowError(true);
      setIsCnpjFound(false);
    } finally {
      setIsFreshFillLoading(false);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressUuid) {
      setError('Por favor, crie um endereço primeiro.');
      setShowError(true);
      return;
    }
    if (!isCnpjFound) {
      setError('Por favor, busque e valide o CNPJ antes de prosseguir.');
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

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="CNPJ"
                name="cnpj"
                fullWidth
                required
                value={storeData.cnpj}
                onChange={handleCnpjChange}
                disabled={isLoading || isFreshFillLoading}
                inputProps={{ maxLength: 18 }}
              />
              <IconButton
                onClick={handleFreshFill}
                disabled={isLoading || isFreshFillLoading || !storeData.cnpj}
                color="primary"
              >
                {isFreshFillLoading ? <CircularProgress size={24} /> : <SearchIcon />}
              </IconButton>
            </Box>
            <TextField
              label="Nome Fantasia"
              name="trade_name"
              fullWidth
              required
              value={storeData.trade_name}
              onChange={handleChange}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound || isCnpjFound}
            />
            <TextField
              label="Razão Social"
              name="legal_name"
              fullWidth
              required
              value={storeData.legal_name}
              onChange={handleChange}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound || isCnpjFound}
            />
            <TextField
              label="Telefone Legal"
              name="legal_phone_contact"
              fullWidth
              required
              value={storeData.legal_phone_contact}
              onChange={handleChange}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound}
            />
            <TextField
              label="Telefone Preferencial"
              name="preferred_phone_contact"
              fullWidth
              value={storeData.preferred_phone_contact}
              onChange={handleChange}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound}
            />
            <TextField
              label="Email Legal"
              name="legal_email_contact"
              fullWidth
              required
              value={storeData.legal_email_contact}
              onChange={handleChange}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound}
            />
            <TextField
              label="Email Preferencial"
              name="preferred_email_contact"
              fullWidth
              value={storeData.preferred_email_contact}
              onChange={handleChange}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound}
            />
            <TextField
              select
              label="Tipo de Loja"
              name="store_type"
              fullWidth
              required
              value={storeData.store_type}
              onChange={handleStoreTypeChange}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound}
            >
              {Object.values(StoreType).map((type) => (
                <MenuItem key={type} value={type}>
                  {storeTypeDisplayMap[type] || type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Data de Abertura"
              name="opening_date"
              fullWidth
              required
              value={formatToBrazilianDate(storeData.opening_date)}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound || isCnpjFound}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Porte"
              name="size"
              fullWidth
              required
              value={storeData.size}
              onChange={handleChange}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound || isCnpjFound}
            />
            <TextField
              label="Natureza Jurídica"
              name="legal_nature"
              fullWidth
              required
              value={storeData.legal_nature}
              onChange={handleChange}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound || isCnpjFound}
            />
            <TextField
              label="Código CNAE"
              name="cnae_code"
              fullWidth
              required
              value={storeData.cnae_code}
              onChange={handleChange}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound || isCnpjFound}
            />
            <TextField
              label="Classificação da Filial"
              name="branch_classification"
              fullWidth
              value={storeData.branch_classification}
              onChange={handleChange}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound || isCnpjFound}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={isLoading || isFreshFillLoading || !isCnpjFound}
              startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
            >
              {isLoading ? 'Salvando...' : 'Salvar Loja'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowAddressForm(true)}
              disabled={isLoading || isFreshFillLoading || !isCnpjFound}
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