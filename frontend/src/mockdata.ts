// mockdata.ts

export interface RegistroData {
  name: string;
  email: string;
  password: string;
}

// Registros válidos
export const registrosValidos: RegistroData[] = [
  { name: "Ana", email: "ana@example.com", password: "Password123!" },
  { name: "Luis", email: "luis@example.com", password: "Segura456#" },
  { name: "Maria", email: "maria@example.com", password: "Clave789$" },
];

// Registros inválidos, para probar validaciones del formulario
export const registrosInvalidos: (RegistroData & { motivo: string })[] = [
  { name: "Ana", email: "", password: "Password123!", motivo: "Email vacío" },
  { name: "Ana", email: "correo-sin-arroba", password: "Password123!", motivo: "Email con formato inválido" },
  { name: "Ana", email: "ana@example.com", password: "", motivo: "Contraseña vacía" },
  { name: "Ana", email: "ana@example.com", password: "123", motivo: "Contraseña demasiado corta" },
];

// Emails ya registrados, para simular el error "email en uso"
export const emailsExistentes: string[] = [
  "ana@example.com",
  "admin@example.com",
];

// Simula la llamada de registro al backend
export const registrarUsuarioMock = (data: RegistroData): Promise<{ ok: boolean; mensaje: string }> =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (emailsExistentes.includes(data.email)) {
        resolve({ ok: false, mensaje: "El email ya está registrado" });
      } else {
        resolve({ ok: true, mensaje: "Registro exitoso" });
      }
    }, 500);
  });


//mock de login
export const loginUsuarioMock = (email: string, password: string): Promise<{ ok: boolean; message: string }> => {
  const usuariosMock = [
    { email: "ana@mail.com", password: "1234" },
    { email: "luis@mail.com", password: "abcd" },
  ];

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuario = usuariosMock.find(
        (u) => u.email === email && u.password === password
      );

      if (usuario) {
        resolve({ ok: true, message: "Login exitoso" });
      } else {
        reject(new Error("Credenciales inválidas"));
      }
    }, 500);
  });
};
