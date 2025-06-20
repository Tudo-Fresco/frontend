import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import ProfileMenu from './ProfileMenu';

const Header: React.FC = () => {
  const navigate = useNavigate();

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
        height: 64,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1300,
        backgroundColor: '#e8f5e9',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
      }}
    >
      <Box>
        <IconButton edge="start" onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>
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

      <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Logo />
      </Box>

      <Box sx={{ pl: 1 }}>
        <ProfileMenu />
      </Box>
    </Box>
  );
};

export default Header;
