import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, IconButton, Button, TextField, InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
  
  const navigate = useNavigate();
  
  // Simular datos de documentos para el MVP
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // En un caso real, harías una llamada a la API para obtener los documentos
        // const response = await apiClient.get('/api/documents/');
        
        // Datos simulados para desarrollo
        const dummyData = [
          {
            id: 1,
            name: 'INE-Juan-Perez.pdf',
            document_type: 'INE',
            upload_date: '2023-05-15T10:30:00',
            validated: true,
            siniestro_id: 1
          },
          {
            id: 2,
            name: 'Poliza-Auto-12345.pdf',
            document_type: 'Póliza',
            upload_date: '2023-05-16T14:20:00',
            validated: false,
            siniestro_id: 1
          },
          {
            id: 3,
            name: 'Comprobante-Pago.pdf',
            document_type: 'Comprobante',
            upload_date: '2023-05-17T09:15:00',
            validated: true,
            siniestro_id: 2
          }
        ];
        
        setDocuments(dummyData);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar documentos:', err);
        setError('No se pudieron cargar los documentos');
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, []);
  
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

  if (loading) {
    return <Typography>Cargando documentos...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Documentos
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<UploadFileIcon />}
          onClick={() => navigate('/documentos/subir')}
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
    </Box>
  );
};

export default DocumentsList;