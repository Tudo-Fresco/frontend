import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, CircularProgress, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { freshFill } from '../services/AddressService';
import ErrorBanner from '../components/ErrorBanner';
import AddressRequestModel from '../models/AddressRequestModel';
import AddressResponseModel from '../models/AddressResponseModel';
import { useNavigate } from 'react-router-dom';

interface CreateAddressProps {
  onAddressSubmit: (addressData: AddressRequestModel) => void;
}

const CreateAddress: React.FC<CreateAddressProps> = ({ onAddressSubmit }) => {
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
  const [isFreshFillLoading, setIsFreshFillLoading] = useState(false);
  const [isCepFound, setIsCepFound] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const applyCepMask = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const match = numbers.match(/^(\d{0,5})(\d{0,3})$/);
    if (match) {
      const [, p1, p2] = match;
      return p1 && p2 ? `${p1}-${p2}` : p1;
    }
    return value;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const maskedValue = applyCepMask(rawValue);
    setAddressData((prev) => ({
      ...prev,
      zip_code: maskedValue,
    }));
    setIsCepFound(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFreshFill = async () => {
    if (!addressData.zip_code) {
      setError('Por favor, insira um CEP válido.');
      setShowError(true);
      return;
    }
    setIsFreshFillLoading(true);
    setShowError(false);

    try {
      const response: AddressResponseModel = await freshFill(addressData.zip_code);
      setAddressData((prev) => ({
        ...prev,
        street_address: response.street_address ?? prev.street_address,
        province: response.province ?? prev.province,
        city: response.city ?? prev.city,
        neighbourhood: response.neighbourhood ?? prev.neighbourhood,
        latitude: response.latitude ?? prev.latitude,
        longitude: response.longitude ?? prev.longitude,
        number: response.number ?? prev.number,
        additional_info: response.additional_info ?? prev.additional_info,
      }));
      setIsCepFound(true);
    } catch (err: any) {
      setError(err.message ?? 'Falha ao buscar dados do CEP. Verifique o CEP ou tente novamente.');
      setShowError(true);
      setIsCepFound(false);
    } finally {
      setIsFreshFillLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCepFound) {
      setError('Por favor, busque e valide o CEP antes de prosseguir.');
      setShowError(true);
      return;
    }
    onAddressSubmit(addressData);
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            label="CEP"
            name="zip_code"
            fullWidth
            required
            value={addressData.zip_code}
            onChange={handleCepChange}
            disabled={isFreshFillLoading}
            inputProps={{ maxLength: 9 }}
          />
          <IconButton
            onClick={handleFreshFill}
            disabled={isFreshFillLoading || !addressData.zip_code}
            color="primary"
          >
            {isFreshFillLoading ? <CircularProgress size={24} /> : <SearchIcon />}
          </IconButton>
        </Box>
        <TextField
          label="Endereço"
          name="street_address"
          fullWidth
          required
          value={addressData.street_address}
          onChange={handleChange}
          disabled={isFreshFillLoading || !isCepFound}
        />
        <TextField
          label="Número"
          name="number"
          fullWidth
          required
          value={addressData.number}
          onChange={handleChange}
          disabled={isFreshFillLoading || !isCepFound}
        />
        <TextField
          label="Complemento"
          name="additional_info"
          fullWidth
          value={addressData.additional_info}
          onChange={handleChange}
          disabled={isFreshFillLoading || !isCepFound}
        />
        <TextField
          label="Bairro"
          name="neighbourhood"
          fullWidth
          required
          value={addressData.neighbourhood}
          onChange={handleChange}
          disabled={isFreshFillLoading || !isCepFound}
        />
        <TextField
          label="Cidade"
          name="city"
          fullWidth
          required
          value={addressData.city}
          onChange={handleChange}
          disabled={isFreshFillLoading || !isCepFound}
        />
        <TextField
          label="Estado"
          name="province"
          fullWidth
          required
          value={addressData.province}
          onChange={handleChange}
          disabled={isFreshFillLoading || !isCepFound}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button onClick={() => navigate(-1)}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={isFreshFillLoading || !isCepFound}
          >
            Continuar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateAddress;