import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, CircularProgress } from '@mui/material';
import apiClient from '../services/api';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        console.log("Intentando conectar con el backend...");
        const response = await apiClient.get('/api/health');
        console.log("Respuesta del backend:", response.data);
        setApiStatus(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        setApiStatus({ status: 'error', message: 'No se pudo conectar con la API' });
        setLoading(false);
      }
    };

    checkApiStatus();
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sistema de Gestión de Siniestros
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Estado del Sistema
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" color={apiStatus?.status === 'ok' ? 'success.main' : 'error.main'}>
                Estado: {apiStatus?.status === 'ok' ? 'Conectado' : 'Desconectado'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {apiStatus?.message}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;