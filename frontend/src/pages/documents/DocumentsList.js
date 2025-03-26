import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, IconButton, Button, TextField, InputAdornment,
  CircularProgress, Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import apiClient from '../../services/api';

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalDocuments, setTotalDocuments] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener ID del siniestro de la URL si está presente
  const getSiniestroIdFromUrl = () => {
    const path = location.pathname;
    const matches = path.match(/\/siniestros\/(\d+)\/documentos/);
    return matches ? matches[1] : null;
  };
  
  const siniestroId = getSiniestroIdFromUrl();
  
  // Cargar documentos
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        let response;
        
        if (siniestroId) {
          // Cargar documentos de un siniestro específico
          response = await apiClient.get(`/api/documents/by-siniestro/${siniestroId}`);
        } else {
          // Cargar todos los documentos
          response = await apiClient.get('/api/documents');
        }
        
        setDocuments(response.data);
        setTotalDocuments(response.data.length);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar documentos:', err);
        setError('No se pudieron cargar los documentos');
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [siniestroId]);
  
  // Manejadores de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Filtrado de documentos
  const filteredDocuments = documents.filter((doc) => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Documentos paginados
  const paginatedDocuments = filteredDocuments
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };
  
  // Manejar clic en botón de subir documento
  const handleUploadClick = () => {
    if (siniestroId) {
      navigate(`/siniestros/${siniestroId}/documentos/subir`);
    } else {
      navigate('/documentos/subir');
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
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {siniestroId ? 'Documentos del Siniestro' : 'Documentos'}
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<UploadFileIcon />}
          onClick={handleUploadClick}
        >
          Subir Documento
        </Button>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre o tipo de documento..."
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
        <Table sx={{ minWidth: 650 }} aria-label="tabla de documentos">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Fecha de Subida</TableCell>
              <TableCell>Siniestro ID</TableCell>
              <TableCell>Validado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No se encontraron documentos
                </TableCell>
              </TableRow>
            ) : (
              paginatedDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.document_type}</TableCell>
                  <TableCell>{formatDate(doc.upload_date)}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => navigate(`/siniestros/${doc.siniestro_id}`)}
                    >
                      #{doc.siniestro_id}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {doc.validated ? (
                      <Chip 
                        icon={<CheckCircleIcon />}
                        label="Validado" 
                        color="success" 
                        size="small" 
                      />
                    ) : (
                      <Chip 
                        icon={<CancelIcon />}
                        label="Pendiente" 
                        color="warning" 
                        size="small" 
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      aria-label="ver documento"
                      onClick={() => navigate(`/documentos/${doc.id}`)}
                    >
                      <VisibilityIcon />
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
            count={filteredDocuments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />

            {siniestroId && (
            <Box sx={{ mt: 3 }}>
            <Button 
            variant="outlined"
            onClick={() => navigate(`/siniestros/${siniestroId}`)}
            >
            Volver al Siniestro
            </Button>
            </Box>
            )}
            </Box>
            );
            };

            export default DocumentsList;
                          