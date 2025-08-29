import { Router } from "express";
import ControllerListaPrecios from "../controllers/controllerPriceList";
import { authMiddleware } from "../../../../shared/auth/authMiddleware"

const router = Router();
const controller = new ControllerListaPrecios();

router.post("/validate", authMiddleware, controller.insertListPrecios);
router.get("/validate-products", authMiddleware, controller.seeListPrice);
router.post("/update-prices", authMiddleware, controller.updatePrice);
router.post("/date-validity", authMiddleware, controller.dateValidity);

export default router;
