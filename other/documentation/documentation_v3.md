# Guía Completa para Desarrollo: Sistema de Gestión de Siniestros (v3)

Este documento contiene la guía actualizada del proyecto con las lecciones aprendidas y las soluciones implementadas para los problemas encontrados durante el desarrollo.

## Arquitectura del Proyecto

El Sistema de Gestión de Siniestros utiliza una arquitectura de dos componentes principales:

### 1. Frontend (React)
- **Tecnología**: React.js con Material UI
- **Propósito**: Interfaz de usuario interactiva para agentes y asegurados
- **Principales componentes**: 
  - Dashboard para visualización de estadísticas
  - Gestión de siniestros
  - Gestión documental
  - Sistema de autenticación de usuarios

### 2. Backend (Python FastAPI)
- **Tecnología**: FastAPI (Python)
- **Propósito**: API RESTful para la lógica de negocio y procesamiento de datos
- **Componentes principales**:
  - API RESTful con autenticación JWT
  - Modelos y esquemas para validación de datos
  - Operaciones CRUD para entidades del sistema
  - Integración con servicio OCR

### 3. Componentes Complementarios
- **Base de datos**: PostgreSQL (relacional)
- **Servicio OCR**: Tesseract/EasyOCR para extracción de datos de documentos
- **Autenticación**: JWT en FastAPI

## Requisitos de Software

### Para desarrollo en Windows
1. **Python** (vía Anaconda)
   - Anaconda o Miniconda
   - Python 3.10

2. **Node.js y npm**
   - Node.js LTS (v14+)

3. **Base de Datos**
   - PostgreSQL 17+

4. **Editor de código**
   - Visual Studio Code

5. **Herramientas adicionales**
   - Tesseract OCR (opcional, para desarrollo local de la funcionalidad OCR)

## Configuración del Entorno de Desarrollo

### 1. Preparación del Entorno Backend

1. **Crear y activar entorno Conda**:
   ```bash
   conda create -n siniestros-app python=3.10
   conda activate siniestros-app
   ```

2. **Instalar dependencias del backend**:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings
   pip install python-jose[cryptography] passlib[bcrypt] python-multipart
   pip install email-validator pytesseract easyocr pillow numpy
   pip install psycopg2-binary
   ```

3. **Configurar PostgreSQL**:
   - Crear base de datos "siniestros"
   - Usuario: postgres
   - Contraseña: database

### 2. Preparación del Entorno Frontend

1. **Instalar dependencias del frontend**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configuración adicional para desarrollo**:
   - Añadir proxy en package.json para evitar problemas CORS en desarrollo:
     ```json
     "proxy": "http://localhost:8000"
     ```

## Estructura del Proyecto

### Backend

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── documents.py    # Gestión de documentos
│   │   │   ├── health.py       # Endpoint de verificación de salud
│   │   │   ├── login.py        # Autenticación y generación de tokens
│   │   │   ├── siniestros.py   # Gestión de siniestros
│   │   │   └── users.py        # Gestión de usuarios
│   │   ├── api.py              # Registro de routers
│   │   └── deps.py             # Dependencias (autenticación, DB)
│   ├── core/
│   │   ├── config.py           # Configuraciones generales
│   │   └── security.py         # Funciones de seguridad
│   ├── crud/
│   │   ├── base.py             # Operaciones CRUD genéricas
│   │   ├── crud_document.py    # CRUD para documentos
│   │   ├── crud_siniestro.py   # CRUD para siniestros
│   │   └── crud_user.py        # CRUD para usuarios
│   ├── db/
│   │   ├── base.py             # Importación de modelos
│   │   ├── base_class.py       # Clase base para modelos
│   │   ├── init_db.py          # Inicialización de la DB
│   │   └── session.py          # Configuración de sesión
│   ├── models/                 # Modelos SQLAlchemy
│   ├── schemas/                # Esquemas Pydantic
│   ├── services/
│   │   └── ocr/                # Servicio OCR
│   └── main.py                 # Punto de entrada
└── prestart.py                 # Script de inicialización
```

### Frontend

```
frontend/
├── public/
└── src/
    ├── components/
    │   ├── layout/             # Componentes de estructura
    │   └── siniestros/         # Componentes específicos
    ├── context/
    │   └── AuthContext.js      # Contexto de autenticación
    ├── pages/
    │   ├── documents/          # Páginas de documentos
    │   ├── siniestros/         # Páginas de siniestros
    │   ├── Dashboard.js        # Panel principal
    │   ├── Home.js             # Página de inicio
    │   ├── Login.js            # Página de inicio de sesión
    │   └── Register.js         # Página de registro
    ├── services/
    │   └── api.js              # Cliente HTTP
    ├── App.js                  # Componente principal
    └── index.js                # Punto de entrada
```

## Problemas Comunes y Soluciones

### 1. Problemas CORS

**Síntoma**: Errores de CORS al intentar comunicarse entre frontend y backend.

**Solución**:
1. Configurar correctamente CORS en el backend:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
       allow_credentials=True,
       allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
       allow_headers=["*"],
   )
   ```

2. Alternativa: Configurar proxy en `package.json` del frontend:
   ```json
   "proxy": "http://localhost:8000"
   ```
   Y usar rutas relativas en las llamadas API.

### 2. Problemas con la Conexión a Base de Datos

**Síntoma**: Errores al intentar utilizar `db.query()` con el mensaje "generator object has no attribute 'query'".

**Solución**: Corregir la función `get_db` en `app/api/deps.py`:
```python
from app.db.session import get_db  # Importar directamente

# Eliminar o comentar la redefinición de la función get_db
# def get_db() -> Generator:
#    return get_db_session()
```

### 3. Problemas con la Autenticación

**Síntoma**: Errores al intentar iniciar sesión debido a formato incorrecto en la solicitud.

**Solución**: Usar `URLSearchParams` para el formato correcto en `AuthContext.js`:
```javascript
const formData = new URLSearchParams();
formData.append('username', email);
formData.append('password', password);

const response = await apiClient.post('/api/login/access-token', formData, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
```

### 4. Problemas con Dependencias Pydantic

**Síntoma**: Errores relacionados con `BaseSettings` o `orm_mode`.

**Solución**:
1. Instalar `pydantic-settings`:
   ```bash
   pip install pydantic-settings
   ```
2. Actualizar importaciones:
   ```python
   from pydantic_settings import BaseSettings
   ```
3. Actualizar esquemas para Pydantic v2:
   ```python
   class Config:
       from_attributes = True  # En lugar de orm_mode = True
   ```

## Flujo de Inicialización y Ejecución

### 1. Inicializar Base de Datos
```bash
cd backend
python prestart.py
```

### 2. Iniciar Backend
```bash
cd backend
uvicorn app.main:app --reload
```

### 3. Iniciar Frontend
```bash
cd frontend
npm start
```

### 4. Acceder a la Aplicación
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs

## Pruebas y Verificación

### 1. Verificar Conexión Backend-Frontend
Acceder a http://localhost:3000 y comprobar que muestra "Estado: Conectado".

### 2. Verificar Autenticación
Probar el registro e inicio de sesión con las credenciales predefinidas:
- Email: admin@example.com
- Contraseña: adminpassword

### 3. Pruebas de API con Swagger UI
Acceder a http://localhost:8000/docs para probar los endpoints directamente.

## Próximos Pasos de Desarrollo

1. **Implementación completa de la gestión de siniestros**:
   - Creación, edición y visualización de siniestros
   - Asignación de documentos a siniestros

2. **Gestión documental avanzada**:
   - Carga y procesamiento de documentos
   - Implementación del OCR para extracción de datos

3. **Mejoras en el dashboard**:
   - Visualización de estadísticas reales
   - Filtros avanzados

4. **Gestión de usuarios completa**:
   - Panel de administración
   - Gestión de roles y permisos

5. **Preparación para producción**:
   - Configuración de seguridad
   - Optimización de rendimiento