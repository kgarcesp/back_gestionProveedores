import { Router } from "express";
import ControllerListaPrecios from "../controllers/controllerPriceList";
import { authMiddleware } from "../../../../shared/auth/authMiddleware"

const router = Router();
const controller = new ControllerListaPrecios();
// authMiddleware
router.post("/validate", controller.insertListPrecios);
router.get("/validate-products", controller.seeListPrice);
router.post("/update-prices",  controller.updatePrice);
router.post("/date-validity",  controller.dateValidity);

export default router;
