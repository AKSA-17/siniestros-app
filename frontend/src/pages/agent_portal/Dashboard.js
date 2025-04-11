import React, { useState, useEffect } from 'react';
import { 
  Typography, Grid, Paper, Box,
  Card, CardContent, CardHeader,
  CircularProgress, Divider
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // En un MVP, podemos simular estadísticas si la API aún no las proporciona
        // Idealmente, habría un endpoint específico para esto en la API
        
        // Obtener siniestros
        const response = await apiClient.get('/api/siniestros/');
        const siniestros = response.data;
        
        // Calcular estadísticas
        const stats = {
          total: siniestros.length,
          nuevos: siniestros.filter(s => s.estado === 'Nuevo').length,
          enProceso: siniestros.filter(s => s.estado === 'En Proceso').length,
          resueltos: siniestros.filter(s => s.estado === 'Resuelto').length,
          alta: siniestros.filter(s => s.prioridad === 'Alta').length,
          media: siniestros.filter(s => s.prioridad === 'Media').length,
          baja: siniestros.filter(s => s.prioridad === 'Baja').length
        };
        
        setStats(stats);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
        setError('No se pudieron cargar las estadísticas');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tarjeta de estadística reutilizable
  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            backgroundColor: `${color}.light`, 
            p: 2, 
            borderRadius: 2, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 40, color: `${color}.main` } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        Bienvenido, {user?.full_name}!
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Resumen de Siniestros
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Siniestros" 
              value={stats?.total || 0} 
              icon={<InsertDriveFileIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Alta Prioridad" 
              value={stats?.alta || 0} 
              icon={<WarningIcon />}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="En Proceso" 
              value={stats?.enProceso || 0} 
              icon={<ErrorIcon />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Resueltos" 
              value={stats?.resueltos || 0} 
              icon={<CheckCircleIcon />}
              color="success"
            />
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Actividad Reciente
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No hay actividad reciente.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;