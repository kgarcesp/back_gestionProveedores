/**
 * Entidad de dominio para actualización de precios en listas.
 * 
 * Esta clase encapsula la información necesaria para actualizar el costo
 * unitario de un producto en la lista de precios, validando que los datos
 * requeridos estén presentes antes de proceder con la actualización.
 * 
 * @class PriceListUpdate
 * @module PriceList/Domain
 */
class PriceListUpdate {
  /**
   * Código del proveedor del producto a actualizar
   * @type {string}
   */
  COD_PROV: string;

  /**
   * Nuevo costo unitario a aplicar al producto
   * @type {string}
   */
  NEW_COSTO_UNIT: string;

  /**
   * Crea una instancia de PriceListUpdate.
   * 
   * Valida que tanto el código de proveedor como el nuevo costo unitario
   * estén presentes antes de crear la instancia.
   * 
   * @constructor
   * @param {Object} params - Parámetros para la actualización
   * @param {string} params.COD_PROV - Código del proveedor (requerido)
   * @param {string} params.NEW_COSTO_UNIT - Nuevo costo unitario (requerido)
   * 
   * @throws {Error} Si COD_PROV no es proporcionado
   * @throws {Error} Si NEW_COSTO_UNIT no es proporcionado
   * 
   * @example
   * const actualizacion = new PriceListUpdate({
   *   COD_PROV: '12345',
   *   NEW_COSTO_UNIT: '150.00'
   * });
   */
  constructor({
    COD_PROV,
    NEW_COSTO_UNIT,
  }: {
    COD_PROV: string;
    NEW_COSTO_UNIT: string;
  }) {
    if (!COD_PROV) throw new Error('COD_PROV es requerido');
    if (!NEW_COSTO_UNIT) throw new Error('NEW_COSTO_UNIT es requerido');

    this.COD_PROV = COD_PROV;
    this.NEW_COSTO_UNIT = NEW_COSTO_UNIT;
  }
}

export default PriceListUpdate;
