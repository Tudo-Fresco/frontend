import React from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ErrorBannerProps {
  message: string;
  onClose: () => void;
  open: boolean;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose, open }) => {
  const formattedMessage = message.split('\n').map((str, index) => (
    <span key={index}>
      {str}
      {index < message.split('\n').length - 1 && <br />}
    </span>
  ));

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
        {formattedMessage}
      </Alert>
    </Collapse>
  );
};

export default ErrorBanner;
