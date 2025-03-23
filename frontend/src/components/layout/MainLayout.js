import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar open={drawerOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerOpen ? 240 : 0}px)` },
          ml: { sm: `${drawerOpen ? 240 : 0}px` },
          transition: 'margin 0.2s ease-in-out',
        }}
      >
        <Toolbar /> {/* Espaciador para que el contenido no quede debajo del AppBar */}
        <Outlet /> {/* Aquí se renderiza el contenido de las rutas anidadas */}
      </Box>
    </Box>
  );
};

export default MainLayout;