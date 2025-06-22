import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import ProfileMenu from './ProfileMenu';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleNavigateToStores = () => {
    handleClose();
    navigate('/my-stores');
  };

  const handleGoBack = () => {
    handleClose();
    navigate(-1);
  };

  return (
    <Box
      component="header"
      sx={{
        width: '100%',
        height: { xs: 64, sm: 72, md: 77 },
        px: { xs: 1, sm: 2 },
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1300,
        backgroundColor: '#e8f5e9',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ width: 60, display: 'flex', alignItems: 'center' }}>
        <IconButton
          edge="start"
          onClick={handleMenuClick}
          size={isMobile ? 'small' : 'medium'}
        >
          <MenuIcon fontSize={isMobile ? 'small' : 'medium'} />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <Logo size={isMobile ? 65 : 80} />
      </Box>

      <Box sx={{ width: 60, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <ProfileMenu />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={handleNavigateToStores}>Minhas lojas</MenuItem>
        <MenuItem onClick={handleGoBack}>Página anterior</MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;
