"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/usecases/SeePriceLists.ts
const repositoryPriceList_1 = __importDefault(require("../repositories/repositoryPriceList"));
class SeePriceLists {
    constructor() {
        this.repository = new repositoryPriceList_1.default();
    }
    /**
     * Obtiene la lista de precios filtrada opcionalmente por proveedor.
     * @param proveedorFilter Código del proveedor (opcional)
     */
    async getCombinedPrices(proveedorFilter) {
        try {
            return await this.repository.getPrices(proveedorFilter);
        }
        catch (error) {
            console.error("Error en getCombinedPrices:", error);
            throw error;
        }
    }
}
exports.default = SeePriceLists;
