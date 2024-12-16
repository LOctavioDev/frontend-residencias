import React, { useState, useContext } from 'react';
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Modal,
  TextField,
  Button,
} from '@mui/material';
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  SettingsOutlined,
  ExitToApp,
} from '@mui/icons-material';
import { tokens, ColorModeContext } from '../../../theme';
import { ToggledContext } from '../../../App';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import api from '../../../services/apiService';
import logo from '../../../assets/images/logo.png';

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const { logout } = useContext(AuthContext);
  const isMdDevices = useMediaQuery('(max-width:768px)');
  const colors = tokens(theme.palette.mode);
  const nav = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminData, setAdminData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleChangeAdmin = async () => {
    setLoading(true);
    try {
      const response = await api.put('/auth/admin', adminData);
      console.log('Administrador actualizado:', response.data);
      setModalOpen(false);
      logout();
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar el administrador:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    nav('/login');
    logout();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={2}
      >
        <IconButton
          sx={{ display: `${isMdDevices ? 'flex' : 'none'}` }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuOutlined />
        </IconButton>
        <Box
          display="flex"
          alignItems="center"
          gap="12px"
          sx={{ transition: '.3s ease' }}
        >
          <img
            style={{ width: '50px', height: '50px', borderRadius: '8px' }}
            src={logo}
            alt="Argon"
          />
          <Typography
            variant="h2"
            fontWeight="bold"
            textTransform="capitalize"
            color={colors.orange[500]}
          >
            ITSH
          </Typography>
        </Box>
      </Box>

      <Box>
        <ConfirmationDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            handleLogout();
          }}
          title="¿Estás seguro de salir?"
          description="Saldrás del sistema al presionar 'Salir'."
          confirmText="Salir"
          cancelText="Cancelar"
        />

        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>

        <IconButton onClick={() => setModalOpen(true)}>
          <SettingsOutlined />
        </IconButton>

        <IconButton onClick={() => setConfirmOpen(true)}>
          <ExitToApp />
        </IconButton>
      </Box>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Box
          display="flex"
          flexDirection="column"
          p={4}
          borderRadius="8px"
          bgcolor={colors.primary[400]}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
          }}
        >
          <Typography
            variant="h4"
            mb={2}
          >
            Cambiar Administrador
          </Typography>
          <TextField
            label="Nombre"
            value={adminData.name}
            onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Correo Electrónico"
            value={adminData.email}
            onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Box
            display="flex"
            justifyContent="space-between"
            mt={3}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangeAdmin}
              disabled={loading || !adminData.name || !adminData.email}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Navbar;
