import type {
  BasicUserData,
  CreateUserData,
  IUserRepository,
} from "../repositories/interfaces/user.interface.js";
import { hashPassword, verifyPassword } from "../helpers/bcrypt.js";
import { generateToken } from "../helpers/jwt.js";

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async register({ name, email, password, roleId }: CreateUserData) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error("El usuario ya existe");
    const passwordHash = await hashPassword(password);
    const user = await this.userRepository.createUser({
      name,
      email,
      password: passwordHash,
      roleId: 2,
    });
    return { msg: "Usuario creado correctamente", ok: true, data: user };
  }

  async login({ email, password }: BasicUserData) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Credenciales invalidas");
    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword) throw new Error("Credenciales invalidas");

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      },
      token,
    };
  }
}
