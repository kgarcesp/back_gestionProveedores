// src/usecases/SeePriceLists.ts
import RepositoryListaPrecios from "../repositories/repositoryPriceList";

/**
 * Caso de uso para consultar listas de precios combinadas.
 * 
 * Este caso de uso permite obtener información completa de listas de precios,
 * combinando datos de las listas de precios del sistema con información
 * adicional proveniente de SAP, como descripciones y precios efectivos.
 * 
 * @class SeePriceLists
 * @module PriceList/UseCases
 */
export default class SeePriceLists {
  /**
   * Repositorio para operaciones de persistencia de listas de precios
   * @private
   * @type {RepositoryListaPrecios}
   */
  private repository: RepositoryListaPrecios;

  /**
   * Crea una instancia de SeePriceLists.
   * 
   * Inicializa el repositorio necesario para realizar consultas
   * combinadas entre las listas de precios locales y SAP.
   * 
   * @constructor
   */
  constructor() {
    this.repository = new RepositoryListaPrecios();
  }

  /**
   * Obtiene precios combinados de listas locales y SAP.
   * 
   * Realiza una consulta que combina información de las listas de precios
   * almacenadas en el sistema con datos adicionales desde SAP, incluyendo:
   * - Código de proveedor y SAP
   * - Descripción del material
   * - Costos unitarios y descuentos
   * - Fechas de actualización
   * - Tipos de impuesto y precios efectivos
   * 
   * @async
   * @public
   * @param {string} [proveedorFilter] - Código del proveedor para filtrar (opcional)
   * @returns {Promise<any[]>} Array de precios combinados con información completa
   * 
   * @throws {Error} Si ocurre un error al obtener las listas de precios
   * 
   * @example
   * const usecase = new SeePriceLists();
   * 
   * // Obtener todas las listas de precios
   * const todasListas = await usecase.getCombinedPrices();
   * 
   * // Obtener listas de un proveedor específico
   * const listasProveedor = await usecase.getCombinedPrices('100');
   */
  public async getCombinedPrices(proveedorFilter?: string) {
    try {
      return await this.repository.getPrices(proveedorFilter);
    } catch (error: any) {
      console.error("Error en getCombinedPrices:", error.message);
      throw error;
    }
  }
}
