import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { repositoryAuth } from "../../repositories/repositoryAuth";
import { LoginUserUseCase } from "../../usecases/loginUserCase";

const JWT_SECRET = process.env.JWT_SECRET as string;

export class AuthController {
  private loginUserUseCase: LoginUserUseCase;

  constructor() {
    const authRepository = new repositoryAuth();
    this.loginUserUseCase = new LoginUserUseCase(authRepository);
  }

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const user = await this.loginUserUseCase.execute(username, password);

  
      if (!user) {
        return res.status(401).json({ success: false, message: "Credenciales inválidas" });
      }

      const payload = {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      return res.json({
        success: true,
        message: "Login exitoso",
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ success: false, message: "Error en el servidor" });
    }
  };
}
