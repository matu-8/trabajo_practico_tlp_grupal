import { User } from "../../models/user.model.js";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
  updateRole(userId: number, roleId: number): Promise<User | null>;
}
