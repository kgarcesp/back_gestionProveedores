import { AuthRepository } from "../domain/repositories/AuthRepository";

export class LoginUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(username: string, password: string) {
    return await this.authRepository.login(username, password);
  }
}
