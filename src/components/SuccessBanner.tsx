import React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SuccessBannerProps {
  message: string;
  onClose: () => void;
  onFinished: () => void;
  open: boolean;
}

const SuccessBanner: React.FC<SuccessBannerProps> = ({
  message,
  onClose,
  onFinished,
  open,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3500}
      onClose={(_, reason) => {
        if (reason !== 'clickaway') {
          onClose();
          onFinished();
        }
      }}
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
