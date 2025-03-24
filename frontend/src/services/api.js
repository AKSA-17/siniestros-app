import axios from 'axios';

const API_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    console.log("Enviando solicitud a:", config.url);
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Token encontrado, añadiendo a cabeceras");
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error en interceptor de solicitud:", error);
    return Promise.reject(error);
  }
);

// Añadir interceptor de respuesta para depuración
apiClient.interceptors.response.use(
  (response) => {
    console.log("Respuesta exitosa de:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("Error en respuesta:", error.config?.url, error.response?.status);
    console.error("Detalles del error:", error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;