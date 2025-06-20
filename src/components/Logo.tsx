import React from 'react';
import { Box } from '@mui/material';
import logo from '../assets/logo.png';

interface LogoProps {
  size?: number; // default to 40 if not provided
}

const Logo: React.FC<LogoProps> = ({ size = 40 }) => (
  <Box
    component="img"
    src={logo}
    alt="Tudo Fresco Logo"
    sx={{
      width: size,
      height: size,
      borderRadius: '50%',
      objectFit: 'cover',
    }}
  />
);

export default Logo;
