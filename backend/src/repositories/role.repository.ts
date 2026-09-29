import { Role } from "../models/role.model.js";
import type { IRoleRepository } from "./interfaces/role.interface.js";

export class RoleRepository implements IRoleRepository {
  async findAll(): Promise<Role[]> {
    return Role.findAll();
  }

  async findById(id: number): Promise<Role | null> {
    return Role.findByPk(id);
  }

  async findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name } });
  }
}
