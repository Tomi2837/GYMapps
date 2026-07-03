# GYMapps

Sistema de gestión integral para gimnasios desarrollado con Next.js, TypeScript, Tailwind CSS y Google Sheets.

## Tecnologías

- Next.js 16 con App Router
- React 19
- TypeScript estricto
- Tailwind CSS 4
- Google Sheets mediante service account
- JWT para autenticación
- PWA instalable
- Vercel

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Variables de entorno

Copiar `.env.example` como `.env.local` y completar:

```env
TENANT_ID=gym_demo
NEXT_PUBLIC_APP_NAME=GYM Control
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=
GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

## Aislamiento por cliente

El proyecto está preparado para que cada gimnasio pueda tener:

- Su propio proyecto de Vercel
- Su propio Google Sheets
- Sus propias variables de entorno
- Su propio dominio

El código se reutiliza, pero los datos permanecen físicamente separados por instalación. Además, las entidades incluyen `gymId` para permitir una futura evolución a SaaS multiempresa.

## Rutas actuales

- `/login`
- `/dashboard`
- `/api/health`
- `/manifest.webmanifest`

## Estado actual

- Base de Next.js configurada
- Diseño responsive inicial
- PWA configurada
- Tipos multiempresa
- Permisos por rol
- Cliente de Google Sheets
- Contrato de repositorio para socios

## Próxima etapa

Autenticación real, creación automática de la estructura de Google Sheets y administración de gimnasios, sucursales y usuarios.
