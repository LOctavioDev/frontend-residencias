import React from 'react';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

const Loader = ({ loading }) => {
  return (
    <Backdrop
      open={loading}
      style={{ zIndex: 9999 }}
    >
      <CircularProgress color="primary" />
      <Typography
        variant="h6"
        style={{ marginLeft: '16px' }}
      >
        Cargando...
      </Typography>
    </Backdrop>
  );
};

export default Loader;
