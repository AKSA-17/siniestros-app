# Guía de Git para el Proyecto de Gestión de Siniestros

Esta guía cubre los comandos y flujos de trabajo de Git necesarios para el desarrollo del Sistema de Gestión de Siniestros.

## Configuración Inicial

Si aún no has configurado Git en tu sistema, sigue estos pasos:

1. **Configurar identidad**:
   ```bash
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu.email@example.com"
   ```

2. **Configurar editor predeterminado** (opcional):
   ```bash
   git config --global core.editor "code --wait"  # Para VS Code
   ```

3. **Configurar que no haga fast-forward en merge** (recomendado):
   ```bash
   git config --global merge.ff false
   ```

## Inicialización del Repositorio

Si estás comenzando el proyecto desde cero:

```bash
# Crear directorio del proyecto
mkdir siniestros-app
cd siniestros-app

# Inicializar repositorio Git
git init
```

Si estás clonando el repositorio existente:

```bash
git clone [URL_DEL_REPOSITORIO]
cd siniestros-app
```

## Flujo de Trabajo Básico

### 1. Crear y cambiar a una rama de funcionalidad

Para cada nueva funcionalidad o corrección, crea una rama dedicada:

```bash
# Ver todas las ramas
git branch

# Crear y cambiar a una nueva rama
git checkout -b feature/auth-system

# O en versiones recientes de Git
git switch -c feature/auth-system
```

### 2. Realizar cambios y hacer commits

```bash
# Verificar archivos modificados
git status

# Añadir archivos específicos al área de preparación
git add backend/app/api/endpoints/login.py
git add frontend/src/context/AuthContext.js

# O añadir todos los cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "Implementa sistema de autenticación JWT"
```

### 3. Sincronizar con el repositorio remoto

```bash
# Obtener cambios del remoto (sin aplicarlos)
git fetch origin

# Obtener y aplicar cambios de la rama principal
git pull origin main

# Enviar cambios al remoto
git push origin feature/auth-system
```

### 4. Fusionar cambios a la rama principal

Una vez que la funcionalidad está completa y probada:

```bash
# Cambiar a la rama principal
git checkout main

# Fusionar la rama de funcionalidad
git merge feature/auth-system

# Publicar cambios
git push origin main
```

## Comandos Útiles para el Proyecto

### Guardar cambios temporalmente (stash)

Útil cuando necesitas cambiar rápidamente de contexto sin hacer commit:

```bash
# Guardar cambios en el stash
git stash save "Cambios en autenticación en progreso"

# Listar stashes guardados
git stash list

# Aplicar el último stash y mantenerlo en la lista
git stash apply

# Aplicar un stash específico
git stash apply stash@{2}

# Aplicar el último stash y eliminarlo de la lista
git stash pop
```

### Ver historial de cambios

```bash
# Ver historial de commits
git log

# Ver historial resumido en una línea
git log --oneline

# Ver historial con gráfico de ramas
git log --graph --oneline --all

# Ver cambios en un archivo específico
git log -p backend/app/main.py
```

### Comparar cambios

```bash
# Ver cambios no preparados (unstaged)
git diff

# Ver cambios preparados (staged)
git diff --staged

# Comparar con la versión del último commit
git diff HEAD

# Comparar dos ramas
git diff main feature/auth-system
```

### Resolver conflictos de fusión

Cuando ocurre un conflicto durante una fusión:

1. **Identificar archivos con conflictos**:
   ```bash
   git status
   ```

2. **Abrir archivos conflictivos y editar**:
   Los conflictos se marcan con:
   ```
   <<<<<<< HEAD
   código de la rama actual
   =======
   código de la rama que estás fusionando
   >>>>>>> feature/branch-name
   ```

3. **Marcar como resuelto y completar la fusión**:
   ```bash
   git add [archivos resueltos]
   git commit -m "Resuelve conflictos de fusión"
   ```

### Deshacer cambios

```bash
# Descartar cambios en un archivo no preparado
git checkout -- backend/app/main.py

# Descartar todos los cambios no preparados
git checkout -- .

# Deshacer el último commit manteniendo los cambios
git reset HEAD~1

# Deshacer el último commit descartando los cambios (¡peligroso!)
git reset --hard HEAD~1

# Crear un nuevo commit que deshaga cambios previos
git revert HEAD
```

## Estructura de Ramas del Proyecto

En nuestro proyecto utilizamos la siguiente estructura de ramas:

- **main**: Código estable y listo para producción
- **develop**: Rama de integración para funcionalidades en desarrollo
- **feature/nombre-caracteristica**: Ramas para desarrollo de funcionalidades
- **fix/descripcion-problema**: Ramas para corrección de errores
- **release/version**: Ramas para preparación de versiones

## Convenciones para Mensajes de Commit

Seguimos estas convenciones para los mensajes de commit:

```
tipo(alcance): mensaje descriptivo
```

Donde:
- **tipo**: feat (nueva funcionalidad), fix (corrección), docs (documentación), style (formato), refactor, test, chore (tareas rutinarias)
- **alcance**: backend, frontend, auth, db, etc.
- **mensaje**: descripción concisa en tiempo presente

Ejemplos:
- `feat(auth): implementa registro de usuarios`
- `fix(cors): corrige problema de CORS en endpoint login`
- `docs(readme): actualiza instrucciones de instalación`

## Flujo de Trabajo para Versiones

Para crear una nueva versión:

1. **Preparar rama de release**:
   ```bash
   git checkout -b release/1.0.0 develop
   ```

2. **Realizar ajustes finales y correcciones**:
   ```bash
   # Arreglos menores
   git commit -m "chore(release): ajustes para versión 1.0.0"
   ```

3. **Fusionar a main y etiquetar**:
   ```bash
   git checkout main
   git merge release/1.0.0
   git tag -a v1.0.0 -m "Versión 1.0.0"
   git push origin main --tags
   ```

4. **Fusionar de vuelta a develop**:
   ```bash
   git checkout develop
   git merge release/1.0.0
   git push origin develop
   ```

5. **Eliminar rama de release**:
   ```bash
   git branch -d release/1.0.0
   ```

## Solución de Problemas Comunes

### El push fue rechazado

```bash
# Obtener cambios remotos
git fetch origin
# Integrar cambios
git pull origin main
# Intentar push nuevamente
git push origin main
```

### Commit en la rama equivocada

```bash
# Guardar los cambios en un stash
git stash
# Cambiar a la rama correcta
git checkout feature/rama-correcta
# Aplicar los cambios
git stash pop
# Hacer commit 
git add .
git commit -m "mensaje apropiado"
```

### Necesito deshacer la fusión más reciente

```bash
# Si aún no has hecho push
git reset --hard ORIG_HEAD

# Si ya has hecho push (crea un nuevo commit que revierte la fusión)
git revert -m 1 HEAD
```