import React, { useState, useEffect } from 'react';
import { Avatar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/AuthService';
import { getCurrentUser, getSignedProfilePictureUrl } from '../services/UserService'; // Import the service functions
import { UserResponseModel } from '../models/UserResponseModel';

const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<UserResponseModel | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        const signedUrl = await getSignedProfilePictureUrl();
        setProfilePictureUrl(signedUrl);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

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
          alt={user?.name || 'Usuário'}
          sx={{ width: 40, height: 40 }}
        >
          {!profilePictureUrl && getInitials(user?.name)}
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