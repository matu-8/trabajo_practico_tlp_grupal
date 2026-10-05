const DEFAULT_API_BASE_URL = "http://localhost:3000/api";

// Única fuente de la dirección del backend en toda la aplicación.
// Se puede sobreescribir con VITE_API_URL sin tocar el código.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE_URL;