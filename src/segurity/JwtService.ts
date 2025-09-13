import jwt, { SignOptions, JwtPayload, Secret } from "jsonwebtoken";

export class JwtService {
  private secret: Secret;

  constructor() {
    this.secret = process.env.JWT_SECRET || "mysecretkey";
  }

  generateToken(payload: object, expiresIn: string | number = "1h"): string {
    const options: SignOptions = { expiresIn: expiresIn as any }; // 👈 fix
    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): string | JwtPayload | null {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }
}
