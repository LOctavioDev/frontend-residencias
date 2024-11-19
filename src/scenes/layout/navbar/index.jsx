import { Box, IconButton, InputBase, useMediaQuery, useTheme, Typography } from '@mui/material';
import { tokens, ColorModeContext } from '../../../theme';
import { useContext } from 'react';
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PersonOutlined,
  SearchOutlined,
  SettingsOutlined,
  ExitToApp,
} from '@mui/icons-material';
import { ToggledContext } from '../../../App';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/images/logo.png";


const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery('(max-width:768px)');
  const isXsDevices = useMediaQuery('(max-width:466px)');
  const colors = tokens(theme.palette.mode);
  const nav = useNavigate();
  const { logout } = useContext(AuthContext);
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
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                  src={logo}
                  alt="Argon"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  ITSH
                </Typography>
              </Box>
      </Box>

      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton>
        <IconButton>
          <ExitToApp
            onClick={() => {
              logout();
              nav('/');
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Navbar;
