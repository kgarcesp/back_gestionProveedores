/**
 * Entidad de dominio que representa la validez temporal de una lista de precios.
 * 
 * Esta clase encapsula la lógica de negocio relacionada con las fechas de vigencia
 * de las listas de precios de un proveedor, asegurando que las fechas sean coherentes
 * y cumplan con las reglas del negocio.
 * 
 * @class DateValidity
 * @module PriceList/Domain
 */
export class DateValidity {
  /**
   * Identificador único de la validez de fecha
   * @type {number}
   */
  id: number;

  /**
   * Identificador del proveedor asociado a esta validez
   * @type {number}
   */
  idProveedor: number;

  /**
   * Fecha de inicio de vigencia de la lista de precios (formato ISO 8601)
   * @type {string}
   */
  fecha_inicio: string;

  /**
   * Fecha de fin de vigencia de la lista de precios (formato ISO 8601)
   * @type {string}
   */
  fecha_fin: string;

  /**
   * Crea una instancia de DateValidity.
   * 
   * @constructor
   * @param {Object} params - Parámetros para crear la validez de fecha
   * @param {number} params.id - Identificador único de la validez
   * @param {number} params.idProveedor - Identificador del proveedor
   * @param {string} params.fecha_inicio - Fecha de inicio de vigencia
   * @param {string} params.fecha_fin - Fecha de fin de vigencia
   * 
   * @throws {Error} Si el ID no es proporcionado
   * @throws {Error} Si el ID del proveedor no es proporcionado
   * @throws {Error} Si la fecha de inicio es mayor que la fecha de fin
   * 
   * @example
   * const validez = new DateValidity({
   *   id: 1,
   *   idProveedor: 100,
   *   fecha_inicio: '2024-01-01',
   *   fecha_fin: '2024-12-31'
   * });
   */
  constructor(param: {
    id: number;
    idProveedor: number;
    fecha_inicio: string;
    fecha_fin: string;
  }) {
    if (!param.id) throw new Error('El ID es obligatorio');
    if (!param.idProveedor)
      throw new Error('El ID del proveedor es obligatorio');

    // Validaciones de negocio
    if (new Date(param.fecha_inicio) > new Date(param.fecha_fin)) {
      throw new Error(
        'La fecha de inicio no puede ser mayor que la fecha de fin'
      );
    }

    this.id = param.id;
    this.idProveedor = param.idProveedor;
    this.fecha_inicio = param.fecha_inicio;
    this.fecha_fin = param.fecha_fin;
  }
}
