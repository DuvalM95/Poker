# Administrador de Sesión de Póker

Frontend en React + Vite + Tailwind, con el mismo flujo funcional del manual
original (ingreso/salida de miembros, ticket, torneo, rake, resumen, archivo
e historial) pero con un diseño propio pensado para uso rápido en mesa.

## Cómo correrlo

```bash
npm install
npm run dev       # desarrollo, http://localhost:5173
npm run build     # genera /dist para producción
npm run preview   # sirve /dist localmente para probar el build
```

## Supabase

La app usa Supabase Auth y Postgres; no guarda contraseñas ni movimientos en
`localStorage`. Para conectarla:

1. Crea un proyecto en Supabase y ejecuta [`supabase/schema.sql`](supabase/schema.sql)
   desde **SQL Editor**.
2. En **Authentication > Providers > Email**, deja habilitado Email. Para uso
   real, configura el proveedor SMTP y las URL de redirección de tu dominio.
3. Copia `.env.example` como `.env`. Desde **Project Settings > API**, coloca
   la Project URL y la **Publishable key**. `.env` está ignorado por Git.
4. Ejecuta `npm run dev`. En producción crea esas mismas variables de entorno
   en tu proveedor de hosting y vuelve a desplegar.

No uses nunca la clave `service_role` en el frontend. La Publishable key puede
estar en el navegador porque las políticas RLS de la migración aíslan los datos
por usuario autenticado.

## Administración de cuentas

El registro público está eliminado de la aplicación. Ejecuta
[`supabase/admin.sql`](supabase/admin.sql) en el SQL Editor y crea primero la
cuenta del administrador desde **Authentication > Users > Add user**. Luego
añade su correo a `poker_admins` con el comando indicado al final de ese archivo.

Para habilitar el botón **Crear usuario**, despliega la función protegida:

```bash
supabase functions deploy create-poker-user
```

La función usa la `SUPABASE_SERVICE_ROLE_KEY` solo dentro de Supabase; nunca la
copies a Render ni a variables `VITE_`. Finalmente, en **Authentication >
Providers > Email**, desactiva **Allow new users to sign up** para bloquear
registros realizados fuera del panel administrador.

## Deploy en Render

Es un sitio estático: build command `npm run build`, publish directory `dist`.

## Estructura

```
src/
  lib/store.js          # toda la lógica de datos (el "backend" de mentira)
  components/
    Header.jsx           # nombre del club, acceso a historial y archivo
    EntryForm.jsx         # ingresar miembro
    ExitForm.jsx          # registrar salida
    MovementsReport.jsx   # tabla central con totales
    RakeRegistry.jsx      # registro de rake
    SummaryModal.jsx       # resumen por miembro
    ArchiveModal.jsx       # confirmación de archivar sesión
    TicketModal.jsx / TicketReceipt.jsx  # ticket imprimible
    HistoryView.jsx        # calendario de sesiones archivadas
    ui.jsx                 # componentes base (Button, Card, Input...)
```
