import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const saltRound: number = 10;
  try {
    return await bcrypt.hash(password, saltRound);
  } catch (error) {
    console.error(error);
    throw new Error("Algo salio mal al hashear la contraseña", {
      cause: error,
    });
  }
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error(error);
    throw new Error("Algo salio mal al verificar la contraseña", {
      cause: error,
    });
  }
};
