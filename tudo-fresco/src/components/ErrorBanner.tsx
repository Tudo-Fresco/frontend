// src/components/ErrorBanner.tsx
import React from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ErrorBannerProps {
  message: string;
  onClose: () => void;
  open: boolean;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose, open }) => {
  return (
    <Collapse in={open}>
      <Alert
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {message}
      </Alert>
    </Collapse>
  );
};

export default ErrorBanner;
