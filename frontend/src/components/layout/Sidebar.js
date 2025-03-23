import React from 'react';
import {
  Drawer, Toolbar, List, Divider, 
  ListItem, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../../context/AuthContext';

// Ancho del drawer
const drawerWidth = 240;

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAgent } = useAuth();
  
  // Menú para todos los usuarios
  const commonMenu = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      text: 'Mis Siniestros',
      icon: <InsertDriveFileIcon />,
      path: '/siniestros'
    },
    {
      text: 'Documentos',
      icon: <DescriptionIcon />,
      path: '/documentos'
    }
  ];
  
  // Menú adicional solo para agentes
  const agentMenu = [
    {
      text: 'Usuarios',
      icon: <PeopleIcon />,
      path: '/usuarios'
    }
  ];
  
  // Determinar qué menú mostrar
  const menuItems = isAgent 
    ? [...commonMenu, ...agentMenu]
    : commonMenu;

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 2 }} />
    </Drawer>
  );
};

export default Sidebar;