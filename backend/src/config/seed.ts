import { Permission } from "../models/permission.model.js";
import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";
import { Book } from "../models/book.model.js";
import type { BookStatus } from "../models/book.model.js";
import { hashPassword } from "../helpers/bcrypt.js";

// Permisos del sistema, tal como los documenta el README
const PERMISSIONS = [
  "list_users",
  "assign_role",
  "create_book",
  "update_book",
  "change_status",
  "delete_book",
] as const;

// Usuario de prueba para poder verificar el control de acceso por permisos
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "Admin1234!";

interface SampleBook {
  title: string;
  author: string;
  description: string;
  status: BookStatus;
}

// Libros de ejemplo: dan contenido a la lista y a las notificaciones
const SAMPLE_BOOKS: SampleBook[] = [
  {
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    description:
      "La saga de la familia Buendía a lo largo de siete generaciones en Macondo.",
    status: "DISPONIBLE",
  },
  {
    title: "El nombre de la rosa",
    author: "Umberto Eco",
    description:
      "Un monje y su aprendiz investigan una muerte en una abadía medieval.",
    status: "PRESTADO",
  },
  {
    title: "Ficciones",
    author: "Jorge Luis Borges",
    description:
      "Colección de cuentos en la que Borges juega con el tiempo y el azar.",
    status: "DISPONIBLE",
  },
  {
    title: "Rayuela",
    author: "Julio Cortázar",
    description:
      "Novela con itinerarios y decisiones que toma el lector.",
    status: "EN_REPARACION",
  },
  {
    title: "Pedro Páramo",
    author: "Juan Rulfo",
    description:
      "Un hombre vuelve a Comala para buscar a su padre entre sus recuerdos.",
    status: "DISPONIBLE",
  },
];

/**
 * Carga los datos mínimos que la aplicación necesita para funcionar.
 * Es idempotente: se puede ejecutar en cada arranque sin duplicar nada.
 */
export async function seed(): Promise<void> {
  // 1) Permisos
  const permissions: Permission[] = [];
  for (const name of PERMISSIONS) {
    const [permission] = await Permission.findOrCreate({
      where: { name },
      defaults: { name },
    });
    permissions.push(permission);
  }

  // 2) Roles. "usuario" es el que se asigna al registrarse y no lleva permisos
  await Role.findOrCreate({
    where: { name: "usuario" },
    defaults: { name: "usuario" },
  });
  const [admin] = await Role.findOrCreate({
    where: { name: "admin" },
    defaults: { name: "admin" },
  });

  // 3) Permisos del admin (tabla pivote role_permissions)
  await admin.setPermissions(permissions);

  // 4) Usuario admin de prueba. Se hashea solo si todavía no existe
  const existingAdmin = await User.findOne({ where: { email: ADMIN_EMAIL } });
  if (!existingAdmin) {
    await User.create({
      name: "Administrador",
      email: ADMIN_EMAIL,
      password: await hashPassword(ADMIN_PASSWORD),
      roleId: admin.id,
    });
  }

  // 5) Libros de ejemplo
  for (const book of SAMPLE_BOOKS) {
    await Book.findOrCreate({
      where: { title: book.title },
      defaults: { ...book },
    });
  }

  console.log(
    `Seed listo: ${permissions.length} permisos, 2 roles y ${SAMPLE_BOOKS.length} libros de ejemplo.`,
  );
}