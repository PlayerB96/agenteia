# Agenteia - Plataforma SaaS Multi-Tenant

Sistema de gestión de agentes IA con arquitectura multi-tenant y roles de usuario.

## 🏗️ Arquitectura Unificada

Este proyecto es una **Single Page Application (SPA)** construida con Vue 3 y Vue Router, que gestiona múltiples vistas según el rol del usuario:

- **Login**: Autenticación centralizada
- **Admin Dashboard**: Para el dueño del SaaS (`saas_owner`)
- **Company Dashboard**: Para administradores de empresa (`company_admin`)

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+
- npm o yarn

### Pasos de Instalación

1. **Configurar Variables de Entorno:**
   Crea un archivo `.env` en la carpeta `app` con tus credenciales de Auth0:

   ```env
   VITE_AUTH0_DOMAIN=dev-tu-dominio.us.auth0.com
   VITE_AUTH0_CLIENT_ID=tu-client-id
   VITE_AUTH0_CALLBACK_URL=http://localhost:5173/callback
   ```

2. **Instalar dependencias:**

```bash
cd app
npm install
```

## 🎯 Ejecución

Para iniciar la aplicación en modo desarrollo:

```bash
cd app
npm run dev
```

Abre: http://localhost:5173

## 👤 Usuarios de Prueba

### SaaS Owner (Acceso a Admin Dashboard)

- **Email:** admin@agenteia.com
- **Password:** admin123

### Company Admin - Tech Solutions

- **Email:** admin@techsolutions.com
- **Password:** tech123

### Company Admin - Global Marketing

- **Email:** admin@globalmarketing.io
- **Password:** global123

## 🔐 Flujo de Autenticación

1. **Login:** Ingresa en `/login`
2. **Validación:** El sistema verifica credenciales en `mockUsers.json`
3. **Redirección automática según rol:**
   - `saas_owner` → `/admin`
   - `company_admin` → `/company`
4. **Protección de rutas:** Vue Router verifica el rol antes de navegar
5. **Logout:** Limpia localStorage y redirige al login

## 📁 Estructura del Proyecto

```
agenteia/
└── app/                       # Aplicación unificada
    ├── src/
    │   ├── components/        # Componentes reutilizables
    │   ├── views/             # Vistas principales (Login, Admin, Company)
    │   ├── router/            # Configuración de rutas
    │   ├── utils/             # Utilidades (Auth, LocalStorage)
    │   ├── data/              # Datos mock
    │   └── App.vue            # Layout principal
    └── package.json
```

## 🎨 Tecnologías Utilizadas

- **Vue 3** - Framework JavaScript
- **Vue Router** - Enrutamiento
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **Lucide Vue** - Iconos
- **localStorage** - Persistencia de datos (sin backend)
