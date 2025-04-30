import React, { useEffect } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SuccessBannerProps {
  message: string;
  onClose: () => void;
  onFinished: () => void;
  open: boolean;
}

const SuccessBanner: React.FC<SuccessBannerProps> = ({ message, onClose, onFinished, open }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onFinished();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onFinished]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3500}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        severity="success"
        variant="filled"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              onClose();
              onFinished();
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessBanner;
