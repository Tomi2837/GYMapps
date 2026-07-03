# GYMapps

Sistema de gestion integral para gimnasios desarrollado con Next.js, TypeScript, Tailwind CSS, Google Sheets y Google Drive.

## Tecnologias

- Next.js 16 con App Router
- React 19
- TypeScript estricto
- Tailwind CSS 4
- Google Sheets mediante service account
- Google Drive para imagenes de maquinas
- JWT en cookie segura
- Google OAuth
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

GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=

GOOGLE_SHEETS_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_MACHINE_FOLDER_ID=
```

En produccion, `NEXT_PUBLIC_APP_URL` debe contener el dominio definitivo de Vercel, sin barra al final.

La URL de retorno autorizada para Google OAuth es:

```text
https://DOMINIO/api/auth/google/callback
```

La hoja de calculo y la carpeta de Drive deben estar compartidas con el email de la service account.

## Configuracion inicial

1. Abrir `/onboarding`.
2. Crear el administrador con Google o email y contrasena.
3. Cargar los datos del gimnasio.
4. Elegir los colores de la aplicacion.
5. Seleccionar actividades.
6. Seleccionar maquinas y cargar fotos opcionales.
7. Confirmar la configuracion.

El sistema crea automaticamente las hojas necesarias dentro del Google Sheets configurado y bloquea una segunda configuracion inicial.

## Funciones implementadas

- Alta unica del gimnasio
- Administrador mediante Google o email y contrasena
- Contrasenas protegidas con hash
- Login y cierre de sesion
- Cookie de sesion segura
- Proteccion del dashboard
- Personalizacion de colores por gimnasio
- Actividades y maquinas guardadas en Sheets
- Fotos de maquinas subidas a Drive
- Imagen generica cuando no existe foto propia
- Dashboard con metricas obtenidas desde Sheets
- Aislamiento por `GYM_ID`
- Diagnostico seguro en `/api/health`

## Hojas creadas automaticamente

- GIMNASIOS
- SUCURSALES
- USUARIOS
- ACTIVIDADES
- MAQUINAS
- SOCIOS
- PLANES
- PAGOS
- INGRESOS

## Aislamiento por cliente

Cada gimnasio puede utilizar:

- Su propio proyecto de Vercel
- Su propio Google Sheets
- Su propia carpeta de Drive
- Sus propias variables de entorno
- Su propio dominio

El mismo codigo se reutiliza, pero los datos quedan fisicamente separados por instalacion. Todas las entidades tambien incluyen `GYM_ID` para una futura evolucion a SaaS multiempresa.

## Rutas principales

- `/login`
- `/onboarding`
- `/dashboard`
- `/api/setup`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/google`
- `/api/uploads/machine`
- `/api/health`
