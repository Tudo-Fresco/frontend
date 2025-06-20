import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress } from '@mui/material';

import PostResponseModel from '../models/PostResponseModel';
import { getPosts } from '../services/ReelService';
import PostCard from '../components/PostCard';
import Header from '../components/Header';

const PostsSupplierView = () => {
  const { storeUUID } = useParams<{ storeUUID: string }>();
  const [posts, setPosts] = useState<PostResponseModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!storeUUID) return;
      try {
        const data = await getPosts(storeUUID);
        setPosts(data);
      } catch (err) {
        console.error('Erro ao buscar posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [storeUUID]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <Header />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center">
          Nenhum post disponível.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {posts.map((post, index) => (
            <PostCard key={post.uuid || index} post={post} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default PostsSupplierView;
