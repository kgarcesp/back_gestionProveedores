"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PriceList {
    constructor(data) {
        // validaciones mínimas (puedes ampliar)
        if (!data || !data.COD_PROV) {
            throw new Error("COD_PROV es requerido en PriceList");
        }
        // normalizar: convertir strings numéricas a números
        const normalizeNumber = (v) => {
            if (v === undefined || v === null || v === "")
                return null;
            const n = Number(v);
            return Number.isNaN(n) ? null : n;
        };
        this.data = {
            COD_PROV: String(data.COD_PROV),
            COD_SAP: data.COD_SAP ?? null,
            COSTO_UNIT: normalizeNumber(data.COSTO_UNIT),
            DESC1: normalizeNumber(data.DESC1),
            DESC2: normalizeNumber(data.DESC2),
            PROVEEDOR: data.PROVEEDOR ?? null,
            // si agregas campos en shared/types, normalízalos acá
        };
    }
    // devuelve el objeto plano con la forma esperada por el repository (PriceListItem)
    toObject() {
        return { ...this.data };
    }
}
exports.default = PriceList;
