# Gestion de Biblioteca

**Dominio:** Gestión de Biblioteca
**Base de datos:** PostgreSQL + Sequelize
**Organización del backend:** Carpeta por tipo de archivo

## Integrantes
- Aguero, Matias — matu-8
- Veron, Maximo — MaximoVeron
- Garrido, Amin — Amin-117 

## Descripción
Aplicación web para consultar el catálogo de libros de una biblioteca, ver el
detalle de cada libro y suscribirse a los que te interesan. Cuando un
administrador cambia el estado de un libro (disponible, prestado o en
reparación), todos los suscriptores reciben una notificación en su bandeja.
La sesión se mantiene con una cookie `httpOnly` y los permisos se verifican en
el backend según el rol (usuario o admin).

## Requisitos previos
- Docker y Docker Compose (para la ejecución con Docker)
- Node.js 20 o superior + pnpm (para la ejecución local)
- Git

## Ejecución con Docker (recomendado)

Levanta la base de datos (PostgreSQL), el backend y el frontend completos,
con el seed de roles, permisos, usuarios y libros de ejemplo ejecutándose en
forma automática al iniciar:

1. Clonar el repositorio:
   ```bash
   git clone [url]
   cd practica_integradora_tlp_grupal
   ```
2. Copiar variables de entorno desde `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
3. Construir y levantar los tres servicios:
   ```bash
   docker compose up --build
   ```
4. Abrir la aplicación:
   - Frontend: http://localhost:5173
   - API:      http://localhost:3000/api

Notas:
- El backend espera a que PostgreSQL esté saludable antes de arrancar
  (`healthcheck` + `depends_on: service_healthy`).
- Los datos persisten en el volumen Docker `pgdata`; al hacer
  `docker compose down` y `up` los datos se conservan. Para borrarlos
  del todo: `docker compose down -v`.
- Para developing en el frontend remoto el `VITE_API_URL` del `.env`
  apunta por defecto a `http://localhost:3000/api`.

## Cómo ejecutar el proyecto (sin Docker)

1. Clonar el repositorio:
   ```bash
   git clone [url]
   cd practica_integradora_tlp_grupal
   ```
2. Crear el archivo de variables de entorno del backend:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Instalar dependencias:
   ```bash
   pnpm install
   pnpm --dir backend install
   pnpm --dir frontend install
   ```
4. Levantar el backend (crea las tablas, carga los roles y los libros de
   ejemplo de forma automática):
   ```bash
   pnpm --dir backend dev
   ```
5. Levantar el frontend en otra terminal:
   ```bash
   pnpm --dir frontend dev
   ```
6. Abrir la aplicación:
   - Frontend: http://localhost:5173
   - API: http://localhost:3000/api

## Ejecución sin Docker
Si no se usa Docker, el backend y el frontend se levantan por separado con
`pnpm dev` desde su carpeta (requiere PostgreSQL corriendo local y un
`backend/.env` desde `backend/.env.example`), tal como se describe arriba.

## Variables de entorno (Docker: `.env` en la raíz desde `.env.example`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DB_NAME` | Nombre de la base de datos | `tp_integrador` |
| `DB_USER` | Usuario de PostgreSQL | `tlp4` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `tlp4` |
| `DB_DIALECT` | Dialecto de Sequelize | `postgres` |
| `JWT_SECRET` | Clave para firmar los tokens | `cambiar-esto` |
| `PORT` | Puerto del backend | `3000` |
| `VITE_API_URL` | URL de la API para el frontend (opcional) | `http://localhost:3000/api` |

## Usuarios de prueba

La seed crea estas cuentas (solo para desarrollo):

| Rol | Email | Contraseña |
|---|---|---|
| admin | admin@example.com | Admin1234! |
| usuario | ana@example.com | Password123! |

El admin tiene los permisos `list_users`, `assign_role`, `create_book`,
`update_book` y `change_status`; el usuario no tiene ninguno.

## Cómo probar el flujo de notificaciones
1. Ingresar como `ana@example.com` y suscribirse a un libro desde su detalle.
2. En una ventana de incógnito, ingresar como `admin@example.com` y cambiar el
   estado de ese mismo libro.
3. Volver a la sesión de Ana: la notificación aparece en la bandeja (con el
   contador en la navbar) y se puede marcar como leída.
4. El backend también emite la notificación por consola:
   ```bash
   pnpm --dir backend dev
   ```

## Endpoints principales

| Método | Ruta | Permiso requerido |
|---|---|---|
| POST | /api/auth/register | — |
| POST | /api/auth/login | — |
| GET | /api/auth/check | sesión activa |
| POST | /api/auth/logout | — |
| GET | /api/books | sesión activa |
| GET | /api/books/:id | sesión activa |
| PATCH | /api/books/:id/status | change_status |
| GET | /api/subscriptions/:bookId/status | sesión activa |
| POST | /api/subscriptions/:bookId | sesión activa |
| DELETE | /api/subscriptions/:bookId | sesión activa |
| GET | /api/notifications | sesión activa |
| GET | /api/notifications/unread | sesión activa |
| PATCH | /api/notifications/:id/read | sesión activa |
| GET | /api/users | list_users |
| GET | /api/users/roles | sesión activa |
| PUT | /api/users/:id/role | assign_role |

## Patrones y principios SOLID
Ver [PATTERNS.md](./PATTERNS.md).
