# Frontend Residencias

Panel de administración para el sistema de seguimiento de egresados. Permite registrar y editar egresados, administrar su historial laboral y consultar estadísticas mediante gráficas interactivas. Incluye tema claro y oscuro.

![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/Material_UI-5-007FFF?style=flat-square&logo=mui&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Google](https://img.shields.io/badge/Google_OAuth-opcional-4285F4?style=flat-square&logo=google&logoColor=white)

## Contenido

- [Proyectos relacionados](#proyectos-relacionados)
- [Funcionalidades](#funcionalidades)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Inicio de sesión](#inicio-de-sesión)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Despliegue](#despliegue)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Proyectos relacionados

| Proyecto | Descripción |
|---|---|
| [backend-residencias](https://github.com/LOctavioDev/backend-residencias) | API REST (Express + MongoDB) que consume este panel. Es necesaria para usarlo. |
| [frontend-residencias](https://github.com/LOctavioDev/frontend-residencias) | Este repositorio. |
| [script_migarte](https://github.com/LOctavioDev/script_migarte) | Script en Python para migrar registros desde una hoja de cálculo a MongoDB. |

## Funcionalidades

- Inicio de sesión con correo y contraseña, y opcionalmente con Google.
- Rutas privadas protegidas con JWT; la sesión se cierra cuando el token expira.
- Listado de egresados con ordenamiento, filtros por columna y paginación (MUI Data Grid), y acciones para editar o eliminar.
- Alta y edición de egresados con validación de formularios (Formik + Yup).
- Gestión del historial de empresas de cada egresado.
- Gráficas de barras, pastel y línea generadas con Nivo a partir de los datos de la API.
- Edición del nombre y correo del administrador.
- Tema claro y oscuro.

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior y npm
- Una instancia en ejecución de [backend-residencias](https://github.com/LOctavioDev/backend-residencias)

## Instalación

```bash
git clone https://github.com/LOctavioDev/frontend-residencias.git
cd frontend-residencias
npm install
cp .env.example .env   # edita los valores
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

Para abrirla desde otros equipos de la red local, inicia el servidor escuchando en todas las interfaces y apunta `VITE_BACKEND_URL_DEV` a la IP del servidor (no a `localhost`):

```bash
npm run dev -- --host 0.0.0.0
```

## Variables de entorno

Vite incorpora estas variables al compilar; después de cambiarlas hay que reiniciar `npm run dev` o volver a ejecutar `npm run build`.

| Variable | Obligatoria | Descripción |
|---|---|---|
| `VITE_BACKEND_URL_DEV` | Sí | URL base del backend, con `/` al final. Ejemplo: `http://192.168.1.10:11111/` |
| `VITE_GOOGLE_CLIENT_ID` | No | Client ID de Google OAuth. Sin un valor válido el botón de Google se muestra, pero no permite iniciar sesión. |

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Compila la versión de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación de `dist/`. |
| `npm start` | Sirve `dist/` como aplicación de una sola página con `serve`. |
| `npm run lint` | Analiza el código con ESLint. |

## Inicio de sesión

El acceso está limitado al usuario administrador registrado en el backend. Para crearlo, ejecuta en el proyecto del backend:

```bash
npm run create-admin -- admin@ejemplo.com "una-contraseña-segura" "Nombre"
```

Después inicia sesión en `/login` con ese correo y contraseña. El token y los datos del usuario se guardan en `localStorage`, y cada petición a la API envía el token en el encabezado `auth-token`.

Para habilitar el inicio de sesión con Google, configura el mismo Client ID en `VITE_GOOGLE_CLIENT_ID` (frontend) y `CLIENT_ID` (backend), y agrega el origen del panel como origen autorizado en la consola de Google Cloud. El correo de Google debe coincidir con el del administrador.

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
|---|---|---|
| `/login` | Pública | Inicio de sesión. |
| `/` y `/team` | Privada | Listado de egresados. |
| `/form` | Privada | Alta de un egresado. |
| `/useredit/:control_number` | Privada | Edición de un egresado. |
| `/companyhistory/:control_number` | Privada | Historial de empresas de un egresado. |
| `/bar` | Privada | Gráfica de barras por actividad actual. |
| `/pie` | Privada | Gráfica de pastel por estado. |
| `/stream` | Privada | Gráfica de línea por generación. |

## Estructura del proyecto

```
src/
├── components/          Componentes reutilizables (gráficas, login, encabezados, diálogos)
├── context/
│   └── AuthContext.jsx  Estado de autenticación y expiración del token
├── data/                Datos de ejemplo para gráficas
├── scenes/              Pantallas de la aplicación
│   ├── layout/          Barra lateral y barra de navegación
│   ├── team/            Listado de egresados
│   ├── form/            Alta de egresados
│   ├── useredit/        Edición e historial de empresas
│   ├── bar/ pie/ line/ stream/   Gráficas
│   └── ...
├── services/
│   ├── apiService.js    Cliente Axios con el token en cada petición
│   ├── PrivateRouter.jsx Protección de rutas privadas
│   └── utils.js         Conversión de fechas a marca de tiempo Unix
├── config.js            URL del backend
├── theme.js             Paleta y tema claro/oscuro
├── Router.jsx           Definición de rutas
└── main.jsx             Punto de entrada
```

## Despliegue

```bash
npm run build
npm start          # o sirve la carpeta dist/ con cualquier servidor web estático
```

Al usar un servidor web propio (Nginx, Apache, etc.), configura que todas las rutas desconocidas respondan con `index.html`, ya que la aplicación usa enrutamiento del lado del cliente.

## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama para tu cambio: `git checkout -b feature/mi-cambio`.
3. Verifica que compile: `npm run build`.
4. Envía un pull request describiendo el cambio.

## Licencia

Distribuido bajo la licencia MIT. Consulta [LICENSE](LICENSE) para más información.

Copyright (c) 2024 Luis Octavio.
