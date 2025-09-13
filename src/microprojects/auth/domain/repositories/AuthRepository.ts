import { User } from "../entities/User";

export interface AuthRepository {
  // ahora usa username en lugar de email
  login(username: string, password: string): Promise<User | null>;
}
