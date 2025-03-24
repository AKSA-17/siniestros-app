# Guía de Pruebas y Operaciones POST

Esta guía detalla cómo probar operaciones POST y otras operaciones de escritura en el Sistema de Gestión de Siniestros.

## Pruebas mediante Swagger UI

FastAPI genera automáticamente una interfaz Swagger que permite probar directamente los endpoints de la API sin necesidad de herramientas externas.

### Acceder a Swagger UI

1. Asegúrate de que el backend esté en ejecución:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. Abre en tu navegador:
   ```
   http://localhost:8000/docs
   ```

3. Verás una interfaz interactiva con todos los endpoints disponibles, agrupados por categorías.

### Probar el Endpoint de Registro de Usuarios

1. En Swagger UI, busca y expande el endpoint `POST /api/users/open`
2. Haz clic en el botón "Try it out"
3. En el campo de entrada JSON, proporciona los datos de un nuevo usuario:
   ```json
   {
     "email": "nuevo_usuario@example.com",
     "password": "password123",
     "full_name": "Nuevo Usuario",
     "is_agent": false
   }
   ```
4. Haz clic en "Execute"
5. Observa la respuesta:
   - Código de estado 200: El usuario se creó correctamente
   - Código de estado 400: El usuario ya existe o datos inválidos
   - Código de estado 422: Error de validación en los datos

**¿Qué ocurre internamente?**
- La solicitud se envía al endpoint `/api/users/open`
- El esquema `UserCreate` de Pydantic valida los datos
- El sistema verifica si el email ya existe en la base de datos
- Si todo es correcto, se crea el usuario con la contraseña hasheada
- Se devuelve el objeto usuario (sin la contraseña) como respuesta

### Probar el Endpoint de Login

1. En Swagger UI, busca y expande el endpoint `POST /api/login/access-token`
2. Haz clic en el botón "Try it out"
3. Este endpoint utiliza form-data, no JSON:
   - username: email@example.com
   - password: tucontraseña
4. Haz clic en "Execute"
5. La respuesta debería incluir un `access_token` que se usará para autenticación posterior

**¿Qué ocurre internamente?**
- El sistema verifica las credenciales contra la base de datos
- Si son correctas, genera un token JWT firmado
- Este token contiene el ID del usuario y tiene un tiempo de expiración (8 días por defecto)

### Probar la Autenticación

Una vez que tengas un token de acceso:

1. En Swagger UI, haz clic en el botón "Authorize" (icono de candado)
2. Ingresa el token con el formato: `Bearer tu_token_aquí`
3. Ahora puedes acceder a endpoints protegidos, como `GET /api/users/me`

## Pruebas mediante Postman

Postman ofrece una interfaz más completa para probar APIs, especialmente útil para solicitudes complejas.

### Configuración de Postman para el Proyecto

1. Crea una nueva colección llamada "Sistema de Siniestros"
2. Crea una variable de entorno `base_url` con valor `http://localhost:8000`
3. Crea una variable de entorno `token` (inicialmente vacía)

### Prueba de Registro de Usuario

1. Crea una nueva solicitud POST a `{{base_url}}/api/users/open`
2. En la pestaña "Headers", añade:
   - Key: `Content-Type`
   - Value: `application/json`
3. En la pestaña "Body", selecciona "raw" y "JSON", e ingresa:
   ```json
   {
     "email": "usuario_postman@example.com",
     "password": "password123",
     "full_name": "Usuario Postman",
     "is_agent": true
   }
   ```
4. Envía la solicitud y verifica la respuesta

### Prueba de Login y Obtención de Token

1. Crea una nueva solicitud POST a `{{base_url}}/api/login/access-token`
2. En la pestaña "Headers", añade:
   - Key: `Content-Type`
   - Value: `application/x-www-form-urlencoded`
3. En la pestaña "Body", selecciona "x-www-form-urlencoded" y añade:
   - Key: `username`, Value: `usuario_postman@example.com`
   - Key: `password`, Value: `password123`
4. Envía la solicitud
5. En la pestaña "Tests", añade código para guardar el token automáticamente:
   ```javascript
   var jsonData = pm.response.json();
   pm.environment.set("token", jsonData.access_token);
   ```

### Prueba de Endpoints Protegidos

1. Crea una nueva solicitud GET a `{{base_url}}/api/users/me`
2. En la pestaña "Authorization":
   - Type: "Bearer Token"
   - Token: `{{token}}`
3. Envía la solicitud y verifica que obtienes la información de tu usuario

## Pruebas de Creación de Siniestros

### Mediante Swagger UI

1. En Swagger UI, busca y expande el endpoint `POST /api/siniestros/`
2. Haz clic en "Authorize" e ingresa el token de acceso
3. Haz clic en "Try it out"
4. Proporciona datos para un nuevo siniestro:
   ```json
   {
     "numero_poliza": "POL-12345",
     "asegurado": "Juan Pérez",
     "tipo_siniestro": "Automóvil",
     "descripcion": "Colisión en estacionamiento",
     "prioridad": "Media"
   }
   ```
5. Haz clic en "Execute" y verifica la respuesta

### Mediante Postman

1. Crea una nueva solicitud POST a `{{base_url}}/api/siniestros/`
2. Añade autorización Bearer Token usando `{{token}}`
3. En la pestaña "Body", selecciona "raw" y "JSON", e ingresa:
   ```json
   {
     "numero_poliza": "POL-67890",
     "asegurado": "Ana García",
     "tipo_siniestro": "Hogar",
     "descripcion": "Daños por inundación",
     "prioridad": "Alta"
   }
   ```
4. Envía la solicitud y verifica la respuesta

## Pruebas de Subida de Documentos

La subida de documentos es más compleja porque implica enviar archivos.

### Mediante Postman

1. Crea una nueva solicitud POST a `{{base_url}}/api/documents/upload/1` (donde "1" es el ID del siniestro)
2. Añade autorización Bearer Token usando `{{token}}`
3. En la pestaña "Body", selecciona "form-data" y añade:
   - Key: `document_type`, Value: `INE` (como texto)
   - Key: `file`, Value: [selecciona un archivo PDF o imagen] (como tipo File)
4. Envía la solicitud y verifica la respuesta

## Respuestas Esperadas

### Códigos de Estado Comunes

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado correctamente
- **400 Bad Request**: Solicitud inválida (ej. datos incorrectos)
- **401 Unauthorized**: No autenticado (token faltante o inválido)
- **403 Forbidden**: No autorizado (no tiene permisos suficientes)
- **404 Not Found**: Recurso no encontrado
- **422 Unprocessable Entity**: Error de validación de datos
- **500 Internal Server Error**: Error del servidor

### Formato de Respuestas Exitosas

```json
{
  "id": 1,
  "numero_poliza": "POL-12345",
  "asegurado": "Juan Pérez",
  "fecha_siniestro": "2023-05-15T10:30:00",
  "fecha_reporte": "2023-05-15T10:30:00",
  "tipo_siniestro": "Automóvil",
  "descripcion": "Colisión en estacionamiento",
  "estado": "Nuevo",
  "prioridad": "Media",
  "owner_id": 1
}
```

### Formato de Respuestas de Error

```json
{
  "detail": "Siniestro no encontrado"
}
```

## Consejos para Pruebas Efectivas

1. **Prueba primero endpoints públicos**: Verifica que el registro y login funcionen antes de probar endpoints protegidos

2. **Prueba el flujo completo**: Crea un usuario, inicia sesión, crea un siniestro, sube documentos, etc.

3. **Verifica restricciones**:
   - Intenta acceder a recursos sin autenticación
   - Intenta acceder a recursos de otro usuario como usuario normal
   - Intenta realizar acciones administrativas como usuario normal

4. **Guarda ejemplos de solicitudes exitosas**: Te servirán como referencia para el desarrollo del frontend

5. **Automatiza casos de prueba comunes**: Usa scripts de prueba en Postman o escribe pruebas automatizadas