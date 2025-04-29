import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Grid, Chip, Button, CircularProgress, Alert,
  Divider, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction,
  IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import apiClient from '../../services/api';

const SiniestroDetail = () => {
  const { siniestroId } = useParams();
  const navigate = useNavigate();
  
  const [siniestro, setSiniestro] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [error, setError] = useState(null);
  
  // Cargar datos del siniestro
  useEffect(() => {
    const fetchSiniestro = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/api/siniestros/${siniestroId}`);
        setSiniestro(response.data);
      } catch (err) {
        console.error('Error al cargar siniestro:', err);
        setError('No se pudo cargar la información del siniestro');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSiniestro();
  }, [siniestroId]);
  
  // Cargar documentos del siniestro
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!siniestroId) return;
      
      setLoadingDocuments(true);
      try {
        const response = await apiClient.get(`/api/documents/by-siniestro/${siniestroId}`);
        setDocuments(response.data);
      } catch (err) {
        console.error('Error al cargar documentos:', err);
      } finally {
        setLoadingDocuments(false);
      }
    };
    
    fetchDocuments();
  }, [siniestroId]);
  
  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  // Obtener color para chips
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Nuevo':
        return 'info';
      case 'En Proceso':
        return 'warning';
      case 'Resuelto':
        return 'success';
      case 'Cerrado':
        return 'default';
      default:
        return 'default';
    }
  };
  
  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'Alta':
        return 'error';
      case 'Media':
        return 'warning';
      case 'Baja':
        return 'success';
      default:
        return 'default';
    }
  };

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
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/siniestros')}
          sx={{ mt: 2 }}
        >
          Volver a Siniestros
        </Button>
      </Box>
    );
  }

  if (!siniestro) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">
          No se encontró el siniestro solicitado
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/siniestros')}
          sx={{ mt: 2 }}
        >
          Volver a Siniestros
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Siniestro #{siniestro.id}
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<EditIcon />}
          onClick={() => navigate(`/siniestros/${siniestro.id}/editar`)}
        >
          Editar
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Información General</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold', width: '40%' }}>
                      Número de Póliza
                    </TableCell>
                    <TableCell>{siniestro.numero_poliza}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                      Asegurado
                    </TableCell>
                    <TableCell>{siniestro.asegurado}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                      Tipo de Siniestro
                    </TableCell>
                    <TableCell>{siniestro.tipo_siniestro}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                      Estado
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={siniestro.estado} 
                        color={getStatusColor(siniestro.estado)} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                      Prioridad
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={siniestro.prioridad} 
                        color={getPriorityColor(siniestro.prioridad)} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Fechas</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold', width: '40%' }}>
                      Fecha del Siniestro
                    </TableCell>
                    <TableCell>{formatDate(siniestro.fecha_siniestro)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" sx={{ fontWeight: 'bold' }}>
                      Fecha de Reporte
                    </TableCell>
                    <TableCell>{formatDate(siniestro.fecha_reporte)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Propietario</Typography>
            <Typography variant="body1">
              ID: {siniestro.owner_id}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Descripción</Typography>
          <Typography variant="body1">
            {siniestro.descripcion || 'Sin descripción'}
          </Typography>
        </Box>
      </Paper>
      
      {/* Sección de Documentos */}
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Documentos</Typography>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/siniestros/${siniestroId}/documentos/subir`)}
          >
            Subir Documento
          </Button>
        </Box>
        
        {loadingDocuments ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : documents.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No hay documentos asociados a este siniestro
          </Typography>
        ) : (
          <List>
            {documents.map((doc) => (
              <ListItem key={doc.id} divider>
                <ListItemIcon>
                  <DescriptionIcon color={doc.document_type === 'INE' ? 'primary' : 'action'} />
                </ListItemIcon>
                <ListItemText 
                  primary={doc.name} 
                  secondary={`${doc.document_type} - ${formatDate(doc.upload_date)}`} 
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="ver"
                    onClick={() => navigate(`/documentos/${doc.id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}

        <Box sx={{ mt: 2 }}>
          <Button 
            variant="text" 
            onClick={() => navigate(`/siniestros/${siniestroId}/documentos`)}
          >
            Ver todos los documentos
          </Button>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 3 }}>
        <Button 
          variant="outlined"
          onClick={() => navigate('/siniestros')}
        >
          Volver a la Lista
        </Button>
      </Box>
    </Box>
  );
};

export default SiniestroDetail;