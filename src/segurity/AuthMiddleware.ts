import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1]; // formato: Bearer <token>

  try {
    const secret = process.env.JWT_SECRET || "mysecretkey";
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
