import { User } from "../../models/user.model.js";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export interface BasicUserData {
  email: string;
  password: string;
}

// Payload del JWT. Los permisos viajan aquí para que el middleware
// `authorize` pueda decidir sin volver a consultar la base
export interface TokenUserData {
  id: number;
  name: string;
  email: string;
  roleId: number;
  permissions: string[];
}

// Es lo único del usuario que puede enviarse al frontend: nunca el password
export interface PublicUser {
  id: number;
  name: string;
  email: string;
  roleId: number;
  permissions: string[];
}

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createUser(data: CreateUserData): Promise<User>;
  updateRole(userId: number, roleId: number): Promise<User | null>;
}
