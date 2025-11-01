import RepositoryListaPrecios from "../repositories/repositoryPriceList";

/**
 * Caso de uso para obtener plantillas de precios desde SAP.
 * 
 * Este caso de uso se encarga de recuperar información de precios
 * directamente desde SAP para generar plantillas que pueden ser
 * utilizadas como base para crear o actualizar listas de precios.
 * 
 * @class getPricingtemplate
 * @module PriceList/UseCases
 */
export default class getPricingtemplate {
  /**
   * Repositorio para operaciones de persistencia de listas de precios
   * @private
   * @type {RepositoryListaPrecios}
   */
  private repository: RepositoryListaPrecios;

  /**
   * Crea una instancia de getPricingtemplate.
   * 
   * Inicializa el repositorio necesario para realizar consultas
   * a la base de datos y obtener información de SAP.
   * 
   * @constructor
   */
  constructor() {
    this.repository = new RepositoryListaPrecios();
  }

  /**
   * Obtiene la plantilla de precios desde SAP.
   * 
   * Recupera información de precios efectivos desde el sistema SAP,
   * permitiendo filtrar opcionalmente por proveedor. Esta información
   * incluye códigos de material, descripciones y precios efectivos.
   * 
   * @async
   * @public
   * @param {string} [proveedorFilter] - Código del proveedor para filtrar (opcional)
   * @returns {Promise<any[]>} Array con la información de precios desde SAP
   * 
   * @throws {Error} Si ocurre un error al obtener la plantilla de precios
   * 
   * @example
   * const usecase = new getPricingtemplate();
   * 
   * // Obtener plantilla de todos los proveedores
   * const todasPlantillas = await usecase.getPricingTemplate();
   * 
   * // Obtener plantilla de un proveedor específico
   * const plantillaProveedor = await usecase.getPricingTemplate('100');
   */
  public async getPricingTemplate(proveedorFilter?: string) {
    try {
      return await this.repository.getPricingTemplate(proveedorFilter);
    } catch (error: any) {
      console.error("Error en getPricingTemplate:", error.message);
      throw error;
    }
  }
}
