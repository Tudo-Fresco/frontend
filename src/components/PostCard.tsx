import { Box, Paper, Typography } from '@mui/material';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import PostResponseModel from '../models/PostResponseModel';

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

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: '#ffff',
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
          <Typography color="white" variant="body2" sx={{ p: 2, textAlign: 'center' }}>
            Sem imagens disponíveis para {post.product.name}
          </Typography>
        )}
      </Box>

      <Box sx={{ p: 2, backgroundColor: '#e8f5e9' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {post.product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.description || 'Sem descrição'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PostCard;
