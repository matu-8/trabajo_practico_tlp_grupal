import type {
  BasicUserData,
  CreateUserData,
  IUserRepository,
} from "../repositories/interfaces/user.interface.js";
import { hashPassword, verifyPassword } from "../helpers/bcrypt.js";
import { generateToken } from "../helpers/jwt.js";
import type { IRoleRepository } from "../repositories/interfaces/role.interface.js";

export class AuthService {
  constructor(private userRepository: IUserRepository,
              private roleRepository: IRoleRepository,
  ) {}

  async register({ name, email, password }: Omit<CreateUserData, "roleId">) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error("El usuario ya existe");
    const passwordHash = await hashPassword(password);

    const role = await this.roleRepository.findByName("usuario");
    if (!role) throw new Error("No existe el rol usuario, ejecute la seed");
    const user = await this.userRepository.createUser({
      name,
      email,
      password: passwordHash,
      roleId: role.id,
    });
    return { msg: "Usuario creado correctamente", ok: true, data: user };
  }

  async login({ email, password }: BasicUserData) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("Credenciales invalidas");
    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword) throw new Error("Credenciales invalidas");


      const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name ?? "",
      permissions: user.role?.permissions?.map((p) => p.name) ?? [],
    };

    const token = generateToken(userData);
    return {
      user: userData, token
    };
  }
}
