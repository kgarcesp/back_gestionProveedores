"use strict";
// src/microprojects/priceList/usecases/getListaPrecios.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const repositoryPriceList_1 = __importDefault(require("../repositories/repositoryPriceList"));
const PriceList_1 = __importDefault(require("../domain/PriceList"));
/**
 * Caso de uso: GetListaPrecios
 *
 * Este caso de uso se encarga de recibir una o varias entradas de lista de precios,
 * transformarlas en entidades del dominio y delegar la inserción en el repositorio.
 *
 * Su objetivo es mantener la lógica de negocio separada de la capa de datos y
 * asegurar que los datos pasen por validaciones y normalizaciones antes de ser persistidos.
 */
class GetListaPrecios {
    constructor() {
        this.repository = new repositoryPriceList_1.default();
    }
    /**
     * Inserta una nueva lista de precios en el sistema.
     *
     * - Puede aceptar uno o varios registros.
     * - Convierte cada elemento recibido en una entidad `PriceList` para aplicar
     *   reglas y validaciones de negocio.
     * - Devuelve los datos ya insertados (o el resultado que retorne el repositorio).
     *
     * @param data Lista de precios a insertar, puede ser un solo elemento o un arreglo.
     * @returns Resultado de la operación de inserción en la base de datos.
     *
     * @throws Error si ocurre algún problema durante el procesamiento o la inserción.
     */
    async newListPrecios(data) {
        try {
            // Normalizamos: siempre trabajaremos con un arreglo
            const lista = Array.isArray(data) ? data : [data];
            // Convertimos cada item en una entidad y luego lo pasamos a objeto plano
            const listaPreciosEntities = lista.map((item) => {
                const entity = new PriceList_1.default(item); // Aplica reglas y validaciones del dominio
                return entity.toObject(); // Convierte la entidad en un objeto simple
            });
            // Llamamos al repositorio para insertar los registros
            const inserted = await this.repository.insertarListPrecios(listaPreciosEntities);
            return inserted;
        }
        catch (error) {
            console.error("Error en newListPrecios:", error);
            throw error; // Propagamos el error para que el controlador lo maneje
        }
    }
}
exports.default = GetListaPrecios;
