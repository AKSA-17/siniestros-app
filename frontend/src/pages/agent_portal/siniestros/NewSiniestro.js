import React, { useState } from 'react';
import {
  Typography, Box, Paper, TextField, Button,
  Grid, MenuItem, FormControl, InputLabel,
  Select, FormHelperText, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';

const NewSiniestro = () => {
  const [formData, setFormData] = useState({
    numero_poliza: '',
    asegurado: '',
    tipo_siniestro: '',
    descripcion: '',
    estado: 'Nuevo',
    prioridad: 'Media',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();
  
  // Opciones para selects
  const tiposSiniestro = [
    'Automóvil',
    'Hogar',
    'Vida',
    'Salud',
    'Negocio',
    'Otro'
  ];
  
  const estadosSiniestro = [
    'Nuevo',
    'En Proceso',
    'Resuelto',
    'Cerrado'
  ];
  
  const prioridadesSiniestro = [
    'Alta',
    'Media',
    'Baja'
  ];
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error del campo cuando se modifica
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.numero_poliza) {
      errors.numero_poliza = 'El número de póliza es obligatorio';
    }
    
    if (!formData.asegurado) {
      errors.asegurado = 'El nombre del asegurado es obligatorio';
    }
    
    if (!formData.tipo_siniestro) {
      errors.tipo_siniestro = 'El tipo de siniestro es obligatorio';
    }
    
    if (!formData.descripcion) {
      errors.descripcion = 'La descripción es obligatoria';
    }
    
    return errors;
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await apiClient.post('/api/siniestros/', formData);
      setSuccessMessage('Siniestro creado exitosamente');
      setLoading(false);
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate('/siniestros');
      }, 1500);
    } catch (err) {
      console.error('Error al crear siniestro:', err);
      setErrorMessage(err.response?.data?.detail || 'Error al crear el siniestro');
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Nuevo Siniestro
      </Typography>
      
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Póliza"
                name="numero_poliza"
                value={formData.numero_poliza}
                onChange={handleChange}
                error={!!formErrors.numero_poliza}
                helperText={formErrors.numero_poliza}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Asegurado"
                name="asegurado"
                value={formData.asegurado}
                onChange={handleChange}
                error={!!formErrors.asegurado}
                helperText={formErrors.asegurado}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!formErrors.tipo_siniestro}>
                <InputLabel>Tipo de Siniestro</InputLabel>
                <Select
                  name="tipo_siniestro"
                  value={formData.tipo_siniestro}
                  onChange={handleChange}
                  label="Tipo de Siniestro"
                  disabled={loading}
                >
                  {tiposSiniestro.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.tipo_siniestro && (
                  <FormHelperText>{formErrors.tipo_siniestro}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  label="Estado"
                  disabled={loading}
                >
                  {estadosSiniestro.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  label="Prioridad"
                  disabled={loading}
                >
                  {prioridadesSiniestro.map((prioridad) => (
                    <MenuItem key={prioridad} value={prioridad}>
                      {prioridad}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                multiline
                rows={4}
                error={!!formErrors.descripcion}
                helperText={formErrors.descripcion}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/siniestros')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Guardar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewSiniestro;