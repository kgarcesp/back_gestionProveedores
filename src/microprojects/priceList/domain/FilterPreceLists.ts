// src/microprojects/priceList/domain/PriceList.ts
import { PriceListItem } from '../../../shared/types/priceList';

/**
 * Entidad de dominio para filtrar y normalizar elementos de listas de precios.
 * 
 * Esta clase se encarga de validar y normalizar los datos de entrada relacionados
 * con listas de precios, asegurando que cumplan con las reglas de negocio antes
 * de ser procesados por capas superiores.
 * 
 * @class FilterPreceLists
 * @module PriceList/Domain
 */
export default class FilterPreceLists {
  /**
   * Datos normalizados del item de lista de precios
   * @private
   * @type {PriceListItem}
   */
  private data: PriceListItem;

  /**
   * Crea una instancia de FilterPreceLists.
   * 
   * Valida que los datos mínimos requeridos estén presentes y normaliza
   * los valores numéricos para asegurar consistencia en el formato.
   * 
   * @constructor
   * @param {PriceListItem} data - Datos del item de lista de precios
   * 
   * @throws {Error} Si COD_PROV no está presente en los datos
   * 
   * @example
   * const filtro = new FilterPreceLists({
   *   COD_PROV: '12345',
   *   COD_SAP: 'SAP001',
   *   COSTO_UNIT: 100.50,
   *   DESC1: 10,
   *   DESC2: 5,
   *   PROVEEDOR: 1
   * });
   */
  constructor(data: PriceListItem) {
    // validaciones mínimas (puedes ampliar)
    if (!data || !data.COD_PROV) {
      throw new Error('COD_PROV es requerido en PriceList');
    }

    /**
     * Normaliza un valor a número o null.
     * 
     * @private
     * @param {any} v - Valor a normalizar
     * @returns {number | null} Número normalizado o null si no es válido
     * 
     * @example
     * normalizeNumber('123') // 123
     * normalizeNumber('') // null
     * normalizeNumber(undefined) // null
     */
    const normalizeNumber = (v: any): number | null => {
      if (v === undefined || v === null || v === '') return null;
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

  /**
   * Convierte la entidad de dominio a un objeto plano.
   * 
   * Devuelve el objeto con la forma esperada por el repository (PriceListItem),
   * permitiendo que sea persistido en la base de datos.
   * 
   * @public
   * @returns {PriceListItem} Objeto plano con los datos normalizados
   * 
   * @example
   * const filtro = new FilterPreceLists(data);
   * const objeto = filtro.toObject();
   * // objeto contiene los datos normalizados listos para persistir
   */
  public toObject(): PriceListItem {
    return { ...this.data };
  }
}
