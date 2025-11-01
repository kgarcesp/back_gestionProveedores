import { PriceListItem } from '../../../shared/types/priceList';

/**
 * Entidad de dominio que representa un elemento de lista de precios.
 *
 * Esta clase encapsula las reglas de negocio para un item individual de lista de precios,
 * validando y normalizando los datos para asegurar su integridad antes de ser persistidos.
 *
 * @class PriceList
 * @module PriceList/Domain
 */
export default class PriceList {
  /**
   * Datos normalizados del item de lista de precios
   * @private
   * @type {PriceListItem}
   */
  private data: PriceListItem;

  /**
   * Crea una instancia de PriceList.
   *
   * Valida los datos mínimos requeridos y normaliza los valores numéricos,
   * convirtiendo strings numéricos en números y manejando valores nulos.
   *
   * @constructor
   * @param {PriceListItem} data - Datos del item de lista de precios
   * @param {string} data.COD_PROV - Código del proveedor (requerido, alfanumérico, máx. 12 caracteres)
   * @param {string|null} [data.COD_SAP] - Código SAP del producto (numérico, máx. 6 dígitos)
   * @param {string|null} [data.DESCRIP] - Descripción del producto (alfanumérico, máx. 40 caracteres)
   * @param {number|string|null} [data.COSTO_UNIT] - Costo unitario del producto (decimal)
   * @param {number|string|null} [data.DESC1] - Primer descuento aplicable (numérico, máx. 3 dígitos)
   * @param {number|string|null} [data.DESC2] - Segundo descuento aplicable (numérico, máx. 3 dígitos)
   * @param {number|null} [data.PROVEEDOR] - ID del proveedor
   *
   * @throws {Error} Si COD_PROV no está presente en los datos
   * @throws {Error} Si alguna validación de formato o tamaño falla
   *
   * @example
   * const precio = new PriceList({
   *   COD_PROV: '12345',
   *   COD_SAP: '123456',
   *   DESCRIP: 'Producto de ejemplo',
   *   COSTO_UNIT: '100.50',
   *   DESC1: 10,
   *   DESC2: 5,
   *   PROVEEDOR: 1
   * });
   */
  constructor(data: PriceListItem) {
    // Validaciones de datos requeridos
    if (!data || !data.COD_PROV) {
      throw new Error('COD_PROV es requerido en PriceList');
    }

    // Validar COD_PROV: Alfanumérico, máximo 12 caracteres
    this.validateCodProv(data.COD_PROV);

    // Validar COD_SAP: Numérico, máximo 6 dígitos (si está presente)
    if (
      data.COD_SAP !== undefined &&
      data.COD_SAP !== null &&
      data.COD_SAP !== ''
    ) {
      this.validateCodSap(data.COD_SAP);
    }

    // Validar DESCRIP: Alfanumérico, máximo 40 caracteres (si está presente)
    if (
      data.DESCRIP !== undefined &&
      data.DESCRIP !== null &&
      data.DESCRIP !== ''
    ) {
      this.validateDescrip(data.DESCRIP);
    }

    // Validar COSTO_UNIT: Decimal (si está presente)
    if (
      data.COSTO_UNIT !== undefined &&
      data.COSTO_UNIT !== null &&
      data.COSTO_UNIT !== ''
    ) {
      this.validateCostoUnit(data.COSTO_UNIT);
    }

    // Validar DESC1: Numérico, máximo 3 dígitos (si está presente)
    if (data.DESC1 !== undefined && data.DESC1 !== null && data.DESC1 !== '') {
      this.validateDescuento(data.DESC1, 'DESC1');
    }

    // Validar DESC2: Numérico, máximo 3 dígitos (si está presente)
    if (data.DESC2 !== undefined && data.DESC2 !== null && data.DESC2 !== '') {
      this.validateDescuento(data.DESC2, 'DESC2');
    }

    /**
     * Normaliza un valor a número o null.
     *
     * @private
     * @param {any} v - Valor a normalizar (puede ser string, número, null o undefined)
     * @returns {number | null} Número parseado o null si el valor no es válido
     *
     * @example
     * normalizeNumber('123.45') // 123.45
     * normalizeNumber('') // null
     * normalizeNumber(undefined) // null
     * normalizeNumber('abc') // null
     */
    const normalizeNumber = (v: any): number | null => {
      if (v === undefined || v === null || v === '') return null;
      const n = Number(v);
      return Number.isNaN(n) ? null : n;
    };

    this.data = {
      COD_PROV: String(data.COD_PROV).trim(),
      COD_SAP: data.COD_SAP ? String(data.COD_SAP).trim() : null,
      DESCRIP: data.DESCRIP ? String(data.DESCRIP).trim() : null,
      COSTO_UNIT: normalizeNumber(data.COSTO_UNIT),
      DESC1: normalizeNumber(data.DESC1),
      DESC2: normalizeNumber(data.DESC2),
      PROVEEDOR: data.PROVEEDOR ?? null,
    };
  }

  /**
   * Valida el código del proveedor (COD_PROV).
   * Debe ser alfanumérico y tener máximo 12 caracteres.
   *
   * @private
   * @param {string} codProv - Código del proveedor a validar
   * @throws {Error} Si el código es inválido o excede la longitud máxima
   */
  private validateCodProv(codProv: string): void {
    const trimmedCodProv = String(codProv).trim();

    if (trimmedCodProv.length === 0) {
      throw new Error('COD_PROV no puede estar vacío');
    }

    if (trimmedCodProv.length > 12) {
      throw new Error(
        `COD_PROV excede el máximo de 12 caracteres (actual: ${trimmedCodProv.length})`
      );
    }

    // Validar que sea alfanumérico
    const alfanumericoRegex = /^[a-zA-Z0-9]+$/;
    if (!alfanumericoRegex.test(trimmedCodProv)) {
      throw new Error('COD_PROV debe ser alfanumérico (solo letras y números)');
    }
  }

  /**
   * Valida el código SAP (COD_SAP).
   * Debe ser numérico y tener máximo 6 dígitos.
   *
   * @private
   * @param {string} codSap - Código SAP a validar
   * @throws {Error} Si el código es inválido o excede la longitud máxima
   */
  private validateCodSap(codSap: string): void {
    const trimmedCodSap = String(codSap).trim();

    if (trimmedCodSap.length === 0) {
      return; // Permitir valores vacíos ya que es opcional
    }

    // Validar que sea numérico
    const numericoRegex = /^\d+$/;
    if (!numericoRegex.test(trimmedCodSap)) {
      throw new Error('COD_SAP debe ser numérico (solo dígitos)');
    }

    if (trimmedCodSap.length > 6) {
      throw new Error(
        `COD_SAP excede el máximo de 6 dígitos (actual: ${trimmedCodSap.length})`
      );
    }
  }

  /**
   * Valida la descripción del producto (DESCRIP).
   * Debe ser alfanumérico y tener máximo 40 caracteres (contando espacios).
   *
   * @private
   * @param {string} descrip - Descripción a validar
   * @throws {Error} Si la descripción es inválida o excede la longitud máxima
   */
  private validateDescrip(descrip: string): void {
    const trimmedDescrip = String(descrip).trim();

    if (trimmedDescrip.length === 0) {
      return; // Permitir valores vacíos ya que es opcional
    }

    if (trimmedDescrip.length > 40) {
      throw new Error(
        `DESCRIP excede el máximo de 40 caracteres (actual: ${trimmedDescrip.length})`
      );
    }

    // Validar que sea alfanumérico (permitiendo espacios)
    // Se permite alfanumérico, espacios, caracteres especiales básicos y matemáticos: . , - _ ( ) / # : + * % = < > ^ $ &
    const alfanumericoYEspecialesRegex = /^[a-zA-Z0-9\s.,\-_/()#:+*%<>=^$&]+$/;
    if (!alfanumericoYEspecialesRegex.test(trimmedDescrip)) {
      throw new Error(
        'DESCRIP debe ser alfanumérico y puede incluir los caracteres básicos'
      );
    }
  }

  /**
   * Valida el costo unitario (COSTO_UNIT).
   * Se aceptan valores enteros y decimales, y se admiten valores con separador de miles (coma).
   * Siempre se normalizan a decimal independientemente del formato recibido.
   *
   * @private
   * @param {number | string} costoUnit - Costo unitario a validar
   * @throws {Error} Si el costo no es un número decimal válido
   */
  private validateCostoUnit(costoUnit: number | string): void {
    let valor: number;

    if (typeof costoUnit === 'string') {
      // Eliminamos espacios
      let trimmed = costoUnit.trim();
      // Permitimos valores como "13,500.00" quitando las comas de miles (sólo si hay punto decimal, o si hay solo comas)
      // Se aceptan formatos con o sin separador de miles (ejemplo: "13500", "13,500", "13,500.00", "13500.00")
      trimmed = trimmed.replace(/,/g, ''); // quita todas las comas
      valor = Number(trimmed);
    } else {
      valor = Number(costoUnit);
    }

    if (isNaN(valor) || !isFinite(valor)) {
      throw new Error('COSTO_UNIT debe ser un número decimal válido');
    }

    if (valor < 0) {
      throw new Error('COSTO_UNIT no puede ser negativo');
    }
  }

  /**
   * Valida que los descuentos (DESC1 o DESC2) sean números enteros entre 0 y 100.
   *
   * @private
   * @param {number | string} descuento - Descuento a validar (únicamente entero)
   * @param {string} nombreCampo - Nombre del campo ('DESC1' o 'DESC2')
   * @throws {Error} Si el descuento es inválido o fuera de rango permitido
   */
  private validateDescuento(
    descuento: number | string,
    nombreCampo: string
  ): void {
    let valor: number;

    if (typeof descuento === "string") {
      // Eliminar posibles espacios y validar que no tiene símbolos extraños
      const trimmed = descuento.trim();
      if (!/^-?\d+$/.test(trimmed)) {
        throw new Error(`${nombreCampo} debe ser un número entero`);
      }
      valor = Number(trimmed);
    } else {
      valor = descuento;
    }

    if (!Number.isInteger(valor)) {
      throw new Error(`${nombreCampo} debe ser un número entero`);
    }

    if (isNaN(valor)) {
      throw new Error(`${nombreCampo} debe ser un número válido`);
    }

    if (valor < 0) {
      throw new Error(`${nombreCampo} no puede ser negativo`);
    }

    if (valor > 100) {
      throw new Error(
        `${nombreCampo} excede el máximo de 3 dígitos (valor máximo: 100)`
      );
    }
  }

  /**
   * Convierte la entidad a un objeto plano.
   *
   * Retorna una copia del objeto de datos normalizado en formato PriceListItem,
   * listo para ser procesado por el repositorio o persistido en la base de datos.
   *
   * @public
   * @returns {PriceListItem} Objeto plano con los datos normalizados
   *
   * @example
   * const precio = new PriceList(data);
   * const objetoPlano = precio.toObject();
   * // objetoPlano contiene los datos validados y normalizados
   */
  public toObject(): PriceListItem {
    return { ...this.data };
  }
}
