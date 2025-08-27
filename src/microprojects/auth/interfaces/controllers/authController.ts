import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string; 

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;



  if (username !== "admin" || password !== "1234") {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  

  const payload = {
    id: 1,
    username: username,
    role: password,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

  return res.json({
    message: "Login exitoso",
    token,
  });
};
