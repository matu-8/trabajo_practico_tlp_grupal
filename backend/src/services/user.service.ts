import type { IUserRepository } from "../repositories/interfaces/user.interface.js";
import type { IRoleRepository } from "../repositories/interfaces/role.interface.js";

export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository
  ) {}

  async getAll() {
    return this.userRepository.findAll();
  }

  async getRoles() {
    return this.roleRepository.findAll();
  }

  async assignRole(userId: number, roleId: number) {
    const role = await this.roleRepository.findById(roleId);
    if (!role) throw new Error('El rol no existe');

    const user = await this.userRepository.updateRole(userId, roleId);
    if (!user) throw new Error('El usuario no existe');

    return user;
  }
}