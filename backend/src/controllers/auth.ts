import { type Request, type Response } from "express";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
  } catch (error) {
    console.error();
    throw new Error("Error interno del servidor", { cause: error });
  }
};

export const login = () => {
  try {
  } catch (error) {
    console.error();
    throw new Error("Error interno del servidor", { cause: error });
  }
};

export const logout = () => {
  try {
  } catch (error) {
    console.error();
    throw new Error("Error interno del servidor", { cause: error });
  }
};

export const checkAuth = () => {
  try {
  } catch (error) {
    console.error();
    throw new Error("Error interno del servidor", { cause: error });
  }
};
