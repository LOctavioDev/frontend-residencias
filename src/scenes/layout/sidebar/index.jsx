/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme } from '@mui/material';
import { useContext, useState } from 'react';
import { tokens } from '../../../theme';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import {
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  TimelineOutlined,
} from '@mui/icons-material';
import Item from './Item';
import { ToggledContext } from '../../../App';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: '100%',
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ':hover': { background: 'transparent' } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: '10px 0 20px 0',
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {!collapsed && (
              // <Box
              //   display="flex"
              //   alignItems="center"
              //   gap="12px"
              //   sx={{ transition: ".3s ease" }}
              // >
              //   <img
              //     style={{ width: "30px", height: "30px", borderRadius: "8px" }}
              //     src={logo}
              //     alt="Argon"
              //   />
              //   <Typography
              //     variant="h4"
              //     fontWeight="bold"
              //     textTransform="capitalize"
              //     color={colors.greenAccent[500]}
              //   >
              //     ITSH
              //   </Typography>
              // </Box>
              <></>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      {!collapsed && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            mb: '25px',
          }}
        >
          <Avatar
            alt="avatar"
            src={user.picture}
            sx={{ width: '100px', height: '100px' }}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.gray[100]}
            >
              ADMIN
            </Typography>
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.orange[500]}
            >
              {user.name ? user.name : 'Admin'}
            </Typography>
          </Box>
        </Box>
      )}

      <Box
        mb={5}
        pl={collapsed ? undefined : '5%'}
      >
        <Menu
          menuItemStyles={{
            button: {
              ':hover': {
                color: '#ff8533',
                background: 'transparent',
                transition: '.4s ease',
              },
            },
          }}
        >
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: '15px 0 5px 20px' }}
        >
          {!collapsed ? 'Infromación' : ' '}
        </Typography>{' '}
        <Menu
          menuItemStyles={{
            button: {
              ':hover': {
                color: '#ff8533',
                background: 'transparent',
                transition: '.4s ease',
              },
            },
          }}
        >
          {/* <Item
            title="Dashboard"
            path="/"
            colors={colors}
            icon={<DashboardOutlined />}
          /> */}
          <Item
            title="Egresados"
            path="/team"
            colors={colors}
            icon={<PeopleAltOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: '15px 0 5px 20px' }}
        >
          {!collapsed ? 'Opciones' : ' '}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ':hover': {
                color: '#ff8533',
                background: 'transparent',
                transition: '.4s ease',
              },
            },
          }}
        >
          <Item
            title="Crear egresado"
            path="/form"
            colors={colors}
            icon={<PersonOutlined />}
          />
        </Menu>
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: '15px 0 5px 20px' }}
        >
          {!collapsed ? 'Graficos' : ' '}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ':hover': {
                color: '#ff8533',
                background: 'transparent',
                transition: '.4s ease',
              },
            },
          }}
        >
          <Item
            title="Grafico de barras"
            path="/bar"
            colors={colors}
            icon={<BarChartOutlined />}
          />
          <Item
            title="Grafico de pastel"
            path="/pie"
            colors={colors}
            icon={<DonutLargeOutlined />}
          />
          <Item
            title="Grafico de linea"
            path="/stream"
            colors={colors}
            icon={<TimelineOutlined />}
          />
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
