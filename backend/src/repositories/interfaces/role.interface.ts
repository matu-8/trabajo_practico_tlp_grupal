import { Role } from "../../models/role.model.js";

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
}
