import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController();

// Ruta pública de login
router.post("/login", authController.login);

export default router;
