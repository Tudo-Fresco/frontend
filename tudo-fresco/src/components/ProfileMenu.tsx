import React, { useState } from 'react';
import { Avatar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/AuthService';

interface ProfileMenuProps {
  user: {
    profile_picture?: string;
    name?: string;
  };
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const profilePictureUrl = user.profile_picture
    ? `/api/${user.profile_picture}`
    : null;

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    const initials = names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : names[0][0];
    return initials.toUpperCase();
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="large"
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          src={profilePictureUrl || undefined}
          alt={user.name || 'Usuário'}
          sx={{ width: 40, height: 40 }}
        >
          {!profilePictureUrl && getInitials(user.name)}
        </Avatar>
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { minWidth: 200 },
        }}
      >
        <MenuItem onClick={handleEditProfile}>
          <Typography variant="body2">Editar Perfil</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography variant="body2">Sair</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;