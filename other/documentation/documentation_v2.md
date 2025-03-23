# Guía Completa para Desarrollo de MVP: Sistema de Gestión de Siniestros (Actualizada)

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
   - Python 3.10

2. **Node.js y npm**
   - Node.js LTS (v14+)
   - npm (incluido con Node.js)

3. **Bases de Datos**
   - PostgreSQL 17+ 

4. **Editores/IDE**
   - Visual Studio Code

5. **Herramientas Adicionales**
   - Git
   - Tesseract OCR (para reconocimiento de documentos)

## Preparación del Entorno (Windows)

### 1. Configurar Entorno Conda
1. Crear entorno Conda:
   ```
   conda create -n siniestros-app python=3.10
   conda activate siniestros-app
   ```

2. Instalar dependencias principales:
   ```
   pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings python-jose[cryptography] passlib[bcrypt] python-multipart email-validator
   ```

3. Instalar dependencias para OCR:
   ```
   pip install pytesseract easyocr pillow numpy
   ```

4. Instalar dependencias para procesamiento de documentos:
   ```
   pip install pypdf2 img2pdf
   ```

5. Instalar clientes de base de datos:
   ```
   pip install psycopg2-binary
   ```

### 2. Configurar Base de Datos PostgreSQL
1. Configurar PostgreSQL (usando contraseña "database" para usuario postgres)
2. Crear una base de datos llamada "siniestros" en pgAdmin
3. Verificar que puedes conectarte a la base de datos

### 3. Configurar VS Code
1. Instalar extensiones recomendadas para Python y React
2. Configurar el intérprete de Python en VS Code para usar el entorno conda "siniestros-app"
3. Añadir la configuración específica para el proyecto en `.vscode/settings.json` para apuntar al intérprete Python correcto

## Estructura del Proyecto Backend

### 1. Estructura de Carpetas
Crear la siguiente estructura de carpetas:
```
siniestros-app/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   └── __init__.py
│   │   ├── core/
│   │   │   └── __init__.py
│   │   ├── crud/
│   │   │   └── __init__.py
│   │   ├── db/
│   │   │   └── __init__.py
│   │   ├── models/
│   │   │   └── __init__.py
│   │   ├── schemas/
│   │   │   └── __init__.py
│   │   ├── services/
│   │   │   ├── ocr/
│   │   │   ├── documents/
│   │   │   ├── email/
│   │   │   └── __init__.py
│   │   └── __init__.py
│   ├── tests/
│   └── prestart.py
└── frontend/
    └── (estructura del frontend)
```

### 2. Archivos Base del Backend

#### 2.1 Configuración Principal

1. Crea el archivo `backend/app/main.py`:
   - Define la aplicación FastAPI principal
   - Configura middleware CORS para permitir peticiones desde el frontend
   - Incluye rutas API
   - Define endpoints de salud y bienvenida

2. Crea el archivo `backend/app/core/config.py`:
   - Define configuraciones de la aplicación usando pydantic-settings
   - Configura URL de base de datos, clave secreta JWT, tiempos de expiración
   - Define orígenes CORS permitidos
   - Configura usuario administrador inicial

3. Crea el archivo `backend/app/core/security.py`:
   - Implementa funciones para hashing de contraseñas
   - Implementa generación y verificación de tokens JWT
   - Define algoritmos de seguridad

#### 2.2 Configuración de Base de Datos

1. Crea el archivo `backend/app/db/base_class.py`:
   - Define la clase base para todos los modelos SQLAlchemy
   - Configura generación automática de nombres de tablas

2. Crea el archivo `backend/app/db/session.py`:
   - Configura la conexión a PostgreSQL
   - Define funciones para obtener sesiones de base de datos

3. Crea el archivo `backend/app/db/base.py`:
   - Importa todos los modelos para que SQLAlchemy los reconozca

4. Crea el archivo `backend/app/db/init_db.py`:
   - Incluye función para inicializar la base de datos
   - Crea el primer usuario administrador

#### 2.3 Modelos de Base de Datos

1. Crea el archivo `backend/app/models/__init__.py`:
   - Importa y expone todos los modelos definidos

2. Crea el archivo `backend/app/models/user.py`:
   - Define el modelo de usuario con campos como email, contraseña, nombre, etc.
   - Establece relaciones con otros modelos

3. Crea el archivo `backend/app/models/siniestro.py`:
   - Define el modelo de siniestro con campos como póliza, asegurado, fechas, etc.
   - Establece relaciones con usuarios y documentos

4. Crea el archivo `backend/app/models/document.py`:
   - Define el modelo de documento con campos como nombre, ruta, tipo, etc.
   - Establece relación con siniestros

#### 2.4 Esquemas Pydantic

1. Crea el archivo `backend/app/schemas/__init__.py`:
   - Importa y expone todos los esquemas definidos

2. Crea el archivo `backend/app/schemas/token.py`:
   - Define esquemas para tokens de autenticación
   - Incluye payload de token JWT

3. Crea el archivo `backend/app/schemas/user.py`:
   - Define esquemas para usuarios (base, crear, actualizar, respuesta)
   - Incluye validación de email y contraseña

4. Crea el archivo `backend/app/schemas/siniestro.py`:
   - Define esquemas para siniestros (base, crear, actualizar, respuesta)
   - Incluye validación de campos obligatorios

5. Crea el archivo `backend/app/schemas/document.py`:
   - Define esquemas para documentos (base, crear, actualizar, respuesta)
   - Incluye validación de tipos de documento

#### 2.5 Operaciones CRUD

1. Crea el archivo `backend/app/crud/__init__.py`:
   - Importa y expone todas las clases CRUD definidas

2. Crea el archivo `backend/app/crud/base.py`:
   - Implementa clase base CRUD con operaciones genéricas
   - Incluye métodos para crear, leer, actualizar y eliminar

3. Crea el archivo `backend/app/crud/crud_user.py`:
   - Extiende la clase base CRUD para operaciones específicas de usuarios
   - Implementa autenticación y verificación de contraseñas

4. Crea el archivo `backend/app/crud/crud_siniestro.py`:
   - Extiende la clase base CRUD para operaciones específicas de siniestros
   - Implementa filtrado por propietario y número de póliza

5. Crea el archivo `backend/app/crud/crud_document.py`:
   - Extiende la clase base CRUD para operaciones específicas de documentos
   - Implementa filtrado por siniestro

#### 2.6 API Endpoints

1. Crea el archivo `backend/app/api/deps.py`:
   - Define dependencias comunes para endpoints
   - Implementa verificación de tokens y obtención de usuario actual
   - Define verificación de roles (agente vs cliente)

2. Crea el archivo `backend/app/api/api.py`:
   - Registra todos los routers de endpoints
   - Organiza endpoints por categorías

3. Crea el archivo `backend/app/api/endpoints/health.py`:
   - Implementa endpoint para verificar estado del sistema

4. Crea el archivo `backend/app/api/endpoints/login.py`:
   - Implementa endpoints de autenticación
   - Maneja generación de tokens JWT

5. Crea el archivo `backend/app/api/endpoints/users.py`:
   - Implementa CRUD para usuarios
   - Incluye endpoint para perfil propio

6. Crea el archivo `backend/app/api/endpoints/siniestros.py`:
   - Implementa CRUD para siniestros
   - Maneja permisos basados en roles

7. Crea el archivo `backend/app/api/endpoints/documents.py`:
   - Implementa carga y gestión de documentos
   - Incluye integración con servicio OCR

#### 2.7 Servicios

1. Crea el archivo `backend/app/services/ocr/service.py`:
   - Implementa servicio OCR usando Tesseract/EasyOCR
   - Incluye extracción específica para documentos como INE

2. Crea el archivo `backend/prestart.py`:
   - Implementa script para inicializar la base de datos
   - Crea tablas y usuario inicial

## Estructura del Proyecto Frontend

### 1. Estructura de Carpetas
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   └── siniestros/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.js
│   ├── index.js
│   └── ...
└── package.json
```

### 2. Archivos Principales del Frontend

1. Crea el archivo `frontend/src/services/api.js`:
   - Configura cliente Axios para comunicación con API
   - Implementa interceptor para tokens de autenticación

2. Crea el archivo `frontend/src/pages/Home.js`:
   - Implementa página principal
   - Muestra estado de conexión con backend

3. Actualiza el archivo `frontend/src/App.js`:
   - Configura rutas con React Router
   - Implementa estructura básica de aplicación

## Procedimiento de Inicialización

### 1. Inicializar Base de Datos
1. Ejecutar el script de inicialización:
   ```
   cd backend
   python prestart.py
   ```
   - Esto crea las tablas en PostgreSQL y el usuario inicial

### 2. Iniciar Backend
1. Ejecutar el servidor FastAPI:
   ```
   cd backend
   uvicorn app.main:app --reload
   ```
   - El backend estará disponible en http://localhost:8000
   - La documentación API estará en http://localhost:8000/docs

### 3. Iniciar Frontend
1. En otra terminal, ejecutar el servidor de desarrollo React:
   ```
   cd frontend
   npm start
   ```
   - El frontend estará disponible en http://localhost:3000

## Solución de Problemas Comunes

### 1. Problemas con Pydantic
- Si encuentras errores relacionados con `BaseSettings`, instala `pydantic-settings`:
  ```
  pip install pydantic-settings
  ```
- Actualiza las importaciones usando `from pydantic_settings import BaseSettings`

### 2. Problemas con Validación de Email
- Si encuentras errores sobre validación de email, instala `email-validator`:
  ```
  pip install email-validator
  ```

### 3. Problemas con Módulos No Encontrados
- Asegúrate de que todos los archivos `__init__.py` estén creados en cada carpeta
- Verifica que las importaciones usen la ruta correcta desde la raíz del proyecto

### 4. Problemas con ORM
- Actualiza las clases Config en esquemas Pydantic:
  ```python
  class Config:
      from_attributes = True  # En lugar de orm_mode = True para Pydantic v2
  ```

## Próximos Pasos

Una vez que tengas la estructura base funcionando, puedes proceder a implementar:

1. **Frontend completo**:
   - Página de login y registro
   - Dashboard de siniestros
   - Formularios de creación y edición
   - Visualización de documentos
   - Protección de rutas

2. **Funcionalidades avanzadas**:
   - OCR para diferentes tipos de documentos
   - Reportes y estadísticas
   - Notificaciones por email
   - Gestión de permisos más avanzada

Esta guía proporciona la base para desarrollar un Sistema de Gestión de Siniestros completo, modular y escalable, aprovechando tecnologías modernas como FastAPI y React.