# Preguntas Frecuentes y Conceptos Clave

## Conceptos de Backend

### ¿Qué es el modelo SQLAlchemy?
SQLAlchemy es un ORM (Object-Relational Mapping) para Python que permite interactuar con bases de datos relacionales usando objetos Python. En nuestro proyecto, los modelos SQLAlchemy (en la carpeta `app/models/`) definen la estructura de las tablas de la base de datos y sus relaciones. En lugar de escribir consultas SQL directamente, trabajamos con estos objetos Python, lo que facilita el desarrollo y mantenimiento.

### ¿Qué es el sistema de autenticación JWT?
JWT (JSON Web Token) es un estándar para crear tokens de acceso que permiten la autenticación segura entre aplicaciones. En nuestro sistema:
- Cuando un usuario inicia sesión correctamente, el backend genera un token JWT firmado con una clave secreta
- Este token contiene información cifrada sobre el usuario (como su ID)
- El frontend almacena este token (en localStorage) y lo envía en cada solicitud posterior
- El backend verifica la validez del token para permitir o denegar acceso a recursos protegidos

El sistema completo está implementado en `app/core/security.py` (generación de tokens), `app/api/deps.py` (verificación) y `AuthContext.js` en el frontend (manejo de tokens).

### ¿Para qué es Uvicorn?
Uvicorn es un servidor ASGI (Asynchronous Server Gateway Interface) para Python. En nuestro proyecto, lo utilizamos para ejecutar la aplicación FastAPI. Al ejecutar `uvicorn app.main:app --reload`, estamos iniciando el servidor que:
- Carga nuestra aplicación FastAPI definida en `app/main.py`
- La hace accesible a través de HTTP en http://localhost:8000
- Detecta cambios en el código y reinicia automáticamente (gracias al flag `--reload`)

### ¿Qué es Swagger UI y dónde está disponible?
Swagger UI es una interfaz web que FastAPI genera automáticamente para documentar y probar nuestra API. Proporciona:
- Documentación interactiva de todos los endpoints
- Formularios para probar cada endpoint directamente desde el navegador
- Información sobre parámetros, tipos de datos y respuestas esperadas

Está disponible en http://localhost:8000/docs cuando el backend está en ejecución.

## Conceptos de Frontend

### ¿Por qué todo está en la carpeta src?
La estructura con una carpeta `src/` es una convención estándar en proyectos React (especialmente los creados con Create React App):

- `src/`: Contiene todo el código fuente de la aplicación
  - `components/`: Componentes React reutilizables
  - `pages/`: Componentes de nivel superior que representan páginas completas
  - `context/`: Contextos de React para compartir estado global
  - `services/`: Servicios para comunicación con APIs externas

Esta estructura facilita la organización del código, la separación de responsabilidades y el mantenimiento a largo plazo.

### ¿Cómo funciona la estructura de carpetas del frontend?
La estructura sigue un patrón común en aplicaciones React:

- `components/`: Elementos UI reutilizables
  - `layout/`: Componentes de estructura (navbar, sidebar, etc.)
  - Otros componentes específicos agrupados por funcionalidad
- `pages/`: Componentes que representan páginas completas
  - Organizados por secciones principales de la aplicación
- `context/`: Proveedores de contexto para estado global
  - `AuthContext.js`: Gestión de autenticación y usuario actual
- `services/`: Lógica de comunicación con servicios externos
  - `api.js`: Cliente HTTP para comunicación con el backend

## Problemas Comunes y Soluciones

### ¿Cómo solucionar problemas de CORS?
Los problemas de CORS (Cross-Origin Resource Sharing) ocurren cuando el frontend intenta comunicarse con un backend en un origen diferente. Para solucionarlos:

1. **En el backend**: Configurar correctamente el middleware CORS en `app/main.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **En el frontend**: Usar proxy en desarrollo. Añadir en `package.json`:
   ```json
   "proxy": "http://localhost:8000"
   ```
   Y luego usar rutas relativas en lugar de absolutas en las llamadas API.

### ¿Cómo corregir errores en la función get_db?
El error "generator object has no attribute 'query'" se produce porque la función `get_db` en `app/api/deps.py` estaba devolviendo un generador sin consumirlo. La solución:

1. Eliminar o comentar la redefinición redundante:
   ```python
   # Eliminar o comentar esta función
   # def get_db() -> Generator:
   #     return get_db_session()
   ```

2. Importar directamente la función correcta:
   ```python
   from app.db.session import get_db
   ```

### ¿Cómo formatear correctamente las solicitudes de login?
Para el endpoint de login que espera datos en formato `application/x-www-form-urlencoded`, usar `URLSearchParams` en el frontend:

```javascript
const formData = new URLSearchParams();
formData.append('username', email);
formData.append('password', password);

await apiClient.post('/api/login/access-token', formData, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
```

## Preguntas Adicionales

### ¿Cómo funciona la protección de rutas en el frontend?
Las rutas protegidas utilizan componentes `ProtectedRoute` y `PublicRoute` que:
1. Verifican el estado de autenticación a través del contexto `AuthContext`
2. Redirigen al usuario según su estado de autenticación y rol
3. Permiten mostrar contenido específico solo a usuarios autorizados

### ¿Por qué usamos PostgreSQL en lugar de otras bases de datos?
PostgreSQL ofrece varias ventajas para este proyecto:
1. Es una base de datos relacional robusta y madura
2. Tiene buen soporte para tipos de datos complejos
3. Se integra bien con SQLAlchemy
4. Ofrece buen rendimiento para consultas complejas
5. Es código abierto y ampliamente utilizado en producción

### ¿Cómo se implementa el OCR en la aplicación?
El OCR (Reconocimiento Óptico de Caracteres) está implementado en `app/services/ocr/service.py` y utiliza:
1. Tesseract como motor principal para extracción de texto
2. EasyOCR como alternativa para reconocimiento avanzado
3. Procesamiento específico para documentos como INE, donde se buscan patrones específicos

El frontend enviará documentos al backend, que luego usará estos servicios para extraer información relevante de los documentos.