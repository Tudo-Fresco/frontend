import { Box, Paper, Typography, Button, Collapse, Link } from '@mui/material';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useState } from 'react';
import PostResponseModel from '../models/PostResponseModel';
import { getUnitTypeDisplay } from '../enums/UnitType';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';


interface Props {
  post: PostResponseModel;
}

const PostCard = ({ post }: Props) => {
  const images = post.product.images || [];
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
    },
  });

  const [showContact, setShowContact] = useState(false);
  const store = post.store;

  const deadlineDate = new Date(post.deadline);
  const datePart = deadlineDate.toLocaleDateString('pt-BR');
  const timePart = deadlineDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedDeadline = `${datePart} às ${timePart}`;

  const unitDisplay = getUnitTypeDisplay(post.product.unit_type);

  const companyName = store.trade_name || 'sua empresa';
  const productName = post.product.name;
  const message = `Olá, vi o seu produto *${productName}* da empresa *${companyName}* na plataforma e estou interessado. Estou aberto(a) para negociação.`;

  const whatsappLink = store.preferred_phone_contact
    ? `https://wa.me/${store.preferred_phone_contact.replace(/\D/g, '')}?text=${encodeURIComponent(
      message
    )}`
    : '';

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      <Box
        ref={images.length > 1 ? sliderRef : undefined}
        className={images.length > 1 ? 'keen-slider' : undefined}
        sx={{
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {images.length > 0 ? (
          images.map((url, i) => (
            <Box
              key={i}
              className={images.length > 1 ? 'keen-slider__slide' : undefined}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={url}
                alt={`Imagem ${i + 1}`}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          ))
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              color: 'gray',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              px: 2,
            }}
          >
            <ImageNotSupportedOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="body2">
              Sem imagens disponíveis para <strong>{post.product.name}</strong>
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, backgroundColor: '#e8f5e9' }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
          {productName}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {post.description || 'Sem descrição'}
        </Typography>

        <Typography variant="body2" sx={{ mb: 0.5 }}>
          📦 <strong>Mínimo para venda:</strong> {post.minimum_count} ({unitDisplay})
        </Typography>

        <Typography variant="body2" sx={{ mb: 0.5 }}>
          🎯 <strong>Necessidade total:</strong> {post.needed_count} ({unitDisplay})
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          🗓️ <strong>Prazo:</strong> {formattedDeadline}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={() => setShowContact((prev) => !prev)}
        >
          Entrar em contato
        </Button>

        <Collapse in={showContact}>
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f1f8e9', borderRadius: 2 }}>
            {store.preferred_email_contact && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                📧{' '}
                <Link
                  href={`mailto:${store.preferred_email_contact}`}
                  underline="hover"
                  color="primary"
                >
                  {store.preferred_email_contact}
                </Link>
              </Typography>
            )}

            {store.preferred_phone_contact && (
              <Typography variant="body2">
                📱{' '}
                <Link
                  href={whatsappLink}
                  underline="hover"
                  color="primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {store.preferred_phone_contact} (WhatsApp)
                </Link>
              </Typography>
            )}
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default PostCard;
