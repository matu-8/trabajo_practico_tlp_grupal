import jwt from "jsonwebtoken";
import type { TokenUserData } from "../repositories/interfaces/user.interface.js";

export const generateToken = (payload: TokenUserData) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
  } catch (error) {
    console.error(error);
    throw new Error("Error al crear el token", { cause: error });
  }
};

export const verifyToken = (token: string): TokenUserData => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "string") {
      throw new Error("Payload de token inválido");
    }

    return decoded as unknown as TokenUserData;
  } catch (error) {
    console.error(error);
    throw new Error("Algo salio mal al verificar el token", { cause: error });
  }
};
