import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services/UserService';
import ErrorBanner from '../components/ErrorBanner';
import { UserRequestModel } from '../models/UserRequestModel';

interface FormData {
  name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    date_of_birth: '',
    gender: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const formatDateMask = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (!name) return;

    if (name === 'phone_number') {
      setFormData((prev) => ({ ...prev, [name]: formatPhoneNumber(value as string) }));
    } else if (name === 'date_of_birth') {
      setFormData((prev) => ({ ...prev, [name]: formatDateMask(value as string) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value as string }));
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleTogglePasswordConfirmation = () => {
    setShowPasswordConfirmation((prev) => !prev);
  };

  const convertDate = (date: string): string => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const validateDateOfBirth = (date: string): boolean => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/;
    if (!regex.test(date)) return false;
    const [day, month, year] = date.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return (
      dateObj.getDate() === day &&
      dateObj.getMonth() + 1 === month &&
      dateObj.getFullYear() === year
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);

    if (formData.password !== formData.password_confirmation) {
      setError('As senhas não coincidem.');
      setShowError(true);
      return;
    }

    if (!validateDateOfBirth(formData.date_of_birth)) {
      setError('A data de nascimento é inválida.');
      setShowError(true);
      return;
    }

    try {
      const userRequest: UserRequestModel = {
        name: formData.name,
        email: formData.email,
        date_of_birth: convertDate(formData.date_of_birth),
        gender: formData.gender,
        phone_number: formData.phone_number,
        password: formData.password,
      };

      await signUp(userRequest);
      navigate('/login');
    } catch (err: any) {
      setError(err.message ?? 'O cadastro falhou');
      setShowError(true);
    }
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Logo />
        </Box>

        <Typography variant="subtitle1" textAlign="center" color="text.secondary">
          Cadastre-se para conectar produtores e compradores 🌱
        </Typography>

        <ErrorBanner
          message={error}
          open={showError}
          onClose={() => setShowError(false)}
        />

        <TextField
          label="Nome"
          name="name"
          type="text"
          fullWidth
          required
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          label="E-mail"
          name="email"
          type="email"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
        />

        <TextField
          label="Data de Nascimento"
          name="date_of_birth"
          type="text"
          fullWidth
          required
          value={formData.date_of_birth}
          onChange={handleChange}
          placeholder="dd/mm/aaaa"
          inputProps={{ maxLength: 10 }}
        />

        <FormControl fullWidth required>
          <InputLabel>Gênero</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            label="Gênero"
          >
            <MenuItem value="MALE">Masculino</MenuItem>
            <MenuItem value="FEMALE">Feminino</MenuItem>
            <MenuItem value="NOT_APPLICABLE">Não aplicável</MenuItem>
            <MenuItem value="NOT_KNOWN">Não informado</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Telefone"
          name="phone_number"
          type="tel"
          fullWidth
          required
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="(47) 98765-4321"
        />

        <TextField
          label="Senha"
          name="password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          required
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirmar Senha"
          name="password_confirmation"
          type={showPasswordConfirmation ? 'text' : 'password'}
          fullWidth
          required
          value={formData.password_confirmation}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordConfirmation} edge="end">
                  {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button variant="contained" color="primary" size="large" type="submit">
          Cadastrar
        </Button>

        <Typography variant="body2" textAlign="center">
          Já tem uma conta?{' '}
          <Link href="/login" onClick={() => navigate('/login')}>
            Entrar
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
