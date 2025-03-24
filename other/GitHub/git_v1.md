## Subir el proyecto a GitHub desde cero

### 1. Instalar y configurar Git (si no lo has hecho)

1. Verifica si Git está instalado:
   ```
   git --version
   ```

2. Si no está instalado, descárgalo e instálalo desde: https://git-scm.com/

3. Configura tu identidad en Git:
   ```
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu.email@ejemplo.com"
   ```

### 2. Crear un repositorio en GitHub

1. Visita https://github.com/new
2. Inicia sesión con tu cuenta AKSA-17
3. Nombra tu repositorio (por ejemplo, "siniestros-app")
4. Puedes agregar una descripción opcional (por ejemplo, "Sistema de gestión de siniestros para agentes de seguros")
5. Deja el repositorio como "Público" (o "Privado" si prefieres)
6. No inicialices el repositorio con README, .gitignore o licencia
7. Haz clic en "Create repository"

### 3. Inicializar Git en tu proyecto local

1. Abre una terminal y navega a la carpeta raíz de tu proyecto:
   ```
   cd C:\Users\andre\siniestros-app
   ```

2. Inicializa Git en este directorio:
   ```
   git init
   ```

### 4. Crear un archivo .gitignore

Crea un archivo llamado `.gitignore` en la raíz de tu proyecto con el siguiente contenido:

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
*.egg-info/
.installed.cfg
*.egg

# Node.js
node_modules/
/frontend/build
/frontend/.env.local
/frontend/.env.development.local
/frontend/.env.test.local
/frontend/.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Ambiente virtual
venv/
ENV/

# VS Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# Base de datos
*.sqlite3

# Otros
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 5. Añadir archivos al control de versiones

1. Agrega todos los archivos al staging area:
   ```
   git add .
   ```

2. Verifica que los archivos correctos se vayan a incluir:
   ```
   git status
   ```

3. Realiza el primer commit:
   ```
   git commit -m "Configuración inicial del proyecto de gestión de siniestros"
   ```

### 6. Conectar tu repositorio local con GitHub

1. Conecta tu repositorio local con el repositorio remoto en GitHub:
   ```
   git remote add origin https://github.com/AKSA-17/siniestros-app.git
   ```

2. Sube tus cambios a GitHub:
   ```
   git push -u origin master
   ```
   
   Si estás usando la rama `main` en lugar de `master`:
   ```
   git push -u origin main
   ```

3. Se te pedirá que ingreses tus credenciales de GitHub. Usa tu nombre de usuario y contraseña (o token de acceso personal si tienes habilitada la autenticación de dos factores).

### 7. Verificar que tu código esté en GitHub

1. Visita https://github.com/AKSA-17/siniestros-app
2. Deberías ver todos tus archivos subidos correctamente

## Solución de problemas comunes

### Si la rama principal se llama "main" en lugar de "master"

Git ahora utiliza "main" como nombre predeterminado para la rama principal. Si ese es tu caso:

```
git branch -M main
git push -u origin main
```

### Si necesitas un token de acceso personal

Si tienes habilitada la autenticación de dos factores:
1. Ve a GitHub > Settings > Developer settings > Personal access tokens
2. Genera un nuevo token con los permisos necesarios (al menos "repo")
3. Usa este token como contraseña cuando se te solicite

### Si ya existe un repositorio remoto configurado

Si intentas agregar un remoto y ya existe uno, puedes cambiar la URL:

```
git remote set-url origin https://github.com/AKSA-17/siniestros-app.git
```

## Actualizar el repositorio en el futuro

Cuando hagas cambios locales y quieras actualizarlos en GitHub:

```
git add .
git commit -m "Descripción de los cambios"
git push
```

¿Necesitas ayuda con alguno de estos pasos específicos?