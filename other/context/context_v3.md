# Contexto Completo (v2): Sistema de Gestión de Siniestros para Agentes de Seguros

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
   - Sistema de autenticación con registro e inicio de sesión
   - Dashboard básico para visualización de estadísticas
   - Listado de siniestros y documentos (UI implementada)
   - Navegación entre secciones

4. **Integración**
   - ✅ Comunicación verificada entre backend y frontend
   - ✅ Sistema de autenticación funcional
   - ✅ Navegación entre las distintas secciones de la aplicación

## Problemas Resueltos

1. **Problemas de CORS**:
   - Solucionado mediante configuración adecuada en backend
   - Implementación de proxy en frontend como alternativa

2. **Problemas con acceso a base de datos**:
   - Corrección de la función `get_db` en el backend
   - Solución a error "generator object has no attribute 'query'"

3. **Problemas con autenticación**:
   - Formato correcto para solicitudes OAuth2
   - Implementación adecuada de URLSearchParams en frontend

4. **Compatibilidad con Pydantic V2**:
   - Instalación de pydantic-settings
   - Actualización de orm_mode a from_attributes
   - Gestión de dependencias específicas

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
    │   ├── layout/
    │   │   ├── MainLayout.js
    │   │   ├── Navbar.js
    │   │   └── Sidebar.js
    │   └── ProtectedRoute.js
    ├── context/
    │   └── AuthContext.js
    ├── pages/
    │   ├── documents/
    │   │   └── DocumentsList.js
    │   ├── siniestros/
    │   │   ├── NewSiniestro.js
    │   │   └── SiniestrosList.js
    │   ├── Dashboard.js
    │   ├── Home.js
    │   ├── Login.js
    │   ├── Register.js
    │   └── Unauthorized.js
    ├── services/
    │   └── api.js
    ├── App.css
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

## Funcionalidades Implementadas

### 1. Autenticación de Usuarios
- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión con credenciales
- ✅ Protección de rutas
- ✅ Manejo de roles (agente vs usuario normal)

### 2. Interfaz Principal
- ✅ Dashboard con estadísticas básicas
- ✅ Navegación entre secciones
- ✅ Listado de siniestros (interfaz)
- ✅ Listado de documentos (interfaz)

## Próximos Pasos

Necesitamos implementar:

1. **Completar la gestión de siniestros**:
   - Conectar formularios con backend
   - Implementar creación real de siniestros
   - Implementar edición y eliminación

2. **Gestión documental completa**:
   - Implementar carga real de documentos
   - Integración con OCR
   - Validación de documentos

3. **Dashboard con datos reales**:
   - Mostrar estadísticas basadas en datos reales
   - Implementar gráficos y visualizaciones

4. **Gestión de usuarios completa**:
   - Implementar panel de administración
   - Gestión de roles y permisos

## Estado de Ejecución

El backend está funcionando correctamente en http://localhost:8000 con la documentación API accesible en /docs.

El frontend está funcionando correctamente en http://localhost:3000 con:
- Conexión verificada al backend
- Sistema de autenticación funcional
- Navegación entre secciones

La base de datos PostgreSQL está configurada y funcionando con las tablas iniciales creadas.

## Usuarios de Prueba Disponibles

### Administrador:
- Email: admin@example.com
- Contraseña: adminpassword

### Usuario Normal:
- Email: test@example.com
- Contraseña: password123

### Agente:
- Email: agent@example.com
- Contraseña: agentpass