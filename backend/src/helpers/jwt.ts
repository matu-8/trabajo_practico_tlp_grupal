import jwt from "jsonwebtoken";
export const generateToken = (payload: any) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
  } catch (error) {
    console.error(error);
    throw new Error("Error al crear el token", { cause: error });
  }
};

export const verifyToken = (token: any) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error(error);
    throw new Error("Algo salio mal al verificar el token", { cause: error });
  }
};
