// src/services/updateLists.ts
import RepositoryListPrecios from "../repositories/repositoryPriceList";

/**
 * Caso de uso para actualizar listas de precios existentes.
 * 
 * Este caso de uso gestiona la actualización de precios en listas existentes,
 * normalizando los datos recibidos y delegando la operación de actualización
 * al repositorio correspondiente.
 * 
 * @class UpdateLists
 * @module PriceList/UseCases
 */
class UpdateLists {
  /**
   * Repositorio para operaciones de persistencia de listas de precios
   * @private
   * @type {RepositoryListPrecios}
   */
  private repository: RepositoryListPrecios;

  /**
   * Crea una instancia de UpdateLists.
   * 
   * Inicializa el repositorio necesario para realizar operaciones
   * de actualización sobre listas de precios existentes.
   * 
   * @constructor
   */
  constructor() {
    this.repository = new RepositoryListPrecios();
  }

  /**
   * Actualiza múltiples elementos de listas de precios.
   * 
   * Procesa un array de items a actualizar, adaptando la estructura de datos
   * para incluir solo los campos modificados. Cada item puede actualizar:
   * - costo_unitario: Nuevo costo unitario del producto
   * - descuento1: Primer descuento aplicable
   * - descuento2: Segundo descuento aplicable
   * 
   * Solo se incluyen en la actualización los campos que están definidos,
   * permitiendo actualizaciones parciales.
   * 
   * @async
   * @param {any[]} data - Array de items a actualizar
   * @param {number} data[].id - ID del registro a actualizar (requerido)
   * @param {number} [data[].costo_unitario] - Nuevo costo unitario (opcional)
   * @param {number} [data[].descuento1] - Nuevo descuento 1 (opcional)
   * @param {number} [data[].descuento2] - Nuevo descuento 2 (opcional)
   * 
   * @returns {Promise<Object>} Resultado de la actualización
   * @returns {number} return.updatedCount - Cantidad de registros actualizados
   * @returns {Array} return.updatedItems - Array con los registros actualizados
   * @returns {string} return.message - Mensaje descriptivo del resultado
   * 
   * @throws {Error} Si ocurre un error durante la actualización
   * 
   * @example
   * const usecase = new UpdateLists();
   * const resultado = await usecase.updateListsPrecios([
   *   {
   *     id: 1,
   *     costo_unitario: 150.00,
   *     descuento1: 10
   *   },
   *   {
   *     id: 2,
   *     descuento2: 5
   *   }
   * ]);
   * // resultado: { updatedCount: 2, updatedItems: [...], message: '...' }
   */
  async updateListsPrecios(data: any[]) {
    try {
      console.log(data);

      const adapted = data.map((item) => ({
        id: Number(item.id),
        ...(item.costo_unitario !== undefined && { costo_unitario: Number(item.costo_unitario) }),
        ...(item.descuento1 !== undefined && { descuento1: Number(item.descuento1) }),
        ...(item.descuento2 !== undefined && { descuento2: Number(item.descuento2) }),
      }));

      return await this.repository.updateListPrice(adapted);
    } catch (error: any) {
      console.error("Error en updateListsPrecios:", error.message);
      throw error;
    }
  }
}

export default UpdateLists;
