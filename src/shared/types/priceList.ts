// src/shared/types/priceList.ts
export interface PriceListItem {
  COD_PROV: string;                      // obligatorio (id o código del proveedor) - Alfanumérico, máximo 12 caracteres
  COD_SAP?: string | null;              // opcional - Numérico, máximo 6 dígitos
  DESCRIP?: string | null;              // opcional - Alfanumérico, máximo 40 caracteres contando espacios
  COSTO_UNIT?: number | string | null;  // puede venir como string desde el cliente - Decimal
  DESC1?: number | string | null;       // Numérico, máximo 3 dígitos
  DESC2?: number | string | null;       // Numérico, máximo 3 dígitos
  PROVEEDOR?: number | null;             // id del proveedor
  // agrega aquí nuevos campos que vayan a compartirse entre capas
}
// src/types/priceList.ts
export interface UpdatePriceListItem {
  id: number;
  costo_unitario?: number | string;
  descuento1?: number | string;
  descuento2?: number | string;
}

export interface dateValidity {
  id: number;
  idProveedor?: number | string;
  fecha_inicio?: Date | string;
  fecha_fin?: Date | string;
}

export interface SupplierPriceRow {
  id: number;
  cod_prov: string;
  cod_sap: string;
  costo_unitario: number;
  descuento1: number;
  descuento2: number;
  proveedor_id: number;
  fecha_actualizacion_precio?: Date;
  descripcion?: string;
  tipo_impuesto?: string;
  precio_bruto?: number;
  precio_neto?: number;
  fecha_actualizacion_proveedor?: Date;
}