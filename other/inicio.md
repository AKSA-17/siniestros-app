# Guía de Inicio y Ejecución del Proyecto

Este documento detalla los pasos necesarios para iniciar y ejecutar el Sistema de Gestión de Siniestros en tu entorno local.

## Requisitos Previos

Asegúrate de tener instalado:
- Python 3.10 (idealmente a través de Anaconda/Miniconda)
- Node.js y npm
- PostgreSQL (con una base de datos "siniestros" creada)
- Entorno virtual "siniestros-app" configurado con las dependencias necesarias

## Paso 1: Inicializar la Base de Datos

Este paso sólo es necesario la primera vez o cuando se realizan cambios importantes en los modelos:

```bash
# Navegar al directorio backend
cd siniestros-app/backend

# Activar el entorno virtual (si usas conda)
conda activate siniestros-app

# Ejecutar script de inicialización
python prestart.py
```

**¿Qué hace este paso?**
- Crea las tablas en la base de datos a partir de los modelos SQLAlchemy
- Genera usuarios iniciales para pruebas (admin, usuario normal, agente)
- Establece configuraciones iniciales necesarias

## Paso 2: Iniciar el Backend

```bash
# Asegúrate de estar en el directorio backend
cd siniestros-app/backend

# Activar el entorno virtual (si aún no está activado)
conda activate siniestros-app

# Iniciar el servidor FastAPI con recarga automática
uvicorn app.main:app --reload
```

**¿Qué hace este paso?**
- Inicia el servidor FastAPI en http://localhost:8000
- Carga todos los endpoints de la API
- Establece la conexión con la base de datos
- Configura CORS para permitir solicitudes desde el frontend
- Activa el modo de recarga automática para detectar cambios en el código

**Verificación:**
- Abre http://localhost:8000 en tu navegador - deberías ver un mensaje de bienvenida
- Abre http://localhost:8000/docs para acceder a la documentación Swagger de la API
- Prueba el endpoint http://localhost:8000/api/health para verificar el estado del servicio

## Paso 3: Iniciar el Frontend

Abre una nueva terminal (manteniendo el backend en ejecución):

```bash
# Navegar al directorio frontend
cd siniestros-app/frontend

# Iniciar el servidor de desarrollo React
npm start
```

**¿Qué hace este paso?**
- Inicia el servidor de desarrollo de React en http://localhost:3000
- Compila los archivos JavaScript/JSX y CSS
- Establece la conexión con el backend a través del proxy configurado
- Activa la recarga automática del navegador cuando se detectan cambios

**Verificación:**
- Se abrirá automáticamente http://localhost:3000 en tu navegador
- Verifica que muestra "Estado: Conectado" en la página de inicio
- Esto confirma que el frontend puede comunicarse correctamente con el backend

## Paso 4: Navegación y Prueba del Sistema

Una vez que ambos servidores están en ejecución, puedes probar el sistema:

1. **Iniciar sesión**:
   - Accede a http://localhost:3000/login
   - Usa las credenciales preconfiguradas:
     * Admin: admin@example.com / adminpassword
     * Usuario: test@example.com / password123
     * Agente: agent@example.com / agentpass

2. **Explorar el dashboard**:
   - Después de iniciar sesión, serás redirigido al dashboard
   - Navega por las diferentes secciones usando el menú lateral

3. **Probar funcionalidades**:
   - Explora las secciones de siniestros y documentos
   - Intenta crear un nuevo siniestro
   - Verifica los diferentes permisos según el tipo de usuario

## Mantenimiento y Solución de Problemas

### Detener los Servidores

- Para detener cualquiera de los servidores, presiona `Ctrl+C` en la terminal correspondiente
- Es importante detener ambos servidores cuando hayas terminado para liberar los puertos

### Solución de Problemas Comunes

1. **Error "Address already in use"**:
   ```bash
   # Encuentra el proceso que usa el puerto (ejemplo para puerto 8000)
   netstat -ano | findstr :8000   # Windows
   lsof -i :8000                 # Mac/Linux
   
   # Termina el proceso
   taskkill /PID [número_pid] /F  # Windows
   kill -9 [número_pid]          # Mac/Linux
   ```

2. **Problemas de conexión frontend-backend**:
   - Verifica que ambos servidores estén en ejecución
   - Revisa la configuración CORS en `backend/app/main.py`
   - Verifica la configuración de proxy en `frontend/package.json`

3. **Errores de base de datos**:
   - Asegúrate de que PostgreSQL esté en ejecución
   - Verifica la cadena de conexión en `backend/app/core/config.py`
   - Ejecuta `python prestart.py` nuevamente para reinicializar la base de datos

## Flujo de Desarrollo

Cuando estés desarrollando nuevas funcionalidades:

1. **Backend**:
   - Realiza cambios en el código
   - El servidor se reiniciará automáticamente (gracias a `--reload`)
   - Prueba los cambios con Swagger UI (http://localhost:8000/docs)

2. **Frontend**:
   - Modifica los archivos en el directorio `frontend/src`
   - El navegador se actualizará automáticamente
   - Utiliza la consola del navegador (F12) para depurar

3. **Integración**:
   - Asegúrate de que los cambios en backend y frontend funcionen juntos
   - Verifica la comunicación entre ambos componentes