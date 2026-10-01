import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

const isTokenPayload = (value: unknown): value is TokenPayload => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v["id"] === "number" &&
    typeof v["name"] === "string" &&
    typeof v["email"] === "string" &&
    typeof v["role"] === "string" &&
    Array.isArray(v["permissions"])
  );
};

export const generateToken = (payload: TokenPayload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
  } catch (error) {
    console.error(error);
    throw new Error("Error al crear el token", { cause: error });
  }
};

export const verifyToken = (token: string): TokenPayload => {
  let decoded: unknown;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error("Token inválido o vencido", { cause: error });
  }

  if (!isTokenPayload(decoded)) {
    throw new Error("El token no tiene el formato esperado");
  }
  return decoded;
};
