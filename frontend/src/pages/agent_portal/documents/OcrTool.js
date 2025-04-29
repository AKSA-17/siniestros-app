import React, { useState } from 'react';
import {
  Typography, Box, Paper, Button, Grid, CircularProgress,
  Alert, TextField, Divider, Card, CardContent
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import apiClient from '../../services/api';
import DocumentViewer from '../../components/documents/DocumentViewer';

const OcrTool = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [filePreview, setFilePreview] = useState('');
  
  // Manejar cambio de archivo
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    
    // Crear URL para previsualización
    if (selectedFile.type.startsWith('image/')) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setFilePreview(fileUrl);
    } else {
      setFilePreview('');
    }
    
    // Reset results
    setResult(null);
    setError('');
  };
  
  // Procesar archivo con OCR
  const handleProcessFile = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // Crear FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // Hacer solicitud al servicio OCR
      const response = await apiClient.post('/api/documents/ocr-direct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(response.data);
    } catch (err) {
      console.error('Error en procesamiento OCR:', err);
      setError(err.response?.data?.detail || 'Error al procesar el documento');
    } finally {
      setLoading(false);
    }
  };
  
  // Limpiar todo
  const handleClear = () => {
    setFile(null);
    setFileName('');
    setFilePreview('');
    setResult(null);
    setError('');
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Herramienta OCR
      </Typography>
      
      <Typography variant="body1" paragraph>
        Sube un documento para extraer texto e información automáticamente mediante OCR.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Documento
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <input
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                id="contained-button-file"
                type="file"
                onChange={handleFileChange}
                disabled={loading}
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadFileIcon />}
                  disabled={loading}
                  fullWidth
                >
                  Seleccionar Documento
                </Button>
              </label>
              
              {fileName && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Archivo seleccionado: {fileName}
                </Typography>
              )}
            </Box>
            
            {filePreview && (
              <Box sx={{ mb: 3 }}>
                <DocumentViewer 
                  documentUrl={filePreview} 
                  documentName={fileName} 
                />
              </Box>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={handleClear}
                    disabled={loading || (!file && !result)}
                >
                    Limpiar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleProcessFile}
                    disabled={loading || !file}
                    startIcon={loading ? <CircularProgress size={20} /> : <TextSnippetIcon />}
                >
                    {loading ? 'Procesando...' : 'Procesar con OCR'}
                </Button>
                </Box>
                        </Paper>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                            Resultados OCR
                            </Typography>
                            
                            {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                                <CircularProgress />
                            </Box>
                            ) : !result ? (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                height: '80%',
                                color: 'text.secondary'
                            }}>
                                <Typography variant="body1">
                                Sube un documento y haz clic en "Procesar con OCR" para ver los resultados.
                                </Typography>
                            </Box>
                            ) : result.data ? (
                            // Datos estructurados (como INE o póliza)
                            <Card variant="outlined">
                                <CardContent>
                                <Grid container spacing={2}>
                                    {Object.entries(result.data).map(([key, value]) => (
                                    value && key !== "error" ? (
                                        <Grid item xs={12} key={key}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                        </Typography>
                                        <Typography variant="body1">
                                            {value}
                                        </Typography>
                                        <Divider sx={{ mt: 1 }} />
                                        </Grid>
                                    ) : null
                                    ))}
                                </Grid>
                                </CardContent>
                            </Card>
                            ) : (
                            // Texto plano
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Texto Extraído
                                </Typography>
                                <TextField
                                multiline
                                fullWidth
                                minRows={10}
                                maxRows={20}
                                value={result.text || 'No se pudo extraer texto del documento'}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                                />
                                
                                <Button 
                                variant="text" 
                                sx={{ mt: 2 }}
                                onClick={() => {
                                    navigator.clipboard.writeText(result.text);
                                }}
                                >
                                Copiar al portapapeles
                                </Button>
                            </Box>
                            )}
                        </Paper>
                        </Grid>
                    </Grid>
                    </Box>
                );
                };

                export default OcrTool;