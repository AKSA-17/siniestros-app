import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../services/api';

// Crear el contexto
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiClient.post('/api/login/test-token');
          setUser(response.data);
        } catch (err) {
          // Si el token no es válido, lo eliminamos
          localStorage.removeItem('token');
          console.error('Error de autenticación:', err);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/api/login/access-token', {
        username: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // Obtener información del usuario
      const userResponse = await apiClient.post('/api/login/test-token');
      setUser(userResponse.data);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
      setLoading(false);
      return false;
    }
  };

  // Función para registrar un nuevo usuario
// Función para registrar un nuevo usuario
const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Usar la ruta de registro abierto
      await apiClient.post('/api/users/open', userData);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Error al registrar:", err); // Añadir para depuración
      setError(err.response?.data?.detail || 'Error al registrar usuario');
      setLoading(false);
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!user;

  // Verificar si el usuario es un agente
  const isAgent = user?.is_agent || false;

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    isAgent
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};