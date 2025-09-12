import { PriceListItem } from "../../../shared/types/priceList";

export default class PriceList {
  private data: PriceListItem;

  constructor(data: PriceListItem) {
    // validaciones mínimas (puedes ampliar)
    if (!data || !data.COD_PROV) {
      throw new Error("COD_PROV es requerido en PriceList");
    }

    // normalizar: convertir strings numéricas a números
    const normalizeNumber = (v: any): number | null => {
      if (v === undefined || v === null || v === "") return null;
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

    };
  }

  public toObject(): PriceListItem {
    return { ...this.data };
  }
}
