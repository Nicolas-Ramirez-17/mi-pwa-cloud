# Foco — temporizador de estudio (PWA)

PWA para estudiar con la técnica Pomodoro: sesiones de 25 minutos, pausas de 5 y 15, lista de tareas y resumen del día. Todo se guarda en el navegador y sigue funcionando sin internet.

Hecha por **Nicolas Andres Ramirez Jarava** para el Laboratorio 7 (Cloud Computing), Nuevas Tecnologías del Desarrollo, UMB.

## Estructura

```
mi-pwa-cloud/
├── index.html          # interfaz
├── styles.css          # tema oscuro, diseño en grilla
├── script.js           # temporizador, tareas y estadísticas (localStorage)
├── manifest.json       # instalación como app
├── service-worker.js   # app shell en caché; red primero para el HTML
└── icons/              # 192 px, 512 px y versión maskable
```

## Pasos para publicar

### 1. Repositorio en GitHub

Crear el repositorio público `mi-pwa-cloud` en github.com y ejecutar:

```bash
git init
git add index.html styles.css icons/
git commit -m "feat: interfaz del temporizador Foco"
git add script.js
git commit -m "feat: lógica del Pomodoro, tareas y estadísticas"
git add manifest.json service-worker.js
git commit -m "feat: soporte PWA (manifest + service worker offline)"
git add README.md
git commit -m "docs: README con pasos de despliegue"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mi-pwa-cloud.git
git push -u origin main
```

### 2. Vercel

- vercel.com → **Continue with GitHub**
- **Add New Project** → seleccionar `mi-pwa-cloud` → **Deploy** (sin cambiar nada; es un sitio estático)
- Copiar la URL `https://….vercel.app` que aparece al terminar

### 3. Comprobar que es una PWA

En Chrome: DevTools → **Application** → Manifest (debe mostrar "Foco") y Service workers (estado *activated*). Luego marcar **Offline** y recargar: la app debe seguir abriendo.
