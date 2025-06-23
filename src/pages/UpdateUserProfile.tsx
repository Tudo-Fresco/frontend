import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Avatar,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { Visibility, VisibilityOff, Upload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  getSignedProfilePictureUrl,
  uploadProfilePicture,
  updateUserProfile,
} from '../services/UserService';
import { getUserId } from '../services/AuthService';
import ErrorBanner from '../components/ErrorBanner';
import Header from '../components/Header';
import { GenderType } from '../enums/GenderType'; // Make sure this enum exists

const UpdateUserProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    current_password: '',
    date_of_birth: '',
    gender: '' as GenderType,
    phone_number: '',
  });

  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setFormData((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          date_of_birth: user.date_of_birth,
          gender: user.gender,
          phone_number: user.phone_number,
        }));
        const signedUrl = await getSignedProfilePictureUrl();
        setProfilePictureUrl(signedUrl);
      } catch (err: any) {
        setError(err.message ?? 'Erro ao carregar perfil.');
        setShowError(true);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleTogglePasswordConfirmation = () => setShowPasswordConfirmation((prev) => !prev);

  const handleFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await uploadProfilePicture(file);
        const newSignedUrl = await getSignedProfilePictureUrl();
        setProfilePictureUrl(newSignedUrl);
      } catch (err: any) {
        setError(err.message ?? 'Erro ao enviar imagem de perfil.');
        setShowError(true);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);

    if (formData.password && formData.password !== formData.password_confirmation) {
      setError('As senhas não coincidem.');
      setShowError(true);
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile({
        uuid: getUserId(),
        name: formData.name,
        email: formData.email,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        phone_number: formData.phone_number,
        password: formData.password || undefined,
        current_password: formData.current_password || undefined,
      });

      window.location.href = '/my-stores';
    } catch (err: any) {
      setError(err.message ?? 'Erro ao atualizar perfil.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Header />
        <Typography variant="h6" align="center" mt={2}>Atualize seu perfil</Typography>

        <ErrorBanner message={error} open={showError} onClose={() => setShowError(false)} />

        <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfilePicChange}
          />
          <Box
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
            onClick={handleFileSelect}
            sx={{ position: 'relative', cursor: 'pointer' }}
          >
            <Avatar
              src={profilePictureUrl}
              sx={{ width: 140, height: 140, margin: '0 auto' }}
            />
            {isHoveringAvatar && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '50%',
                  color: 'white',
                  fontSize: 14,
                }}
              >
                <Upload sx={{ mr: 1 }} fontSize="small" /> Alterar
              </Box>
            )}
          </Box>
        </Box>

        <TextField
          label="Nome"
          name="name"
          fullWidth
          required
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
        />

        <TextField
          label="E-mail"
          name="email"
          type="email"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />

        <TextField
          label="Data de nascimento"
          name="date_of_birth"
          type="date"
          fullWidth
          required
          value={formData.date_of_birth}
          onChange={handleChange}
          disabled={isLoading}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Telefone"
          name="phone_number"
          fullWidth
          required
          value={formData.phone_number}
          onChange={handleChange}
          disabled={isLoading}
        />

        <TextField
          label="Gênero"
          name="gender"
          fullWidth
          required
          select
          value={formData.gender}
          onChange={handleChange}
          disabled={isLoading}
        >
          <MenuItem value="MALE">Masculino</MenuItem>
          <MenuItem value="FEMALE">Feminino</MenuItem>
          <MenuItem value="OTHER">Outro</MenuItem>
        </TextField>

        <TextField
          label="Senha atual"
          name="current_password"
          type="password"
          fullWidth
          value={formData.current_password}
          onChange={handleChange}
          disabled={isLoading}
        />

        <TextField
          label="Nova senha"
          name="password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
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
          label="Confirmar nova senha"
          name="password_confirmation"
          type={showPasswordConfirmation ? 'text' : 'password'}
          fullWidth
          value={formData.password_confirmation}
          onChange={handleChange}
          disabled={isLoading}
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

        <Button
          variant="contained"
          type="submit"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Salvar alterações
        </Button>
      </Box>
    </Container>
  );
};

export default UpdateUserProfile;
