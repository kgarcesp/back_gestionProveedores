"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllerPriceList_1 = __importDefault(require("../controllers/controllerPriceList"));
const router = (0, express_1.Router)();
const controller = new controllerPriceList_1.default();
router.post("/validate", controller.insertListPrecios);
router.get("/validate-products", controller.seeListPrice);
router.post("/update-prices", controller.updatePrice);
exports.default = router;
