import { useState, useContext } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const nav = useNavigate();

  const handleLoginSuccess = async (response) => {
    const { credential } = response;
    console.log(response);
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:11111/auth/googleAuth', {
        tokenId: credential,
      });

      const { token, user } = res.data;
      login(token);
      sessionStorage.setItem('user', JSON.stringify(user));

      setLoading(false);
      nav('/');
    } catch (error) {
      console.error('Error during Google authentication:', error);
      setLoading(false);

      if (error.response && error.response.status === 403) {
        setSnackbarMessage(error.response.data.error);
      } else {
        setSnackbarMessage('Error durante la autenticación. Intenta de nuevo.');
      }
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const calculatePopupPosition = () => {
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;
    return { width, height, left, top };
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          padding: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, sm: 7 },
            width: '100%',
            maxWidth: 600,
            textAlign: 'center',
            margin: 'auto',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Iniciar Sesión
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Ingresa usando tu cuenta de Google
          </Typography>

          {loading ? (
            <CircularProgress sx={{ my: 2 }} />
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log('Login Failed')}
              useOneTap={false}
              width="100%"
              shape="rectangular"
              theme="filled_blue"
              render={(renderProps) => (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Google />}
                  onClick={() => {
                    const popupConfig = calculatePopupPosition();
                    window.popupConfig = popupConfig;
                    renderProps.onClick();
                  }}
                  disabled={renderProps.disabled || loading}
                  fullWidth
                  sx={{
                    marginTop: 2,
                    height: 48,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  Iniciar sesión con Google
                </Button>
              )}
            />
          )}
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ backgroundColor: 'error.main' }}
      />
    </GoogleOAuthProvider>
  );
};

export default Login;
