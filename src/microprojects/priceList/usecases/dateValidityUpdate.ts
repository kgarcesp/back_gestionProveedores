import RepositoryListPrecios from "../repositories/repositoryPriceList";
import { DateValidity } from "../domain/dateValidity";

/**
 * Caso de uso para actualizar la validez temporal de listas de precios.
 * 
 * Este caso de uso gestiona la actualización de las fechas de vigencia
 * de las listas de precios de proveedores, delegando la persistencia
 * en el repositorio correspondiente.
 * 
 * @class DateValidityUsecase
 * @module PriceList/UseCases
 */
class DateValidityUsecase {
  /**
   * Repositorio para operaciones de persistencia de listas de precios
   * @private
   * @type {RepositoryListPrecios}
   */
  private repository: RepositoryListPrecios;

  /**
   * Crea una instancia de DateValidityUsecase.
   * 
   * Inicializa el repositorio necesario para realizar operaciones
   * de persistencia relacionadas con la validez de fechas.
   * 
   * @constructor
   */
  constructor() {
    this.repository = new RepositoryListPrecios();
  }

  /**
   * Actualiza las fechas de validez de listas de precios.
   * 
   * Recibe un array de objetos DateValidity y los procesa para
   * actualizar las fechas de vigencia en el sistema. Utiliza
   * operaciones de upsert para insertar o actualizar según corresponda.
   * 
   * @async
   * @param {DateValidity[]} data - Array de validaciones de fecha a actualizar
   * @returns {Promise<DateValidity[]>} Array de validaciones actualizadas con sus IDs
   * 
   * @throws {Error} Si ocurre un error durante la actualización en el repositorio
   * 
   * @example
   * const usecase = new DateValidityUsecase();
   * const validaciones = await usecase.updateValidityDate([
   *   {
   *     id: 1,
   *     idProveedor: 100,
   *     fecha_inicio: '2024-01-01',
   *     fecha_fin: '2024-12-31'
   *   }
   * ]);
   */
  async updateValidityDate(data: DateValidity[]): Promise<DateValidity[]> {
    return await this.repository.dateValidity(data);
  }
}

export default DateValidityUsecase;
