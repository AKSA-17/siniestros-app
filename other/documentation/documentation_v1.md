# Guía Completa para Desarrollo de MVP: Sistema de Gestión de Siniestros

## Arquitectura Final del Proyecto

La arquitectura seleccionada para el MVP del Sistema de Gestión de Siniestros consta de dos componentes principales claramente separados:

### 1. Frontend (React)
- **Tecnología**: React.js
- **Propósito**: Interfaz de usuario interactiva para agentes y asegurados
- **Justificación**: React ofrece un desarrollo eficiente de interfaces de usuario dinámicas con componentes reutilizables y una gran comunidad de soporte.

### 2. Backend (Python FastAPI)
- **Tecnología**: FastAPI (Python)
- **Propósito**: API RESTful para la lógica de negocio y procesamiento de datos
- **Justificación**: Aprovecha la experiencia del equipo en Python, ofrece alto rendimiento y facilita el desarrollo de APIs con documentación automática.

### 3. Componentes Complementarios
- **Base de datos**: PostgreSQL (relacional, para datos estructurados)
- **Almacenamiento de documentos**: MongoDB (para documentos y metadatos)
- **Servicio OCR**: Implementado en Python (Tesseract/EasyOCR)
- **Autenticación**: JWT en FastAPI

### Ventajas de esta Arquitectura
1. **Separación clara de responsabilidades**: Frontend y backend bien definidos
2. **Desarrollo en paralelo**: Equipos pueden trabajar simultáneamente
3. **Aprovechamiento de habilidades**: Maximiza el uso de Python en el backend
4. **Escalabilidad**: Cada componente puede escalarse independientemente
5. **Mantenibilidad**: Código organizado y modular

## Requisitos Previos (Windows)

### Software Necesario
1. **Python** (vía Anaconda)
   - Anaconda o Miniconda
   - Python 3.9 o 3.10

2. **Node.js y npm**
   - Node.js LTS (v14+)
   - npm (incluido con Node.js)

3. **Bases de Datos**
   - PostgreSQL

4. **Editores/IDE**
   - Visual Studio Code

5. **Herramientas Adicionales**
   - Git
   - Tesseract OCR (para reconocimiento de documentos)

## Guía Paso a Paso para Windows

### Fase 1: Preparación del Entorno

#### 1.1 Instalar Anaconda
1. Descarga Anaconda desde: https://www.anaconda.com/products/individual
2. Ejecuta el instalador y sigue las instrucciones
3. Marca la opción "Add Anaconda to my PATH environment variable"
4. Completa la instalación

#### 1.2 Instalar Node.js
1. Descarga Node.js LTS desde: https://nodejs.org/
2. Ejecuta el instalador y sigue las instrucciones predeterminadas
3. Verifica la instalación abriendo PowerShell y ejecutando:
   ```
   node --version
   npm --version
   ```

#### 1.3 Instalar PostgreSQL
1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador y sigue las instrucciones
3. Anota el puerto (por defecto 5432) y la contraseña que configures
4. Completa la instalación

#### 1.4 Instalar Tesseract OCR
1. Descarga Tesseract desde: https://github.com/UB-Mannheim/tesseract/wiki
2. Ejecuta el instalador
3. Selecciona el idioma español adicional
4. Instala en la ubicación predeterminada (normalmente C:\Program Files\Tesseract-OCR)
5. Marca la opción para añadir Tesseract al PATH

#### 1.5 Instalar Visual Studio Code
1. Descarga VS Code desde: https://code.visualstudio.com/
2. Ejecuta el instalador y sigue las instrucciones
3. Instala las extensiones recomendadas:
   - Python
   - ES7 React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint
   - GitLens

### Fase 2: Creación del Proyecto Backend (Python/FastAPI)

#### 2.1 Configurar Entorno Virtual
1. Abre Anaconda Prompt como administrador
2. Crea un nuevo entorno:
   ```
   conda create -n siniestros-app python=3.10
   conda activate siniestros-app
   ```

3. Instala dependencias:
   ```
   pip install fastapi uvicorn sqlalchemy pydantic python-jose[cryptography] passlib[bcrypt] python-multipart
   pip install pytesseract easyocr pillow numpy
   pip install pypdf2 img2pdf
   pip install psycopg2-binary
   ```

#### 2.2 Crear Estructura del Proyecto Backend
1. Abre VS Code
2. Abre una nueva carpeta para el proyecto: C:\Users\[usuario]\siniestros-app
3. Abre una nueva terminal en VS Code
4. Crea la estructura del backend:
   ```
   mkdir backend
   cd backend
   mkdir app
   cd app
   mkdir api core db models schemas services
   cd api
   mkdir endpoints
   cd ..
   cd services
   mkdir ocr documents email
   cd ..\..
   mkdir tests
   ```

#### 2.3 Configurar el Intérprete de Python en VS Code
1. Presiona Ctrl+Shift+P
2. Escribe "Python: Select Interpreter"
3. Selecciona el entorno "siniestros-app"

#### 2.4 Crear Archivos Básicos del Backend
1. Crea el archivo `backend/app/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Siniestros API",
    description="API para la gestión de siniestros de seguros",
    version="0.1.0",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Gestión de Siniestros"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "El servicio está funcionando correctamente"}
```

2. Crea el archivo `backend/app/core/config.py`:

```python
from pydantic import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Siniestros App"
    
    # JWT
    SECRET_KEY: str = "tu_clave_secreta_aqui"  # Cambiar en producción
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 días
    
    # Base de datos
    DATABASE_URL: str = "postgresql://postgres:password@localhost/siniestros"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000"]

    class Config:
        case_sensitive = True

settings = Settings()
```

3. Crea el archivo `backend/app/db/base_class.py`:

```python
from typing import Any
from sqlalchemy.ext.declarative import as_declarative, declared_attr

@as_declarative()
class Base:
    id: Any
    __name__: str
    
    # Genera tablename automáticamente
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
```

### Fase 3: Creación del Proyecto Frontend (React)

#### 3.1 Crear Proyecto React
1. En VS Code, abre una nueva terminal
2. Navega a la carpeta raíz del proyecto:
   ```
   cd C:\Users\[usuario]\siniestros-app
   ```

3. Crea la aplicación React:
   ```
   npx create-react-app frontend
   ```

4. Instala dependencias adicionales:
   ```
   cd frontend
   npm install axios react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled formik yup
   ```

#### 3.2 Crear Estructura de Carpetas del Frontend
1. En VS Code, navega a la carpeta frontend
2. Crea las siguientes carpetas:
   ```
   mkdir src\components
   mkdir src\components\layout
   mkdir src\components\siniestros
   mkdir src\pages
   mkdir src\services
   mkdir src\utils
   ```

#### 3.3 Crear Servicio API
1. Crea el archivo `frontend/src/services/api.js`:

```javascript
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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### 3.4 Crear Componente Home Simple
1. Crea el archivo `frontend/src/pages/Home.js`:

```jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, CircularProgress } from '@mui/material';
import apiClient from '../services/api';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await apiClient.get('/api/health');
        setApiStatus(response.data);
        setLoading(false);
      } catch (error) {
        setApiStatus({ status: 'error', message: 'No se pudo conectar con la API' });
        setLoading(false);
      }
    };

    checkApiStatus();
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sistema de Gestión de Siniestros
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Estado del Sistema
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" color={apiStatus?.status === 'ok' ? 'success.main' : 'error.main'}>
                Estado: {apiStatus?.status === 'ok' ? 'Conectado' : 'Desconectado'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {apiStatus?.message}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
```

2. Edita el archivo `frontend/src/App.js`:

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### Fase 4: Ejecutar la Aplicación

#### 4.1 Iniciar el Backend
1. Abre una nueva terminal en VS Code
2. Navega a la carpeta backend:
   ```
   cd C:\Users\[usuario]\siniestros-app\backend
   ```

3. Activa el entorno virtual si no está activo:
   ```
   conda activate siniestros-app
   ```

4. Inicia el servidor FastAPI:
   ```
   uvicorn app.main:app --reload
   ```

5. Verifica que el servidor esté funcionando accediendo a:
   - http://localhost:8000/
   - http://localhost:8000/api/health

#### 4.2 Iniciar el Frontend
1. Abre otra terminal en VS Code
2. Navega a la carpeta frontend:
   ```
   cd C:\Users\[usuario]\siniestros-app\frontend
   ```

3. Inicia el servidor de desarrollo React:
   ```
   npm start
   ```

4. Se abrirá automáticamente http://localhost:3000/ en tu navegador

### Fase 5: Verificar la Integración

1. En el navegador, la aplicación React debería mostrar:
   - Título "Sistema de Gestión de Siniestros"
   - Un panel de estado mostrando "Conectado" (si el backend está en ejecución)

2. Si todo funciona correctamente, has configurado exitosamente la base del MVP.

## Próximos Pasos

Una vez que tengas este esqueleto funcionando, puedes comenzar a desarrollar las funcionalidades específicas:

1. Implementar autenticación de usuarios
2. Desarrollar la gestión de siniestros
3. Crear el módulo de OCR
4. Añadir la funcionalidad de carga de documentos

Este MVP proporciona la base sólida sobre la que puedes construir todas las funcionalidades descritas en tu especificación original.