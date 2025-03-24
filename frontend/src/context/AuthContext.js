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
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiClient.post('/api/login/test-token');
          setUser(response.data);
        } catch (err) {
          // Si el token no es válido, lo eliminamos
          localStorage.removeItem('token');
          console.error('Error de autenticación:', err);
          setError(err.response?.data?.detail || 'Error de autenticación');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await apiClient.post('/api/login/access-token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // Obtener información del usuario
      const userResponse = await apiClient.post('/api/login/test-token');
      setUser(userResponse.data);
      return true;
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiClient.post('/api/users/open', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return true;
    } catch (err) {
      console.error("Error al registrar:", err);
      setError(err.response?.data?.detail || 'Error al registrar usuario');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
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

export default AuthProvider;