import pool from "../../../config/db_agendamiento";
import { User } from "../domain/entities/User";

export class repositoryAuth {
  async login(username: string, password: string): Promise<User | null> {
    const [rows]: any = await pool.query(
      `SELECT 
         id_proveedor AS id,
         Nit_proveedor AS username,
         descripcion_comercial AS name,
         Correo AS email
       FROM seguimiento_proveedores.proveedores
       WHERE Nit_proveedor = ?`,
      [username]
    );

    if (rows.length === 0) return null;

    const user = rows[0];

    // Validamos: la contraseña debe ser igual al id_proveedor
    if (String(user.id) !== password) return null;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    };
  }
}
