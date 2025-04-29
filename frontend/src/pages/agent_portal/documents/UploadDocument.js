import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Button, FormControl,
  InputLabel, Select, MenuItem, CircularProgress,
  Alert, TextField, Divider
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import apiClient from '../../services/api';

const UploadDocument = () => {
  const { siniestroId } = useParams();
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [siniestro, setSiniestro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Tipos de documentos disponibles
  const documentTypes = [
    'INE',
    'Póliza',
    'Comprobante',
    'Factura',
    'Reporte',
    'Fotografía',
    'Otro'
  ];
  
  // Cargar datos del siniestro
  useEffect(() => {
    const fetchSiniestro = async () => {
      if (!siniestroId) return;
      
      setLoading(true);
      try {
        const response = await apiClient.get(`/api/siniestros/${siniestroId}`);
        setSiniestro(response.data);
      } catch (err) {
        console.error('Error al cargar siniestro:', err);
        setErrorMessage('No se pudo cargar la información del siniestro');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSiniestro();
  }, [siniestroId]);
  
  // Manejar cambio de archivo
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  
  // Manejar cambio de tipo de documento
  const handleDocumentTypeChange = (event) => {
    setDocumentType(event.target.value);
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!file) {
      setErrorMessage('Por favor, selecciona un archivo');
      return;
    }
    
    if (!documentType) {
      setErrorMessage('Por favor, selecciona un tipo de documento');
      return;
    }
    
    setErrorMessage('');
    setSuccessMessage('');
    setSubmitting(true);
    
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    
    try {
      await apiClient.post(`/api/documents/upload/${siniestroId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccessMessage('Documento subido correctamente');
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate(`/siniestros/${siniestroId}/documentos`);
      }, 2000);
      
    } catch (err) {
      console.error('Error al subir documento:', err);
      setErrorMessage(err.response?.data?.detail || 'Error al subir el documento');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Subir Documento
      </Typography>
      
      {siniestro && (
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          Siniestro: {siniestro.numero_poliza} - {siniestro.asegurado}
        </Typography>
      )}
      
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
            <Select
              labelId="document-type-label"
              value={documentType}
              label="Tipo de Documento"
              onChange={handleDocumentTypeChange}
              disabled={submitting}
            >
              {documentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ mb: 3 }}>
            <input
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              id="contained-button-file"
              type="file"
              onChange={handleFileChange}
              disabled={submitting}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadFileIcon />}
                disabled={submitting}
                fullWidth
              >
                Seleccionar Archivo
              </Button>
            </label>
            
            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Archivo seleccionado: {file.name}
              </Typography>
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/siniestros/${siniestroId}/documentos`)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || !file || !documentType}
            >
              {submitting ? <CircularProgress size={24} /> : 'Subir Documento'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UploadDocument;