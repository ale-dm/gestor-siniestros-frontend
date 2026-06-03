# Gestor de Siniestros — Frontend

Aplicación web para la gestión de siniestros de seguros. Proyecto de portfolio full-stack construido con Angular 18 y PrimeNG.

🌐 **Demo**: https://gestor-siniestros-frontend.vercel.app  
⚙️ **API**: https://gestor-siniestros-backend-production.up.railway.app

---

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 18 | Framework principal (NgModules) |
| PrimeNG | 18 | Componentes UI |
| Chart.js | — | Gráficas del dashboard |
| PrimeFlex | — | Utilidades CSS / layout |
| PrimeIcons | — | Iconografía |
| TypeScript | 5.x | Lenguaje |

---

## Características

- **Autenticación JWT** con login, logout y renovación automática
- **Interceptor JWT**: añade `Authorization: Bearer` a todas las peticiones
- **Guards de ruta**: redirige a `/login` si no hay sesión activa
- **Layout responsive**: sidebar persistente en desktop, overlay con hamburguesa en móvil
- **Dashboard**: 8 KPI cards + gráfica de barras (por tipo) + donut (por estado) + últimos siniestros
- **Módulo Clientes**: tabla paginada con búsqueda en tiempo real, crear/editar, soft delete
- **Módulo Pólizas**: filtros por estado y tipo, crear/editar con selector de cliente
- **Módulo Siniestros**: lista con filtro por estado, formulario de apertura, detalle completo
- **Detalle de siniestro**: cambio de estado con diálogos, asignar perito, timeline de log de auditoría
- **Toast global** unificado con `ToastService`
- **Empty states** con componente reutilizable
- **Tema oscuro** con PrimeNG 18 Aura preset
- **Lazy loading** por módulo

---

## Estructura del proyecto

```
src/app/
├── core/
│   ├── guards/          # authGuard (funcional)
│   ├── interceptors/    # JwtInterceptor, ErrorInterceptor
│   ├── models/          # Interfaces TypeScript
│   └── services/        # AuthService, ClienteService, PolizaService...
├── features/
│   ├── auth/            # LoginComponent
│   ├── dashboard/       # KPIs + gráficas
│   ├── clientes/        # Lista + formulario
│   ├── polizas/         # Lista + formulario
│   └── siniestros/      # Lista + formulario + detalle
└── shared/
    ├── components/      # EmptyStateComponent
    └── shared.module.ts
```

---

## Requisitos previos

- Node.js 20+
- Angular CLI 18: `npm install -g @angular/cli@18`
- Backend corriendo (local o Railway)

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/ale-dm/gestor-siniestros-frontend.git
cd gestor-siniestros-frontend
```

### 2. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

### 3. Configurar entorno

Edita `src/environments/environment.ts` para apuntar a tu backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

### 4. Arrancar

```bash
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

---

## Variables de entorno

La URL del backend se configura en los archivos de entorno:

| Archivo | Uso |
|---|---|
| `src/environments/environment.ts` | Desarrollo local |
| `src/environments/environment.prod.ts` | Producción |

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://tu-backend.railway.app/api'
};
```

---

## Pantallas

| Ruta | Descripción | Roles |
|---|---|---|
| `/login` | Formulario de acceso | Pública |
| `/dashboard` | KPIs y gráficas | Todos |
| `/clientes` | Lista de clientes | ADMIN, GESTOR |
| `/clientes/nuevo` | Crear cliente | ADMIN, GESTOR |
| `/clientes/:id/editar` | Editar cliente | ADMIN, GESTOR |
| `/polizas` | Lista de pólizas | ADMIN, GESTOR |
| `/polizas/nueva` | Crear póliza | ADMIN, GESTOR |
| `/siniestros` | Lista de siniestros | Todos |
| `/siniestros/nuevo` | Abrir siniestro | ADMIN, GESTOR |
| `/siniestros/:id` | Detalle y gestión | Todos |

---

## Build de producción

```bash
ng build --configuration production
```

El output se genera en `dist/frontend/browser/`.

---

## Deploy en Vercel

1. Fork o clona este repo en GitHub
2. En [vercel.com](https://vercel.com) → New Project → Import desde GitHub
3. Vercel detecta Angular automáticamente. Verifica:
   - **Build Command**: `ng build --configuration production`
   - **Output Directory**: `dist/frontend/browser`
4. El archivo `vercel.json` incluido gestiona el routing SPA (evita 404 en rutas Angular)
5. Deploy

---

## Decisiones técnicas

| Decisión | Motivo |
|---|---|
| `provideHttpClient(withInterceptorsFromDi())` | Angular 18 requiere esto para interceptores de clase con `HTTP_INTERCEPTORS` |
| `app-dark` en `<html>` | PrimeNG 18 Aura: el tema oscuro se activa con esta clase CSS |
| CSS de PrimeNG en `angular.json` styles | PrimeNG 18 no exporta CSS vía `@import` SCSS |
| NgModules en vez de Standalone | Arquitectura más familiar para proyectos empresariales |
| Lazy loading por módulo | Reduce el bundle inicial; cada módulo carga solo al navegar |

---

## Backend

El backend de este proyecto está en:  
🔗 https://github.com/ale-dm/gestor-siniestros-backend
