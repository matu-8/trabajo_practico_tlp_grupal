import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { Permission } from "../models/permission.model.js";
import type {
  IUserRepository,
  CreateUserData,
} from "./interfaces/user.interface.js";

export class UserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    return User.findAll({
      attributes: { exclude: ["password"] },
      include: { model: Role, as: "role" },
    });
  }

  async findById(id: number): Promise<User | null> {
    return User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: {
        model: Role,
        as: "role",
        include: [{ model: Permission, as: "permissions" }],
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email },
      include: {
        model: Role,
        as: "role",
        include: [{ model: Permission, as: "permissions" }],
      },
    });
  }

  async createUser(data: CreateUserData): Promise<User> {
    return User.create({ ...data });
  }

  async updateRole(userId: number, roleId: number): Promise<User | null> {
    const user = await User.findByPk(userId);
    if (!user) return null;
    return user.update({ roleId });
  }
}
