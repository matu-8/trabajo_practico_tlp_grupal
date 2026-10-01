import { Permission } from "../models/permission.model.js";
import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";
import { hashPassword } from "../helpers/bcrypt.js";

const PERMISSIONS = [
  "book:read",
  "book:create",
  "book:update",
  "book:change-status",
  "book:delete",
  "subscription:create",
  "subscription:delete",
  "notification:read",
  "user:read",
  "user:assign-role",
];

const ROLES: Record<string, string[]> = {
  admin: PERMISSIONS,
  operador: PERMISSIONS.filter(
    (p) => !["book:delete", "user:read", "user:assign-role"].includes(p),
  ),
  usuario: ["book:read", "subscription:create", "subscription:delete", "notification:read"],
};

const USERS = [
  { name: "Admin", email: "admin@tp.com", password: "admin123", role: "admin" },
  { name: "Operador", email: "operador@tp.com", password: "operador123", role: "operador" },
  { name: "Usuario", email: "usuario@tp.com", password: "usuario123", role: "usuario" },
];

export async function runSeed(): Promise<void> {
  // Permisos
  const permissions: Permission[] = [];
  for (const name of PERMISSIONS) {
    const [permission] = await Permission.findOrCreate({ where: { name } });
    permissions.push(permission);
  }

  // Roles con sus permisos
  const roles: Record<string, Role> = {};
  for (const [roleName, permissionNames] of Object.entries(ROLES)) {
    const [role] = await Role.findOrCreate({ where: { name: roleName } });
    await role.setPermissions(permissions.filter((p) => permissionNames.includes(p.name)));
    roles[roleName] = role;
  }

  // Usuarios de prueba
  for (const user of USERS) {
    const role = roles[user.role];
    if (!role) throw new Error(`No existe el rol ${user.role}`);
    await User.findOrCreate({
      where: { email: user.email },
      defaults: {
        name: user.name,
        password: await hashPassword(user.password),
        roleId: role.id,
      },
    });
  }

  console.log("Seed ejecutada correctamente");
}
