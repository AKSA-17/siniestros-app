import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, IconButton, Button, TextField, InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import apiClient from '../../services/api';

const SiniestrosList = () => {
  const [siniestros, setSiniestros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSiniestros = async () => {
      try {
        const response = await apiClient.get('/api/siniestros/');
        setSiniestros(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar siniestros:', err);
        setError('No se pudieron cargar los siniestros');
        setLoading(false);
      }
    };
    
    fetchSiniestros();
  }, []);
  
  // Manejadores de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Filtrado de siniestros
  const filteredSiniestros = siniestros.filter((siniestro) => 
    siniestro.numero_poliza.toLowerCase().includes(searchTerm.toLowerCase()) ||
    siniestro.asegurado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    siniestro.tipo_siniestro.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Siniestros paginados
  const paginatedSiniestros = filteredSiniestros
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Color del chip según estado
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Nuevo':
        return 'info';
      case 'En Proceso':
        return 'warning';
      case 'Resuelto':
        return 'success';
      default:
        return 'default';
    }
  };
  
  // Color del chip según prioridad
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
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  if (loading) {
    return <Typography>Cargando siniestros...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Siniestros
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/siniestros/nuevo')}
        >
          Nuevo Siniestro
        </Button>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por póliza, asegurado o tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de siniestros">
          <TableHead>
            <TableRow>
              <TableCell>Póliza</TableCell>
              <TableCell>Asegurado</TableCell>
              <TableCell>Fecha Siniestro</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSiniestros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No se encontraron siniestros
                </TableCell>
              </TableRow>
            ) : (
              paginatedSiniestros.map((siniestro) => (
                <TableRow key={siniestro.id}>
                  <TableCell>{siniestro.numero_poliza}</TableCell>
                  <TableCell>{siniestro.asegurado}</TableCell>
                  <TableCell>{formatDate(siniestro.fecha_siniestro)}</TableCell>
                  <TableCell>{siniestro.tipo_siniestro}</TableCell>
                  <TableCell>
                    <Chip 
                      label={siniestro.estado} 
                      color={getStatusColor(siniestro.estado)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={siniestro.prioridad} 
                      color={getPriorityColor(siniestro.prioridad)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      aria-label="ver detalle"
                      onClick={() => navigate(`/siniestros/${siniestro.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="editar"
                      onClick={() => navigate(`/siniestros/${siniestro.id}/editar`)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredSiniestros.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Box>
  );
};

export default SiniestrosList;