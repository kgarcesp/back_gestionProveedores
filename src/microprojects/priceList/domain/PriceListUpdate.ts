class PriceListUpdate {
  COD_PROV: string;
  NEW_COSTO_UNIT: string;

  constructor({
    COD_PROV,
    NEW_COSTO_UNIT
  }: {
    COD_PROV: string;
    NEW_COSTO_UNIT: string;
  }) {
    if (!COD_PROV) throw new Error("COD_PROV es requerido");
    if (!NEW_COSTO_UNIT) throw new Error("NEW_COSTO_UNIT es requerido");

    this.COD_PROV = COD_PROV;
    this.NEW_COSTO_UNIT = NEW_COSTO_UNIT;
  }
}

export default PriceListUpdate;
