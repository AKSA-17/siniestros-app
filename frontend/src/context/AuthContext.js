// Frontend/src/contex/Authcontext
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
  const [userType, setUserType] = useState(null); // Añadimos estado para el tipo de usuario

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType'); // Obtenemos el tipo de usuario guardado
      
      if (token) {
        try {
          const response = await apiClient.post('/api/login/test-token');
          setUser(response.data);
          setUserType(storedUserType); // Establecemos el tipo de usuario
        } catch (err) {
          // Si el token no es válido, lo eliminamos
          localStorage.removeItem('token');
          localStorage.removeItem('userType'); // También eliminamos el tipo de usuario
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
      
      // Se le pasa el usuario y la contraseña al back
      const response = await apiClient.post('/api/login/access-token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      // Extraemos los datos de la respuesta
      const { access_token, token_type, user_type } = response.data;
      
      // Guardamos el token y el tipo de usuario
      localStorage.setItem('token', access_token);
      localStorage.setItem('userType', user_type); // Guardamos el tipo de usuario
      setUserType(user_type); // Actualizamos el estado
      console.log("Tipo de usuario:", user_type); // 👈 Imprime el valor
      
      if (user_type === "user"){
        const userResponse = await apiClient.post('/api/login/test-token');
        setUser(userResponse.data);
      }
      else{
        const userResponse = await apiClient.post('/api/login/test-agent-token');
        setUser(userResponse.data);
        
      }
      

      return { success: true, userType: user_type }; // Devolvemos también el tipo de usuario
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar un nuevo usuario
  // Cómo hacer para que igual registe agentes?
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const is_agent= !userData.is_agent;
      console.log(is_agent)
      //is_agent = !userData.is_agent

      if(is_agent)
      {
        await apiClient.post('/api/users/open', userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      else
      {
        await apiClient.post('/api/users/open_agent', userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });        
      }

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
    localStorage.removeItem('userType'); // También eliminamos el tipo de usuario
    setUser(null);
    setUserType(null); // Reseteamos el tipo de usuario
    setError(null);
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!user;

  // Verificar si el usuario es un agente
  const isAgent = userType === 'agent';
  
  // Verificar si el usuario es un usuario regular
  const isRegularUser = userType === 'user';

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    isAgent,
    isRegularUser,
    userType
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;