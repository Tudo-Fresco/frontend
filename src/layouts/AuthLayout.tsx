// src/layouts/AuthLayout.tsx
import { Container, Box } from '@mui/material';
import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <Container maxWidth="xs">
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      {children}
    </Box>
  </Container>
);

export default AuthLayout;
