import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  CircularProgress, 
  Alert,
  Button
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';

// Tipos MIME para imágenes
const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp'
];

const DocumentViewer = ({ documentId, documentUrl, documentName, documentType }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [contentUrl, setContentUrl] = useState('');
  
  useEffect(() => {
    const determineDocumentType = () => {
      setLoading(true);
      
      try {
        // Determinar tipo de documento por extensión o nombre
        const fileName = documentName ? documentName.toLowerCase() : '';
        
        // Crear URL para mostrar el documento
        let url = '';
        if (documentUrl) {
          url = documentUrl;
        } else if (documentId) {
          url = `/api/documents/download/${documentId}`;
        }
        
        setContentUrl(url);
        
        // Determinar si es un PDF
        if (fileName.endsWith('.pdf') || documentType === 'application/pdf') {
          setIsPdf(true);
          setIsImage(false);
        }
        // Determinar si es una imagen
        else if (
          fileName.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/) || 
          (documentType && IMAGE_MIME_TYPES.includes(documentType))
        ) {
          setIsPdf(false);
          setIsImage(true);
        } else {
          setIsPdf(false);
          setIsImage(false);
        }
      } catch (err) {
        console.error('Error al preparar visualizador de documento:', err);
        setError('No se pudo cargar el documento');
      } finally {
        setLoading(false);
      }
    };
    
    determineDocumentType();
  }, [documentId, documentUrl, documentName, documentType]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    );
  }
  
  if (!contentUrl) {
    return (
      <Box sx={{ 
        p: 4, 
        border: '1px dashed #ccc', 
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300
      }}>
        <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          No hay documento disponible para visualizar
        </Typography>
      </Box>
    );
  }
  
  // Renderizar según el tipo de documento
  return (
    <Paper elevation={1} sx={{ overflow: 'hidden', borderRadius: 2 }}>
      {isPdf ? (
        // Para PDFs, usar un iframe
        <Box sx={{ height: 500, width: '100%' }}>
          <iframe 
            src={`${contentUrl}#view=FitH`} 
            title={documentName || 'PDF Document'} 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
          />
        </Box>
      ) : isImage ? (
        // Para imágenes, mostrar directamente
        <Box 
          sx={{ 
            width: '100%', 
            textAlign: 'center',
            p: 2,
            '& img': { maxWidth: '100%', maxHeight: 500 }
          }}
        >
          <img 
            src={contentUrl} 
            alt={documentName || 'Document'} 
            onLoad={() => setLoading(false)}
            onError={() => {
              setError('Error al cargar la imagen');
              setLoading(false);
            }}
          />
        </Box>
      ) : (
        // Para otros tipos de documentos, mostrar un mensaje y botón para descargar
        <Box sx={{ 
          p: 4, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300
        }}>
          <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 2 }}>
            {documentName || 'Documento'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Este tipo de documento no se puede previsualizar
          </Typography>
          <Button 
            variant="contained"
            component="a"
            href={contentUrl}
            target="_blank"
            download
          >
            Descargar
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default DocumentViewer;