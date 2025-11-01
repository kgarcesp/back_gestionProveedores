// src/microprojects/priceList/usecases/getListaPrecios.ts

import RepositoryListaPrecios from "../repositories/repositoryPriceList";
import PriceList from "../domain/PriceList";
import { PriceListItem } from "../../../shared/types/priceList";

/**
 * Caso de uso para registrar nuevas listas de precios.
 * 
 * Este caso de uso se encarga de recibir una o varias entradas de lista de precios,
 * transformarlas en entidades del dominio y delegar la inserción en el repositorio.
 * 
 * Su objetivo es mantener la lógica de negocio separada de la capa de datos y
 * asegurar que los datos pasen por validaciones y normalizaciones antes de ser persistidos.
 * 
 * @class GetListaPrecios
 * @module PriceList/UseCases
 */
export default class GetListaPrecios {
  /**
   * Repositorio encargado de las operaciones de persistencia de listas de precios
   * @private
   * @type {RepositoryListaPrecios}
   */
  private repository: RepositoryListaPrecios;

  /**
   * Crea una instancia de GetListaPrecios.
   * 
   * Inicializa el repositorio necesario para realizar operaciones
   * de inserción de listas de precios.
   * 
   * @constructor
   */
  constructor() {
    this.repository = new RepositoryListaPrecios();
  }

  /**
   * Inserta una nueva lista de precios en el sistema.
   * 
   * Este método recibe datos de listas de precios (uno o múltiples items),
   * los valida y normaliza a través de entidades de dominio, y luego
   * los persiste en la base de datos mediante el repositorio.
   * 
   * Proceso:
   * 1. Normaliza la entrada a un array (si se recibe un solo elemento)
   * 2. Convierte cada item en una entidad PriceList (aplica validaciones)
   * 3. Extrae los objetos planos validados
   * 4. Delega la inserción al repositorio
   * 
   * @async
   * @public
   * @param {PriceListItem | PriceListItem[]} data - Lista de precios a insertar (uno o varios items)
   * @param {string} data.COD_PROV - Código del proveedor
   * @param {string} data.COD_SAP - Código SAP del producto
   * @param {number} data.COSTO_UNIT - Costo unitario del producto
   * @param {number} data.DESC1 - Primer descuento aplicable
   * @param {number} data.DESC2 - Segundo descuento aplicable
   * @param {number} data.PROVEEDOR - ID del proveedor
   * 
   * @returns {Promise<any>} Array de registros insertados con sus IDs asignados
   * 
   * @throws {Error} Si COD_PROV no está presente en algún item
   * @throws {Error} Si ocurre algún problema durante el procesamiento o la inserción
   * 
   * @example
   * const usecase = new GetListaPrecios();
   * 
   * // Insertar un solo item
   * const resultado = await usecase.newListPrecios({
   *   COD_PROV: '12345',
   *   COD_SAP: 'SAP001',
   *   COSTO_UNIT: 100.50,
   *   DESC1: 10,
   *   DESC2: 5,
   *   PROVEEDOR: 1
   * });
   * 
   * // Insertar múltiples items
   * const resultados = await usecase.newListPrecios([
   *   { COD_PROV: '12345', COSTO_UNIT: 100.50, ... },
   *   { COD_PROV: '67890', COSTO_UNIT: 200.00, ... }
   * ]);
   */
  public async newListPrecios(data: PriceListItem | PriceListItem[]): Promise<any> {
    try {
      // Normalizamos: siempre trabajaremos con un arreglo
      const lista = Array.isArray(data) ? data : [data];

      // Convertimos cada item en una entidad y luego lo pasamos a objeto plano
      const listaPreciosEntities: PriceListItem[] = lista.map((item) => {
        const entity = new PriceList(item); // Aplica reglas y validaciones del dominio
        return entity.toObject(); // Convierte la entidad en un objeto simple
      });

      // Llamamos al repositorio para insertar los registros
      const inserted = await this.repository.insertarListPrecios(listaPreciosEntities);
      return inserted;
    } catch (error: any) {
      console.error("Error en newListPrecios:", error.message);
      throw error; 
    }
  }
}
