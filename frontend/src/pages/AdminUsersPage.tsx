import { useEffect, useState } from "react";
import { userService } from "../services/user.service";
import { getErrorMessage } from "../services/apiClient";
import { useCan } from "../hooks/useCan";
import { Alert } from "../components/Alert";
import { Loader } from "../components/Loader";
import type { AdminUser, Role } from "../types/api.types";

/**
 * Administración de usuarios (RF6): listar usuarios con su rol y asignar
 * roles. Cada acción exige un permiso distinto en el backend, así que
 * los controles se ocultan según los permisos del usuario actual.
 */
export const AdminUsersPage = () => {
  const canAssignRole = useCan("assign_role");

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          userService.getAll(),
          userService.getRoles(),
        ]);
        if (cancelled) return;
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRoleChange = async (user: AdminUser, roleId: number) => {
    if (roleId === user.roleId) return;
    setSavingUserId(user.id);
    setError(null);
    setSuccessMsg(null);
    try {
      await userService.assignRole(user.id, roleId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                roleId,
                role: roles.find((r) => r.id === roleId) ?? u.role,
              }
            : u,
        ),
      );
      setSuccessMsg(`Rol actualizado para ${user.email}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingUserId(null);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800">Usuarios</h1>

      {error && (
        <div className="mt-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}
      {successMsg && (
        <div className="mt-4">
          <Alert variant="success">{successMsg}</Alert>
        </div>
      )}

      {users.length === 0 && !error ? (
        <p className="mt-6 text-sm text-slate-500">No hay usuarios cargados.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-semibold text-slate-800">
                  {user.name || user.email}
                </p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                {canAssignRole ? (
                  <select
                    value={user.roleId}
                    disabled={savingUserId === user.id}
                    onChange={(e) =>
                      handleRoleChange(user, Number(e.target.value))
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                    {user.role?.name ?? "sin rol"}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};
