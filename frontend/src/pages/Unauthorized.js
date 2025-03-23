import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Acceso No Autorizado
        </Typography>
        
        <Typography variant="body1" align="center" paragraph>
          No tienes los permisos necesarios para acceder a esta página.
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/dashboard')}
          >
            Ir al Dashboard
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
          >
            Volver Atrás
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Unauthorized;