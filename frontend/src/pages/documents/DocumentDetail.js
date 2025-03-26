import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Button, CircularProgress,
  Alert, Grid, Chip, Divider, Card, CardContent
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import apiClient from '../../services/api';

const DocumentDetail = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  
  const [document, setDocument] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Cargar documento
  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        // Simular carga de documento por ID
        // En un caso real, habría un endpoint para obtener un documento por ID
        const response = await apiClient.get(`/api/documents/${documentId}`);
        setDocument(response.data);
      } catch (err) {
        console.error('Error al cargar documento:', err);
        setErrorMessage('No se pudo cargar el documento');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [documentId]);
  
  // Extraer texto con OCR
  const handleExtractText = async () => {
    setOcrLoading(true);
    setErrorMessage('');
    
    try {
      const response = await apiClient.post(`/api/documents/ocr/${documentId}`);
      setOcrData(response.data);
      setSuccessMessage('Texto extraído correctamente');
    } catch (err) {
      console.error('Error al extraer texto:', err);
      setErrorMessage(err.response?.data?.detail || 'Error en el procesamiento OCR');
    } finally {
      setOcrLoading(false);
    }
  };
  
  // Validar documento
  const handleValidateDocument = async () => {
    try {
      const response = await apiClient.put(`/api/documents/${documentId}/validate`);
      setDocument({...document, validated: true});
      setSuccessMessage('Documento validado correctamente');
    } catch (err) {
      console.error('Error al validar documento:', err);
      setErrorMessage(err.response?.data?.detail || 'Error al validar el documento');
    }
  };
  
  // Determinar el icono según el tipo de archivo
const getFileIcon = () => {
    if (!document) return <DescriptionIcon fontSize="large" />;
    
    const fileName = document.name.toLowerCase();
    
    if (fileName.endsWith('.pdf')) {
      return <PictureAsPdfIcon fontSize="large" color="error" />;
    } else if (fileName.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/)) {
      return <ImageIcon fontSize="large" color="primary" />;
    } else {
      return <DescriptionIcon fontSize="large" color="action" />;
    }
  };
  
  // Formato de fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!document && !loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">
          No se pudo encontrar el documento solicitado
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/documentos')}
          sx={{ mt: 2 }}
        >
          Volver a Documentos
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Detalle del Documento
      </Typography>
      
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
      
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ 
              p: 4, 
              border: '1px dashed #ccc', 
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              minHeight: 200,
              justifyContent: 'center'
            }}>
              {getFileIcon()}
              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                {document?.name || 'Documento'}
              </Typography>
              
              <Button 
                variant="text" 
                sx={{ mt: 2 }}
                component="a"
                href={`/api/documents/download/${documentId}`}
                target="_blank"
              >
                Ver / Descargar
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h6">Información del Documento</Typography>
            <Divider sx={{ my: 1 }} />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Nombre
                </Typography>
                <Typography variant="body1">
                  {document?.name || '-'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tipo de Documento
                </Typography>
                <Typography variant="body1">
                  {document?.document_type || '-'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Fecha de Subida
                </Typography>
                <Typography variant="body1">
                  {formatDate(document?.upload_date) || '-'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Estado
                </Typography>
                {document?.validated ? (
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
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  ID del Siniestro
                </Typography>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => navigate(`/siniestros/${document?.siniestro_id || ''}`)}
                >
                  #{document?.siniestro_id || '-'}
                </Button>
              </Grid>
            </Grid>
            
            {!document?.validated && (
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="success"
                  onClick={handleValidateDocument}
                >
                  Validar Documento
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Extracción de Datos (OCR)
          </Typography>
          
          {!ocrData && (
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<TextSnippetIcon />}
                onClick={handleExtractText}
                disabled={ocrLoading}
              >
                {ocrLoading ? <CircularProgress size={24} /> : 'Extraer Texto'}
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Utiliza OCR para extraer texto e información del documento.
              </Typography>
            </Box>
          )}
          
          {ocrData && (
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                {document?.document_type === 'INE' ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Nombre</Typography>
                      <Typography variant="body1">{ocrData.data?.nombre || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">CURP</Typography>
                      <Typography variant="body1">{ocrData.data?.curp || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Clave de Elector</Typography>
                      <Typography variant="body1">{ocrData.data?.clave_elector || '-'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Domicilio</Typography>
                      <Typography variant="body1">{ocrData.data?.domicilio || '-'}</Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Texto Extraído
                    </Typography>
                    <Box sx={{ 
                      maxHeight: 300, 
                      overflow: 'auto', 
                      p: 2, 
                      bgcolor: '#f5f5f5',
                      borderRadius: 1
                    }}>
                      <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                        {ocrData.text || 'No se pudo extraer texto'}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Paper>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined"
          onClick={() => navigate('/documentos')}
        >
          Volver a la Lista
        </Button>
        
        <Button 
          variant="contained"
          onClick={() => navigate(`/siniestros/${document?.siniestro_id || ''}`)}
        >
          Ver Siniestro
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentDetail;