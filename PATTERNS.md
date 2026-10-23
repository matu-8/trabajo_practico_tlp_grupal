# Patrones de diseño — Backend

Documentación de los patrones de diseño y arquitectónicos empleados en el
backend (`backend/src/`). Stack: Node.js + TypeScript + Express 5 +
Sequelize (PostgreSQL).

Arquitectura general en capas (estilo MVC sin vistas, API REST):

```
routes → middlewares → controllers → services → repositories → models (Sequelize/PostgreSQL)
                                (observer/ + notifications/ en services de dominio)
```

Los cuatro patrones participan de un mismo flujo: el cambio de estado de
un libro:

```
BookService.changeStatus()
   └─> EventPublisher.notify(event)                      ← Observer (Subject)
         └─> NotificationService.update(event)           ← Observer (Observer)
               ├─ consulta suscriptores al repositorio   ← usa Database (Singleton)
               └─ NotifierFactory.create('inapp')        ← Factory
                  NotifierFactory.create('console')
                        └─ ConsoleNotifierAdapter        ← Adapter
                              └─ console.log
```

La instanciación de todo el grafo de dependencias se centraliza en
`config/container.ts` y las rutas solo declaran los endpoints.

---

## 1. Singleton — `config/connectionDb.ts`

Una única instancia de la conexión a la base de datos en toda la
aplicación, con constructor privado y acceso estático:

```ts
export class Database {
  public static instance: Database;
  private constructor() { /* crea la conexión Sequelize */ }

  static getInstance(): Database {
    if (!this.instance) return (this.instance = new Database());
    return this.instance;
  }
}
```

**Problema que resuelve:** evita múltiples conexiones/pools a PostgreSQL
por accidente; todo el código comparte la misma conexión.

## 2. Repository — `repositories/ más repositories/interfaces/`

Toda la interacción con la base de datos vive en repositorios, definidos
por interfaces y aislados de la lógica de negocio:

```ts
export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findById(id: number): Promise<Book | null>;
  create(data: BookData): Promise<Book>;
  updateStatus(id: number, status: BookStatus): Promise<Book | null>;
  ...
}
```

Implementaciones: `book.repository.ts`, `user.repository.ts`,
`role.repository.ts`, `suscripcion.repository.ts`,
`notification.repository.ts`.

**Problema que resuelve:** los servicios no saben cómo se persisten los
datos (Sequelize); cambiar el ORM o el motor no toca la lógica de negocio,
y los repositorios son testeables con reemplazos en memoria.

## 3. Service Layer — `services/`

Lógica de negocio encapsulada en servicios, entre el controller y los
repositorios. Ejemplo: `subscription.service.ts` valida existencia del
libro y suscripciones duplicadas antes de persistir:

```ts
export class SubscriptionService {
  constructor(
    private subscriptionRepository: ISubscriptionRepository,
    private bookRepository: IBookRepository
  ) {}

  async subscribe(userId: number, bookId: number) {
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new Error('El libro no existe');
    if (await this.subscriptionRepository.exists(userId, bookId))
      throw new Error('Ya estás suscripto a este libro');
    return this.subscriptionRepository.create(userId, bookId);
  }
}
```

**Problema que resuelve:** controladores delgados (solo HTTP) y reglas de
negocio reutilizables y testeables, sin dependencias de Express.

## 4. Dependency Injection + Container — `config/container.ts`

Las clases no crean sus dependencias: las reciben por constructor contra
interfaces. El `container` es el único lugar que instancia e inyecta todo
el grafo (Composition Root):

```ts
const eventPublisher = new EventPublisher();
eventPublisher.attach(notificationService);

const bookService = new BookService(bookRepository, eventPublisher);
export const container = { authService, bookService, ... } as const;
```

```ts
// routes/book.routes.ts — solo declara rutas
const bookController = new BookController(container.bookService);
```

**Problema que resuelve:** acoplamiento bajo (dependen de interfaces, no de
implementaciones), necesaria para el intercambio de fuentes de datos
(req. del patrón Repository) y para wiring explícito entre módulos.

## 5. Observer — `observer/`

Publicación/suscripción de eventos de dominio. `EventPublisher`
implements `ISubject` (attach/detach/notify) y los observadores
implements `IObserver`:

```ts
export interface IObserver  { update(event: BookStatusChangeEvent): Promise<void>; }
export interface ISubject   { attach(o: IObserver): void; notify(e: BookStatusChangeEvent): Promise<void>; }
```

`EventPublisher` notifica a cada observador ante un
`BookStatusChangeEvent` (cambio de estado de un libro). El observador
registrado es `NotificationService`, que recorre los suscriptores del
libro y genera una notificación por persona:

```ts
export class NotificationService implements IObserver {
  async update(event: BookStatusChangeEvent) {
    const subscribers = await this.subscriptionRepository.findSubscribersByBook(event.bookId);
    for (const user of subscribers) { /* crea y envía notificación */ }
  }
}
```

**Problema que resuelve:** el `BookService` no conoce al sistema de
notificaciones; cambiar el estado del libro y notificar está desacoplado
(agregar observadores nuevos no modifica el editor).

## 6. Factory Method — `notifications/notifierFactory.ts`

Creación de notificadores por tipo de canal, centralizada en una fábrica:

```ts
export class NotifierFactory {
  create(type: NotifierType): INotifier {
    switch (type) {
      case "inapp":   return new InAppNotifier(this.notificationRepository);
      case "console": return new ConsoleNotifierAdapter();
    }
  }
}
```

**Problema que resuelve:** el código cliente no usa `new` de cada notificador;
agregar un canal nuevo (email, push) es un caso más de la fábrica.

## 7. Adapter — `notifications/consoleNotifierAdapter.ts`

Adapta la salida por consola a la interfaz `INotifier`, de modo que
cualquier notificador se invoca y envía de la misma forma:

```ts
export class ConsoleNotifierAdapter implements INotifier {
  async send(notification: Notification): Promise<void> {
    console.log(`[NOTIFICACIÓN] Para: ${notification.userEmail} | ...`);
  }
}
```

**Problema que resuelve:** `NotificationService` itera `INotifier[]`
uniformemente sin conocer el mecanismo de entrega de cada canal
("inapp" y "console" coexisten por config: `["inapp", "console"]`).

## 8. Middleware Chain + Authorization Policy — `middlewares/`

Pipeline de Express para autenticación, verificación de permisos (RBAC)
y validación de datos, pensado para componerse por ruta:

```ts
export const authorize: Authorize = (permission) => (req, res, next) => {
  if (!req.user) { res.status(401).json({ ok: false, msg: 'No autenticado' }); return; }
  if (!req.user.permissions.includes(permission))
    { res.status(403).json({ ok: false, msg: 'No tenés permiso para esta acción' }); return; }
  next();
};
```

**Problema que resuelve:** separa los cross-cutting concerns (sesión JWT,
permisos, validación con `express-validator`) del código de negocio;
el endpoint declara qué necesita, no cómo tratar cada fallo.

## 9. Excepción tipada — `errors/httpError.ts`

Los errores de negocio viajan como clase `HttpError` con su código HTTP,
traducida a respuesta uniforme `{ ok: false, msg }`:

```ts
export class HttpError extends Error {
  constructor(public readonly statusCode: number, message: string) { super(message); }
}
```

**Problema que resuelve:** los services lanzan errores sin conocer HTTP;
`sendError()` traduce de forma única a JSON y distingue errores esperados
de fallas internas (500).

## 10. Front Controller + Router — `routes/`

Express actúa como front controller: `routes/index.routes.ts` monta los
routers por recurso (`/api/books`, `/api/auth`, ...) y cada archivo de
rutas une middlewares con el controller correspondiente.

**Problema que resuelve:** punto único de entrada de las peticiones con
despacho declarativo por recurso.

---

## Principios SOLID

### S — Responsabilidad única

Separación estricta entre las tres capas: los controllers solo traducen
HTTP a llamadas y respuestas (`auth.controller.ts`), los services contienen
las reglas de negocio (`subscription.service.ts`, valida duplicados antes
de persistir), y los repositories solo acceden a la base de datos
(`book.repository.ts`). Además, `errors/sendError()` concentra el manejo de
errores en un solo lugar.

```ts
// repositories/book.repository.ts — solo consulta/persiste, no hay reglas de negocio
async findById(id: number) { return Book.findByPk(id); }
```

**Problema que resuelve:** cada clase tiene una sola razón para cambiar; un
cambio de frontend, de reglas o de base de datos modifica una capa y no
desarma todo.

### O — Abierto/cerrado

Se agregan nuevos comportamientos añadiendo código, no modificando el
existente: un canal de notificación nuevo (por ejemplo email) es una clase
nueva que implementa `INotifier` más una opción en la fábrica, sin tocar
`NotificationService.update()` ni el resto del servicio:

```ts
// notifications/notifierFactory.ts — extender a email solo suma un caso
create(type: NotifierType): INotifier {
  switch (type) {
    case "inapp":   return new InAppNotifier(this.notificationRepository);
    case "console": return new ConsoleNotifierAdapter();
  }
}
```

**Problema que resuelve:** evoluciona las salidas de notificación (o los
roles y permisos) sin riesgo de romper la lógica ya probada del servicio.

### L — Sustitución de Liskov

Todas las clases que implementan `INotifier` (`InAppNotifier`,
`ConsoleNotifierAdapter`) son intercambiables entre sí: prometen el mismo
contrato `send(notification): Promise<void>`, por lo que el
`NotificationService` las recorre e invoca indistintamente:

```ts
// services/notification.service.ts — no distingue qué clase concreta es
for (const notifier of this.notifiers) {
  await notifier.send(notification);
}
```

**Problema que resuelve:** cualquier canal puede reemplazar a otro (o
sumarse vía `channels: NotifierType[]`) sin cambios de comportamiento
inesperados en quien lo consume.

### I — Segregación de interfaces

Cada repositorio define una interfaz chica y específica para su entidad,
con solo las operaciones que necesita el dominio, en lugar de una interfaz
genérica grande:

```ts
// repositories/interfaces/book.interface.ts — solo lo necesario para libros
export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findById(id: number): Promise<Book | null>;
  create(data: BookData): Promise<Book>;
  update(id: number, data: Partial<BookData>): Promise<Book | null>;
  updateStatus(id: number, status: BookStatus): Promise<Book | null>;
  delete(id: number): Promise<boolean>;
}
```

**Problema que resuelve:** los servicios nunca dependen de métodos que no
usan; cada consumidor solo ve las operaciones de su caso de uso.

### D — Inversión de dependencias

Los services y los subject/observers dependen de **abstracciones**
(interfaces de repositorio y de notificador), nunca de implementaciones
concretas; son el `container` (`config/container.ts`, composition root) y
las rutas quienes instancian e inyectan las clases concretas por
constructor:

```ts
// config/container.ts — la capa alta define qué implementación concreta usar
const authService = new AuthService(userRepository, roleRepository);   // IRoleRepository/UserRepository
const bookService = new BookService(bookRepository, eventPublisher);  // IBookRepository + ISubject
```

**Problema que resuelve:** desacopla la capa de lógica de la de
persistencia: cambiar un repositorio (otra fuente de datos o un stub de
testeo) no exige tocar ningún service.
