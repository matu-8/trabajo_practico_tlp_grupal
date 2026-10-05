# API Backend — TypeScript & Express

> Submódulo backend del Trabajo Práctico Integrador. Responsable de la autenticación y autorización de usuarios, la orquestación de las reglas de negocio del sistema de biblioteca (gestión de libros, suscripciones y notificaciones), y la persistencia de datos mediante una arquitectura políglota con **Sequelize (PostgreSQL)** como motor relacional principal y **Mongoose (MongoDB)** disponible como motor documental.

---

## Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura y Organización del Código](#arquitectura-y-organización-del-código)
- [Flujo de una Petición](#flujo-de-una-petición)
- [Módulo de Notificaciones y Patrón Observer](#módulo-de-notificaciones-y-patrón-observer)
- [Variables de Entorno](#variables-de-entorno)
- [Instalación y Ejecución Local](#instalación-y-ejecución-local)
- [Ejecución con Docker Compose](#ejecución-con-docker-compose)
- [Scripts Disponibles](#scripts-disponibles)
- [Convenciones de Rutas y Respuestas](#convenciones-de-rutas-y-respuestas)
- [EndPoints de la API](#endpoints-de-la-api)

---

## Stack Tecnológico

### Core & Runtime

| Dependencia   | Versión | Descripción |
|---------------|---------|-------------|
| `node`        | >= 20   | Runtime JavaScript |
| `typescript`  | ^7.0    | Tipado estático y compilación |
| `tsx`         | ^4.23   | Ejecución de TypeScript en desarrollo con hot-reload |
| `express`     | ^5.2    | Framework HTTP para la API REST |
| `cors`        | ^2.8    | Habilitación de cross-origin requests |
| `cookie-parser` | ^1.4  | Parsing de cookies HTTP (usada para JWT) |
| `dotenv`      | ^18.0   | Carga de variables de entorno desde `.env` |

### Bases de Datos & ORM/ODM

| Dependencia   | Versión | Descripción |
|---------------|---------|-------------|
| `pg`          | ^8.23   | Driver PostgreSQL para Node.js |
| `sequelize`   | ^6.37   | ORM para bases de datos relacionales (PostgreSQL) |
| `mongoose`    | ^9.10   | ODM para MongoDB (persistencia documental) |

### Seguridad & Validación

| Dependencia        | Versión | Descripción |
|--------------------|---------|-------------|
| `jsonwebtoken`     | ^9.0    | Generación y verificación de tokens JWT |
| `bcrypt`           | ^6.0    | Hasheo de contraseñas (salt rounds = 10) |
| `express-validator`| ^7.3    | Validación y saneamiento de datos de entrada |

### Herramientas de Desarrollo

| Dependencia           | Versión | Descripción |
|-----------------------|---------|-------------|
| `@types/*`            | varios  | Definiciones de tipos para todas las dependencias |
| `nodemon`             | ^3.1    | Hot-reload alternativo (disponible) |
| `tsx`                 | ^4.23   | Executor TypeScript con watch mode |
| `pnpm`               | ^11.1   | Gestor de paquetes (obligatorio) |

---

## Arquitectura y Organización del Código

El proyecto sigue una **arquitectura por capas** con separación estricta de responsabilidades, aplicando principios **SOLID** y el patrón **Repository** para desacoplar la lógica de negocio del acceso a datos.

```text
backend/
├── src/
│   ├── config/              # Conexión DB (Singleton), composition root y seed
│   ├── controllers/         # Controladores HTTP (recepción de req/res)
│   ├── errors/              # Clases de error personalizadas (HttpError)
│   ├── helpers/             # Funciones utilitarias (bcrypt, jwt)
│   ├── interfaces/          # Interfaces de dominio generales
│   ├── middlewares/         # Autenticación, autorización y validación
│   ├── models/              # Modelos Sequelize (tablas y asociaciones)
│   ├── notifications/       # Sistema de notificaciones (Factory + Strategy)
│   ├── observer/            # Patrón Observer (eventos de cambio de estado)
│   ├── repositories/        # Capa de acceso a datos (Repository Pattern)
│   │   └── interfaces/      # Contratos de cada repositorio
│   ├── routes/              # Definición y mapeo de rutas Express
│   ├── services/            # Lógica de negocio pura (casos de uso)
│   └── types/               # Declaraciones de tipos globales (Express augment)
├── .env
├── .env.example
├── app.ts                   # Punto de entrada / bootstrap del servidor
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```

### Responsabilidades por Capa

| Capa | Directorio | Responsabilidad |
|------|-----------|-----------------|
| **Config** | `config/` | Inicialización de la base de datos. Implementa el patrón **Singleton** para garantizar una única instancia de conexión (`Database.getInstance()`). Contiene además el **composition root** (`container.ts`), donde se instancian y conectan todas las dependencias, y la **seed** (`seed.ts`). |
| **Routes** | `routes/` | Mapeo de endpoints HTTP hacia controladores. Composición de middlewares en cadena (auth + validación + handler). |
| **Middlewares** | `middlewares/` | Interceptores transversales: autenticación JWT (`authenticate`, `authMiddleware`), autorización basada en permisos RBAC (`authorize`), y validación de payloads (`validate`). |
| **Controllers** | `controllers/` | Adaptadores HTTP: reciben `Request`, invocan al servicio correspondiente y devuelven `Response` JSON. No contienen lógica de negocio. |
| **Services** | `services/` | Lógica de negocio pura y casos de uso. Reciben dependencias inyectadas mediante interfaces (Inversión de Dependencias). |
| **Repositories** | `repositories/` | Acceso a datos encapsulado. Cada repositorio implementa una interfaz (`IUserRepository`, `IBookRepository`, etc.), permitiendo intercambiar el ORM/ODM sin afectar la capa de servicio. |
| **Models** | `models/` | Definición de esquemas Sequelize y asociaciones entre entidades. Representan la estructura de las tablas en PostgreSQL. |
| **Observer** | `observer/` | Implementación del patrón **Observer** para la publicación y suscripción a eventos de dominio (cambios de estado de libros). `EventPublisher` es el sujeto y `NotificationService` el observador; ambos se conectan una única vez en `config/container.ts` con `eventPublisher.attach(notificationService)`. |
| **Notifications** | `notifications/` | Sistema de notificaciones con patrón **Factory** y **Strategy**. Soporta múltiples canales (in-app, consola) intercambiables. |
| **Helpers** | `helpers/` | Funciones utilitarias transversales: hasheo de contraseñas (`bcrypt.ts`) y generación/verificación de tokens (`jwt.ts`). |
| **Errors** | `errors/` | Clase `HttpError` para errores con código de estado HTTP y función `sendError` para manejo centralizado. |
| **Types** | `types/` | Augmentación de tipos globales de Express (extensión de `Request` con `user?: TokenUserData`). |
| **Interfaces** | `interfaces/` | Interfaces de dominio y contratos generales del sistema. |

---

## Flujo de una Petición

```
┌──────────┐     ┌──────────────┐     ┌────────────┐     ┌──────────┐     ┌──────────────┐     ┌────────┐
│  Cliente  │────▶│    Route      │────▶│ Middleware  │────▶│Controller│────▶│   Service    │────▶│  Model │
│ (Fetch)   │     │ (Express)    │     │ (Auth/Val.) │     │  (HTTP)  │     │ (Negocio)    │     │  (DB)  │
└──────────┘     └──────────────┘     └──────────────┘     └──────────┘     └──────┬───────┘     └────────┘
                                                                                   │
                                                                                   ▼
                                                                            ┌──────────────┐
                                                                            │  Repository  │
                                                                            │  (Acceso DB) │
                                                                            └──────────────┘
```

**Secuencia detallada:**

1. **Route** (`src/routes/`): Define el endpoint y ensambla la cadena de middlewares y el controlador.
2. **Middleware** (`src/middlewares/`):
   - `authenticate` / `authMiddleware`: Extrae y verifica el JWT desde cookies o header `Authorization`.
   - `authorize`: Valida que el usuario posea el permiso RBAC requerido para la acción.
   - `validate`: Ejecuta las reglas de `express-validator` y retorna `400` si hay errores.
3. **Controller** (`src/controllers/`): Adapta la petición HTTP a una invocación de servicio. Captura excepciones y formatea la respuesta JSON.
4. **Service** (`src/services/`): Ejecuta la lógica de negocio. No conoce HTTP ni el ORM. Depende de interfaces de repositorio.
5. **Repository** (`src/repositories/`): Implementa las operaciones CRUD contra el modelo Sequelize/Mongoose.
6. **Model** (`src/models/`): Representa la entidad de base de datos y sus asociaciones.

---

## Composition Root

`src/config/container.ts` es el **único lugar** donde se instancian repositorios y
servicios. Las rutas solo leen del contenedor, de modo que agregar un módulo nuevo
no obliga a tocar lo que ya funciona:

```text
Notebook
  │
  ├─ Repositorios:  user, role, book, subscription, notification
  │
  ├─ NotifierFactory(notificationRepository)
  ├─ NotificationService(subscriptionRepository, notificationRepository, notifierFactory, ["inapp","console"])
  │
  ├─ EventPublisher()  ──►  attach(notificationService)   ← se conecta el Observer
  │
  └─ Servicios:  AuthService(userRepository, roleRepository)
                  BookService(bookRepository, eventPublisher)
                  SubscriptionService(subscriptionRepository, bookRepository)
                  UserService(userRepository, roleRepository)
```

## Módulo de Notificaciones y Patrón Observer

El sistema implementa un mecanismo de **eventos de dominio** para notificar a los usuarios suscritos cuando un libro cambia de estado.

### Componentes

```
┌──────────────┐       ┌──────────────────┐       ┌────────────────────┐
│ BookService   │──────▶│  EventPublisher   │──────▶│ NotificationService│
│ (changeStatus)│       │  (ISubject)       │       │  (IObserver)       │
└──────────────┘       │  - attach()       │       │  - update()        │
                       │  - detach()       │       └─────────┬──────────┘
                       │  - notify()       │                 │
                       └──────────────────┘                 ▼
                                                    ┌──────────────┐
                                                    │ INotifier[]  │
                                                    │ - InApp      │
                                                    │ - Console    │
                                                    └──────────────┘
```

### Flujo del Evento

1. **`BookService.changeStatus()`** actualiza el estado de un libro y publica un `BookStatusChangeEvent` a través del `EventPublisher`.
2. **`EventPublisher`** (`src/observer/EventPublisher.ts`) implementa `ISubject`: mantiene una lista de observers y los notifica secuencialmente.
3. **`NotificationService`** (`src/services/notification.service.ts`) implementa `IObserver`: al recibir el evento, consulta los usuarios suscritos al libro y genera notificaciones.
4. **Notifiers** (`src/notifications/`): El `NotifierFactory` crea instancias de `INotifier` según el canal configurado:
   - `InAppNotifier`: Persiste la notificación en la base de datos para la bandeja del usuario.
   - `ConsoleNotifierAdapter`: Imprime la notificación en consola (útil para desarrollo/debugging).

### Eventos de Dominio

| Evento | Archivo | Descripción |
|--------|---------|-------------|
| `BookStatusChangeEvent` | `src/observer/bookStatusChangedEvent.ts` | Emitido cuando un libro cambia de estado (`DISPONIBLE`, `PRESTADO`, `EN_REPARACION`). Contiene `bookId`, `bookTitle`, `previousStatus` y `newStatus`. |

---

## Variables de Entorno

El archivo `.env` se carga automáticamente al inicio mediante `dotenv`. Copiar `.env.example` a `.env` y completar los valores.

| Variable | Tipo | Obligatoria | Default | Descripción |
|----------|------|:-----------:|---------|-------------|
| `PORT` | `number` | No | `3000` | Puerto en el que escucha el servidor HTTP |
| `DB_NAME` | `string` | **Sí** | — | Nombre de la base de datos PostgreSQL |
| `DB_USER` | `string` | **Sí** | — | Usuario de conexión a PostgreSQL |
| `DB_PASSWORD` | `string` | **Sí** | — | Contraseña del usuario de PostgreSQL |
| `DB_DIALECT` | `string` | **Sí** | — | Dialecto Sequelize (ej: `postgres`) |
| `DB_HOST` | `string` | No | `localhost` | Host de la instancia PostgreSQL |
| `JWT_SECRET` | `string` | **Sí** | — | Clave secreta para firmar tokens JWT |

### `.env.example`

```env
# ─── Servidor ─────────────────────────────────────
PORT=3000

# ─── PostgreSQL (Sequelize) ───────────────────────
DB_NAME=library_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_DIALECT=postgres
DB_HOST=localhost

# ─── Autenticación ────────────────────────────────
JWT_SECRET=super_secret_key_change_in_production
```

> **Importante**: Nunca commitear el archivo `.env` al repositorio. Solo `.env.example` con valores de referencia.

---

## Instalación y Ejecución Local

### Requisitos Previos

| Requisito | Versión Mínima | Notas |
|-----------|:--------------:|-------|
| [Node.js](https://nodejs.org/) | 20.x | Runtime JavaScript |
| [pnpm](https://pnpm.io/) | 11.x | Gestor de paquetes |
| PostgreSQL | 15.x | Motor de base de datos relacional |

### Paso a Paso

```bash
# 1. Ingresar al directorio del backend
cd backend

# 2. Instalar dependencias
pnpm install

# 3. Copiar el archivo de variables de entorno y completarlo
cp .env.example .env

# 4. Asegurar que PostgreSQL esté corriendo y crear la base de datos
#    (ajustar credenciales según tu entorno local)

# 5. Iniciar el servidor en modo desarrollo (hot-reload con tsx watch)
pnpm run dev
```

El servidor iniciará en `http://localhost:3000` (o el puerto definido en `PORT`).

---

## Inicialización de la Base de Datos

`app.ts` ejecuta tres pasos **en este orden** antes de escuchar en el puerto:

1. `testConnection()` — verifica que se pueda conectar al servidor.
2. `setupAssociations()` — registra las relaciones entre modelos. **Debe correr
   antes de cualquier consulta**, porque los repositorios usan `include` y
   Sequelize lanza `SequelizeEagerLoadingError` si la asociación no existe.
3. `sequelize.sync()` + `seed()` — crea las tablas que falten y carga los datos
   mínimos.

> ⚠️ `sequelize.sync()` es **solo para desarrollo**. En producción se usan
> migraciones versionadas.

### La seed

`src/config/seed.ts` es **idempotente**: se ejecuta en cada arranque sin duplicar
nada, porque usa `findOrCreate`. Carga:

- Los 6 permisos del sistema (`list_users`, `assign_role`, `create_book`,
  `update_book`, `change_status`, `delete_book`).
- Los roles `usuario` (sin permisos, es el que se asigna al registrarse) y
  `admin` (con los 6 permisos).
- El pivote `role_permissions` del admin.
- Un usuario admin de prueba: `admin@example.com` / `Admin1234!`
- 5 libros de ejemplo, para que la lista y las notificaciones tengan contenido.

---

## Ejecución con Docker Compose

Desde el directorio **raíz del repositorio**, el backend puede levantarse junto a sus dependencias mediante Docker Compose:

```bash
# Desde la raíz del proyecto
docker compose up --build backend
```

> Esto levantará el contenedor del backend junto con los servicios de base de datos definidos en el `docker-compose.yml` de la raíz.

---

## Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `pnpm run dev` | `tsx watch app.ts` | Inicia el servidor en modo desarrollo con hot-reload automático ante cambios en archivos TypeScript |
| `pnpm exec tsc --noEmit` | `tsc --noEmit` | Validación de tipos sin generar archivos de salida. Usar para verificar que el código compila correctamente |
| `pnpm test` | — | Script de tests (pendiente de configuración) |

### Verificación de Tipos

```bash
# Ejecutar desde el directorio backend/
pnpm exec tsc --noEmit
```

Este comando realiza la verificación estática de tipos según la configuración de `tsconfig.json` (modo `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).

---

## Convenciones de Rutas y Respuestas

### Estructura de Respuestas JSON

Todas las respuestas de la API siguen una estructura consistente:

**Respuesta exitosa:**

```json
{
  "ok": true,
  "msg": "Descripción de la operación",
  "data": { ... }
}
```

**Respuesta de error:**

```json
{
  "ok": false,
  "msg": "Descripción del error"
}
```

**Respuesta de error con detalles de validación:**

```json
{
  "ok": false,
  "errors": [
    { "path": "email", "msg": "Email inválido" }
  ]
}
```

### Códigos de Estado HTTP

| Código | Significado | Uso |
|:------:|-------------|-----|
| `200` | OK | Operación exitosa (GET, UPDATE, DELETE) |
| `201` | Created | Recurso creado exitosamente (POST register, subscribe) |
| `400` | Bad Request | Datos de entrada inválidos o lógica de negocio rechazada |
| `401` | Unauthorized | Sin token de autenticación, token inválido/vencido o credenciales incorrectas |
| `403` | Forbidden | Token válido pero sin permisos para la acción (RBAC) |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Conflicto de negocio (email registrado, suscripción duplicada) |
| `500` | Internal Server Error | Error inesperado del servidor |

### Manejo Centralizado de Errores

La clase `HttpError` (`src/errors/httpError.ts`) permite lanzar errores con código de estado explícito desde cualquier capa de servicio. La función `sendError()` captura tanto `HttpError` como errores genéricos, garantizando respuestas consistentes.

---

## EndPoints de la API

Todos los endpoints están montados bajo el prefijo `/api`.

### Autenticación

| Método | Ruta | Auth | Descripción |
|:------:|------|:----:|-------------|
| `POST` | `/api/auth/register` | No | Registrar un nuevo usuario (rol `usuario` por defecto) |
| `POST` | `/api/auth/login` | No | Iniciar sesión. Retorna JWT en cookie `httpOnly` |
| `POST` | `/api/auth/logout` | No | Cerrar sesión. Limpia la cookie del token |
| `GET`  | `/api/auth/check` | **Sí** | Verificar estado de autenticación activo |

### Objetos de usuario expuestos

Ningún endpoint devuelve el modelo de Sequelize: `AuthService` filtra los campos
mediante `toPublicUser()`, de modo que **el hash de la contraseña nunca viaja al
frontend**. `PublicUser` (`src/repositories/interfaces/user.interface.ts`) es:

```json
{
  "id": 1,
  "name": "Ana",
  "email": "ana@example.com",
  "roleId": 2,
  "permissions": ["list_users"]
}
```

`POST /api/auth/register`, `POST /api/auth/login` y `GET /api/auth/check` devuelven
**exactamente esta misma forma** dentro de `data`, de modo que el frontend puede
tratarlos de forma idéntica:

```json
{ "ok": true, "msg": "Inicio de sesión exitoso", "data": { "id": 1, "name": "Ana", "email": "ana@example.com", "roleId": 2, "permissions": [] } }
```

El mismo objeto (`PublicUser`) es también el payload del JWT, que se declara como
`TokenUserData`. Por eso `roleId` es el **id de la FK**, no el nombre del rol, y por
eso `authorize` puede leer `req.user.permissions` sin volver a consultar la base.

### Sesión por cookie

El token viaja en la cookie `token` con `httpOnly: true`, `sameSite: "lax"`,
`path: "/"` y una vigencia de 1 hora, que coincide con el `expiresIn: "1h"` del
JWT. El frontend debe enviar las peticiones con `credentials: "include"` y el
servidor responde con CORS habilitado para `http://localhost:5173`.

El `logout` limpia la cookie **repitiendo exactamente las mismas opciones** con las
que se creó: si el `path` no coincide, el navegador no la elimina y la sesión
parecería seguir activa.

`authMiddleware` extrae el token de la cookie y responde `401` tanto si falta la
cookie (`"No autenticado"`) como si el token es inválido o venció
(`"Token inválido o vencido"`).

### Libros

| Método | Ruta | Auth | Permiso | Descripción |
|:------:|------|:----:|:-------:|-------------|
| `GET`    | `/api/books` | **Sí** | — | Obtener todos los libros |
| `GET`    | `/api/books/:id` | **Sí** | — | Obtener un libro por ID |
| `POST`   | `/api/books` | **Sí** | `create_book` | Crear un nuevo libro |
| `PUT`    | `/api/books/:id` | **Sí** | `update_book` | Actualizar datos de un libro |
| `PATCH`  | `/api/books/:id/status` | **Sí** | `change_status` | Cambiar estado de un libro (emite evento Observer) |
| `DELETE` | `/api/books/:id` | **Sí** | `delete_book` | Eliminar un libro |

### Suscripciones

| Método | Ruta | Auth | Descripción |
|:------:|------|:----:|-------------|
| `GET`    | `/api/subscriptions/:bookId/status` | **Sí** | Consultar si el usuario está suscripto a un libro |
| `POST`   | `/api/subscriptions/:bookId` | **Sí** | Suscribirse a un libro |
| `DELETE` | `/api/subscriptions/:bookId` | **Sí** | Desuscribirse de un libro |

### Notificaciones

| Método | Ruta | Auth | Descripción |
|:------:|------|:----:|-------------|
| `GET`  | `/api/notifications` | **Sí** | Obtener notificaciones del usuario autenticado |
| `GET`  | `/api/notifications/unread` | **Sí** | Contar notificaciones no leídas |
| `PATCH`| `/api/notifications/:id/read` | **Sí** | Marcar una notificación como leída |

### Usuarios

| Método | Ruta | Auth | Permiso | Descripción |
|:------:|------|:----:|:-------:|-------------|
| `GET`  | `/api/users` | **Sí** | `list_users` | Obtener todos los usuarios |
| `GET`  | `/api/users/roles` | **Sí** | — | Obtener roles disponibles |
| `PUT`  | `/api/users/:id/role` | **Sí** | `assign_role` | Asignar un rol a un usuario |

---

## Modelo de Datos

### Entidades Principales (PostgreSQL / Sequelize)

```
┌─────────────┐       ┌──────────────┐       ┌─────────────────┐
│   users      │──────▶│    roles      │◀─────│ role_permissions │
│              │       │              │       │                 │
│ id           │       │ id           │       │ roleId (FK)     │
│ name         │       │ name         │       │ permissionId(FK)│
│ email        │       └──────────────┘       └────────┬────────┘
│ password     │                                       │
│ roleId (FK)  │                              ┌────────▼────────┐
└──────┬───────┘                              │   permissions    │
       │                                      │                 │
       │           ┌──────────────────┐       │ id              │
       │──────────▶│  subscriptions   │       │ name            │
       │           │                  │       └─────────────────┘
       │           │ id               │
       │           │ userId (FK)      │
       │           │ bookId (FK)      │
       │           └──────────────────┘
       │
       │           ┌──────────────────┐
       │──────────▶│  notifications   │
       │           │                  │
       │           │ id               │
       │           │ userId (FK)      │
       │           │ bookId (FK)      │
       │           │ message          │
       │           │ previousStatus   │
       │           │ newStatus        │
       │           │ read             │
       │           └──────────────────┘
       │
┌──────▼───────┐
│    books      │
│              │
│ id           │
│ title        │
│ author       │
│ description  │
│ status       │  ← ENUM: DISPONIBLE | PRESTADO | EN_REPARACION
└──────────────┘
```

### Control de Acceso (RBAC)

El sistema implementa **Role-Based Access Control** mediante la relación N:M entre `roles` y `permissions` a través de la tabla pivote `role_permissions`. El token JWT se obtiene de la cookie `httpOnly` mediante `authMiddleware` (o del header `Authorization: Bearer` mediante `authenticate`), y `authorize` valida contra `req.user.permissions`.

---

## Patrones de Diseño Aplicados

| Patrón | Ubicación | Propósito |
|--------|-----------|-----------|
| **Singleton** | `src/config/connectionDb.ts` | Garantizar una única instancia de conexión a la base de datos |
| **Composition Root** | `src/config/container.ts` | Instanciar y conectar todas las dependencias en un único lugar, incluido el enlace del Observer |
| **Repository** | `src/repositories/` | Abstraer el acceso a datos detrás de interfaces, desacoplando servicios del ORM |
| **Observer** | `src/observer/` | Desacoplar la emisión de eventos de dominio (cambio de estado) de los consumidores (notificaciones) |
| **Factory** | `src/notifications/notifierFactory.ts` | Crear instancias de notifiers según el canal configurado |
| **Strategy** | `src/notifications/notifier.ts` | Interfaz `INotifier` con múltiples implementaciones intercambiables |
| **Dependency Injection** | `src/routes/`, `src/services/` | Los servicios reciben repositorios vía constructor, facilitando testing y desacoplamiento |
