"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/updateLists.ts
const repositoryPriceList_1 = __importDefault(require("../repositories/repositoryPriceList"));
class UpdateLists {
    constructor() {
        this.repository = new repositoryPriceList_1.default();
    }
    async updateListsPrecios(data) {
        try {
            // Adaptamos los datos solo con los campos válidos
            const adapted = data.map((item) => ({
                id: Number(item.id), // update por id
                ...(item.costo_unitario !== undefined && { costo_unitario: Number(item.costo_unitario) }),
                ...(item.descuento1 !== undefined && { descuento1: Number(item.descuento1) }),
                ...(item.descuento2 !== undefined && { descuento2: Number(item.descuento2) }),
            }));
            return await this.repository.updateListPrice(adapted);
        }
        catch (error) {
            console.error("Error en updateListsPrecios:", error);
            throw error;
        }
    }
}
exports.default = UpdateLists;
