import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, CircularProgress } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
import { create } from '../services/AddressService';
import ErrorBanner from '../components/ErrorBanner';
import SuccessBanner from '../components/SuccessBanner';
import AddressRequestModel from '../models/AddressRequestModel';

interface CreateAddressProps {
  onAddressCreated?: (address_uuid: string) => void;
}

const CreateAddress: React.FC<CreateAddressProps> = ({ onAddressCreated }) => {
  const navigate = useNavigate();
  const [addressData, setAddressData] = useState<AddressRequestModel>({
    zip_code: '',
    street_address: '',
    latitude: 0,
    longitude: 0,
    province: '',
    city: '',
    neighbourhood: '',
    number: '',
    additional_info: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSuccessFinished = () => {
    if (!onAddressCreated) {
      navigate('/');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);

    try {
      const response = await create(addressData);
      setShowSuccess(true);
      if (onAddressCreated && response.uuid) {
        onAddressCreated(response.uuid);
      }
    } catch (err: any) {
      setError(err.message ?? 'Falha ao criar endereço');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        component="form"
        onSubmit={handleCreate}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >

        <Typography variant="subtitle1" textAlign="center" color="text.secondary">
          Cadastre o endereço da sua empresa 📍
        </Typography>

        <ErrorBanner
          message={error}
          open={showError}
          onClose={() => setShowError(false)}
        />

        <TextField
          label="CEP"
          name="zip_code"
          fullWidth
          required
          value={addressData.zip_code}
          onChange={handleChange}
          disabled={isLoading}
        />
        <TextField
          label="Endereço"
          name="street_address"
          fullWidth
          required
          value={addressData.street_address}
          onChange={handleChange}
          disabled={isLoading}
        />
        <TextField
          label="Número"
          name="number"
          fullWidth
          required
          value={addressData.number}
          onChange={handleChange}
          disabled={isLoading}
        />
        <TextField
          label="Complemento"
          name="additional_info"
          fullWidth
          value={addressData.additional_info}
          onChange={handleChange}
          disabled={isLoading}
        />
        <TextField
          label="Bairro"
          name="neighbourhood"
          fullWidth
          required
          value={addressData.neighbourhood}
          onChange={handleChange}
          disabled={isLoading}
        />
        <TextField
          label="Cidade"
          name="city"
          fullWidth
          required
          value={addressData.city}
          onChange={handleChange}
          disabled={isLoading}
        />
        <TextField
          label="Estado"
          name="province"
          fullWidth
          required
          value={addressData.province}
          onChange={handleChange}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {isLoading ? 'Salvando...' : 'Salvar Endereço'}
        </Button>
      </Box>
      <SuccessBanner
        message="Endereço criado com sucesso!"
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        onFinished={handleSuccessFinished}
      />
    </Container>
  );
};

export default CreateAddress;