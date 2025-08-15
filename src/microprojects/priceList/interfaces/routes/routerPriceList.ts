import { Router } from "express";
import ControllerListaPrecios from "../controllers/controllerPriceList";

const router = Router();
const controller = new ControllerListaPrecios();

router.post("/validate", controller.insertListPrecios);
router.get("/validate-products", controller.seeListPrice);
router.post("/update-prices", controller.updatePrice);

export default router;
