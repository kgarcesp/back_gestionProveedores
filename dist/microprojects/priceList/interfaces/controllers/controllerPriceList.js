"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getPriceList_1 = __importDefault(require("../../usecases/getPriceList"));
const seePriceLists_1 = __importDefault(require("../../usecases/seePriceLists"));
const updateLists_1 = __importDefault(require("../../usecases/updateLists"));
class ControllerListaPrecios {
    constructor() {
        // Casos de uso que encapsulan la lógica de negocio
        this.registeListPrecios = new getPriceList_1.default();
        this.priceLists = new seePriceLists_1.default();
        this.updateListsFinish = new updateLists_1.default();
        /**
         * Inserta una nueva lista de precios en el sistema.
         *
         * - Valida que la estructura de datos recibida sea un arreglo.
         * - Llama al caso de uso `GetListaPrecios` para procesar la inserción.
         * - Devuelve un mensaje de éxito o error según corresponda.
         */
        this.insertListPrecios = async (req, res) => {
            if (!req.body?.data || !Array.isArray(req.body.data)) {
                return this.sendResponse(res, 400, false, null, "Datos inválidos", ["Se requiere un arreglo de datos"]);
            }
            try {
                const result = await this.registeListPrecios.newListPrecios(req.body.data);
                return this.sendResponse(res, 200, true, result, "Lista de precios procesada correctamente");
            }
            catch (error) {
                console.error("Error en insertListPrecios:", error);
                return this.sendResponse(res, 500, false, null, error.message || "Error interno del servidor", [error.message]);
            }
        };
        /**
         * Obtiene la lista de precios existente.
         *
         * - Permite filtrar por proveedor mediante el parámetro de consulta `proveedor`.
         * - Llama al caso de uso `SeePriceLists` para obtener los datos combinados.
         * - Devuelve los datos obtenidos o un error si falla la consulta.
         */
        this.seeListPrice = async (req, res) => {
            try {
                const { proveedor } = req.query;
                const result = await this.priceLists.getCombinedPrices(proveedor);
                return this.sendResponse(res, 200, true, result, "Datos obtenidos correctamente");
            }
            catch (error) {
                console.error("Error en seeListPrice:", error);
                return this.sendResponse(res, 500, false, null, "Error al obtener la lista de precios", [error.message]);
            }
        };
        /**
         * Actualiza una lista de precios existente.
         *
         * - Valida que la estructura de datos recibida sea un arreglo.
         * - Llama al caso de uso `UpdateLists` para realizar la actualización.
         * - Devuelve un mensaje de éxito o error según corresponda.
         */
        this.updatePrice = async (req, res) => {
            if (!req.body?.data || !Array.isArray(req.body.data)) {
                return res.status(400).json({
                    success: false,
                    message: "Datos inválidos",
                    errors: ["Se requiere un arreglo de datos"],
                });
            }
            try {
                const result = await this.updateListsFinish.updateListsPrecios(req.body.data);
                return res.status(200).json({
                    success: true,
                    message: "Lista de precios actualizada correctamente",
                    data: result,
                });
            }
            catch (error) {
                console.error("Error en updatePrice:", error);
                return res.status(500).json({
                    success: false,
                    message: "Error actualizando lista de precios",
                    errors: [error.message],
                });
            }
        };
    }
    /**
     * Método centralizado para enviar respuestas HTTP con un formato consistente.
     *
     * @param res     - Objeto de respuesta de Express.
     * @param status  - Código de estado HTTP.
     * @param success - Indica si la operación fue exitosa.
     * @param data    - Datos a devolver en la respuesta.
     * @param message - Mensaje descriptivo del resultado.
     * @param errors  - Lista de errores (opcional).
     */
    sendResponse(res, status, success, data, message, errors = []) {
        return res.status(status).json({ success, data, message, errors });
    }
}
exports.default = ControllerListaPrecios;
