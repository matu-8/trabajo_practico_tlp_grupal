import type {
  BasicUserData,
  CreateUserData,
  IUserRepository,
  PublicUser,
} from "../repositories/interfaces/user.interface.js";
import { hashPassword, verifyPassword } from "../helpers/bcrypt.js";
import { generateToken } from "../helpers/jwt.js";
import type { IRoleRepository } from "../repositories/interfaces/role.interface.js";
import type { User } from "../models/user.model.js";
import { HttpError } from "../errors/httpError.js";

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository,
  ) {}

  // Nunca se devuelve el modelo de Sequelize tal cual: se filtra el password.
  // Los permisos salen de `role.permissions`, que findByEmail ya trae en el join
  private static toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      permissions: user.role?.permissions?.map((p) => p.name) ?? [],
    };
  }

  async register({ name, email, password }: Omit<CreateUserData, "roleId">) {
    const existingUser = await this.userRepository.findByEmail(email);
    // 409 = conflicto de negocio, no un error interno
    if (existingUser) throw new HttpError(409, "El email ya está registrado");
    const passwordHash = await hashPassword(password);

    const role = await this.roleRepository.findByName("usuario");
    if (!role) throw new Error("No existe el rol usuario, ejecute la seed");
    const user = await this.userRepository.createUser({
      name,
      email,
      password: passwordHash,
      roleId: role.id,
    });
    return AuthService.toPublicUser(user);
  }

  async login({ email, password }: BasicUserData) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new HttpError(401, "Credenciales inválidas");
    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword) throw new HttpError(401, "Credenciales inválidas");

    const publicUser = AuthService.toPublicUser(user);

    // El token lleva el roleId (FK numérica) para que /auth/check
    // devuelva exactamente la misma forma que /auth/login
    const token = generateToken(publicUser);

    return {
      user: publicUser,
      token,
    };
  }
}
