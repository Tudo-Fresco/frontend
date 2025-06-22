import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { create, uploadProductImage } from '../services/ProductService';
import { UnitType, unitTypeDisplayMap } from '../enums/UnitType';
import { ProductType, productTypeDisplayMap } from '../enums/ProductType';
import SuccessBanner from '../components/SuccessBanner';
import ErrorBanner from '../components/ErrorBanner';
import Header from '../components/Header';

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

  const [createdProductUuid, setCreatedProductUuid] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setShowSuccess(false);
    setUploadError('');
    setUploadSuccess(false);
    setSelectedFile(null);
    setCreatedProductUuid(null);

    try {
      const createdProduct = await create({
        name,
        unit_type: unitType,
        type: productType,
        images: [],
        search_name: name.toLowerCase(),
        uuid: '',
        created_at: '',
        updated_at: '',
      });

      setCreatedProductUuid(createdProduct.uuid);
      setSuccessMessage('Produto cadastrado com sucesso!');
      setShowSuccess(true);

      setShowUploadDialog(true);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Erro ao criar produto.');
    } finally {
      setLoading(false);
    }
  };

  const disableForm = loading || showSuccess || uploading;

  const handleUpload = async () => {
    if (!selectedFile || !createdProductUuid) return;

    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      await uploadProductImage(createdProductUuid, selectedFile);
      setUploadSuccess(true);
      setShowUploadDialog(false);
      navigate(-1);
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || 'Erro ao enviar imagem.');
    } finally {
      setUploading(false);
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
        <Typography variant="h6" textAlign="center">
          Cadastrar Produto
        </Typography>

        <SuccessBanner
          message={successMessage}
          open={showSuccess}
          onClose={() => setShowSuccess(false)}
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
            <Button
              onClick={() => navigate(-1)}
              disabled={disableForm}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!name || disableForm}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar Produto'}
            </Button>
          </Box>
        </fieldset>
      </Box>

      <Dialog
        open={showUploadDialog}
        onClose={() => {
          if (!uploading) {
            setShowUploadDialog(false);
            navigate(-1);
          }
        }}
        fullWidth
        maxWidth="xs"
        disableEscapeKeyDown={true}
        BackdropProps={{ onClick: (e) => e.stopPropagation() }}
      >
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            paddingTop: 3,
            px: 2,
          }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
            disabled={uploading}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {selectedFile ? 'Alterar imagem' : 'Escolher imagem'}
          </Button>

          {selectedFile && (
            <Typography variant="body2" noWrap>
              Arquivo selecionado: {selectedFile.name}
            </Typography>
          )}

          {uploadError && (
            <Typography color="error" variant="body2">
              {uploadError}
            </Typography>
          )}
          {uploadSuccess && (
            <Typography color="success.main" variant="body2">
              Imagem enviada com sucesso!
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            onClick={() => {
              if (!uploading) {
                setShowUploadDialog(false);
                navigate(-1);
              }
            }}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            sx={{ minWidth: 100 }}
          >
            {uploading ? <CircularProgress size={24} color="inherit" /> : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateProduct;
