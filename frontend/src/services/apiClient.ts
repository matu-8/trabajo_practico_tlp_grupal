import { API_BASE_URL } from "../config/api";
import type { FieldError } from "../types/api.types";

// status 0 = el servidor no respondió (API apagada, CORS, red caída)
const NO_RESPONSE = 0;

/**
 * Error que lanza `request`. Permite reaccionar según el status HTTP
 * (401 = sesión vencida, 400/401 = credenciales) sin comparar strings.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly errors: FieldError[] | undefined;

  constructor(status: number, message: string, errors?: FieldError[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

/**
 * Único punto de contacto con el backend: aplica la URL base, envía las
 * cookies de sesión y convierte cualquier falla en un `ApiError`.
 * Ningún componente fuera de `services/` debe usar `fetch` directamente.
 */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body } = options;
  const hasBody = body !== undefined;

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      // Imprescindible: el token viaja en una cookie httpOnly
      credentials: "include",
      headers: hasBody ? { "Content-Type": "application/json" } : undefined,
      body: hasBody ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        payload?.msg ?? "Ocurrió un error inesperado",
        payload?.errors,
      );
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // Solo llega acá si no hubo respuesta del servidor
    throw new ApiError(NO_RESPONSE, "No se pudo conectar con el servidor");
  }
}

/**
 * Extrae el mensaje listo para mostrar. Permite que los componentes de la capa
 * de presentación muestren errores sin conocer la clase `ApiError`.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "Ocurrió un error inesperado",
): string {
  return error instanceof ApiError ? error.message : fallback;
}