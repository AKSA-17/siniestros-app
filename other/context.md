# Contexto Completo: Desarrollo de Sistema de Gestión de Siniestros para Agentes de Seguros

## Descripción del Proyecto

Estamos desarrollando una plataforma web para gestión de siniestros dirigida a agentes de seguros independientes. El objetivo es facilitar la gestión de siniestros y mejorar la comunicación con sus clientes.

### Características Principales
- **Gestión de cola de trabajo**: Visualización y priorización de siniestros
- **Tablero de anotaciones**: Registro de información y adjuntos
- **Integración con correo**: Envío de correos genéricos y automáticos
- **Gestión documental**: Subida, validación y clasificación de documentos
- **OCR**: Extracción automática de datos de documentos (INE, pólizas, etc.)
- **Portal para asegurados**: Acceso web para clientes, envío de documentación

## Arquitectura Implementada

Hemos establecido una arquitectura de dos componentes principales:

### Backend
- **Tecnología**: Python con FastAPI
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT
- **Procesamiento**: OCR con Tesseract/EasyOCR

### Frontend
- **Tecnología**: React.js
- **UI Framework**: Material UI
- **Comunicación**: Axios para peticiones a la API
- **Enrutamiento**: React Router

## Estado Actual del Proyecto

Hemos completado:
1. **Configuración del entorno de desarrollo**
   - Entorno conda con Python 3.10
   - Instalación de PostgreSQL 17
   - Creación de base de datos "siniestros"

2. **Backend (FastAPI)**
   - Estructura completa de carpetas y archivos
   - Modelos SQLAlchemy para usuarios, siniestros y documentos
   - Esquemas Pydantic para validación de datos
   - Sistema CRUD base para todas las entidades
   - Endpoints API completos con documentación automática
   - Sistema de autenticación con JWT
   - Configuración de CORS para comunicación con frontend
   - Inicialización de base de datos

3. **Frontend (React)**
   - Estructura básica de proyecto
   - Servicio API para comunicación con backend
   - Página Home que verifica conexión con backend

4. **Integración**
   - Backend funcionando en http://localhost:8000
   - Frontend funcionando en http://localhost:3000
   - Comunicación verificada entre ambos componentes

## Estructura de Archivos

### Backend
```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── documents.py
│   │   │   ├── health.py
│   │   │   ├── login.py
│   │   │   ├── siniestros.py
│   │   │   └── users.py
│   │   ├── api.py
│   │   ├── deps.py
│   │   └── __init__.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── __init__.py
│   ├── crud/
│   │   ├── base.py
│   │   ├── crud_document.py
│   │   ├── crud_siniestro.py
│   │   ├── crud_user.py
│   │   └── __init__.py
│   ├── db/
│   │   ├── base.py
│   │   ├── base_class.py
│   │   ├── init_db.py
│   │   ├── session.py
│   │   └── __init__.py
│   ├── models/
│   │   ├── document.py
│   │   ├── siniestro.py
│   │   ├── user.py
│   │   └── __init__.py
│   ├── schemas/
│   │   ├── document.py
│   │   ├── siniestro.py
│   │   ├── token.py
│   │   ├── user.py
│   │   └── __init__.py
│   ├── services/
│   │   ├── ocr/
│   │   │   └── service.py
│   │   └── __init__.py
│   ├── main.py
│   └── __init__.py
└── prestart.py
```

### Frontend
```
frontend/
├── public/
└── src/
    ├── components/
    ├── pages/
    │   └── Home.js
    ├── services/
    │   └── api.js
    ├── App.js
    └── index.js
```

## Dependencias Instaladas

### Backend (Python)
- fastapi, uvicorn: Framework web y servidor
- sqlalchemy: ORM para base de datos
- pydantic, pydantic-settings: Validación de datos
- python-jose, passlib: Autenticación y seguridad
- email-validator: Validación de correos
- pytesseract, easyocr: OCR para documentos
- psycopg2-binary: Cliente PostgreSQL

### Frontend (JavaScript)
- react, react-dom: Biblioteca UI
- react-router-dom: Enrutamiento
- @mui/material, @mui/icons-material: Componentes UI
- axios: Cliente HTTP
- formik, yup: Manejo de formularios

## Problemas Resueltos

1. **Compatibilidad con Pydantic V2**:
   - Instalación de pydantic-settings
   - Actualización de orm_mode a from_attributes
   - Gestión de dependencias específicas

2. **Estructura de Módulos Python**:
   - Creación de archivos __init__.py adecuados
   - Resolución de importaciones circulares

3. **Configuración de Base de Datos**:
   - Creación correcta de base de datos PostgreSQL
   - Inicialización de esquemas y usuario inicial

## Próximos Pasos

Necesitamos implementar:

1. **Sistema completo de autenticación en frontend**:
   - Página de login y registro
   - Protección de rutas
   - Almacenamiento y gestión de tokens

2. **Gestión de siniestros**:
   - Formularios de creación y edición
   - Listado y búsqueda
   - Dashboard para agentes

3. **Gestión documental**:
   - Carga y visualización de documentos
   - Integración con OCR
   - Validación de documentos

4. **Interfaz para asegurados**:
   - Portal específico para clientes
   - Subida de documentos simplificada

## Estado de Ejecución

El backend está funcionando correctamente en http://localhost:8000 con la documentación API accesible en /docs.

El frontend está mostrando correctamente la página Home con el estado de conexión al backend.

La base de datos PostgreSQL está configurada y funcionando con las tablas iniciales creadas.

## Siguiente Enfoque

Queremos continuar con el desarrollo del sistema de autenticación completo en el frontend, para permitir registro de usuarios, login y protección de rutas.