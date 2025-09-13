export interface User {
  id: string;
  username?: string; // Nit_proveedor
  name?: string;      // descripcion_comercial
  email?: string;     // Correo
  password?: string;  // hashed password (solo en repo, no devolver al cliente)
}
