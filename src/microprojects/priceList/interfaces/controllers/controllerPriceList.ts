/**
 * Controlador para la gestión de listas de precios de proveedores.
 * 
 * Este controlador maneja todas las peticiones HTTP relacionadas con listas de precios,
 * coordinando la ejecución de casos de uso y formateando las respuestas de forma consistente.
 * 
 * Funcionalidades:
 * - Inserción de nuevas listas de precios
 * - Consulta de listas existentes con información de SAP
 * - Actualización de precios y descuentos
 * - Gestión de vigencia temporal de listas
 * - Obtención de plantillas desde SAP
 * 
 * @class ControllerListaPrecios
 * @module PriceList/Interfaces/Controllers
 */

import { Request, Response } from "express";
import GetListaPrecios from "../../usecases/getPriceList";
import SeePriceLists from "../../usecases/seePriceLists";
import UpdateLists from "../../usecases/updateLists";
import DateValidityUsecase from "../../usecases/dateValidityUpdate";
import getPricingtemplate from "../../usecases/getPricingTemplate";

export default class ControllerListaPrecios {

  /**
   * Caso de uso para registrar nuevas listas de precios
   * @private
   * @type {GetListaPrecios}
   */
  private registeListPrecios = new GetListaPrecios();

  /**
   * Caso de uso para consultar listas de precios existentes
   * @private
   * @type {SeePriceLists}
   */
  private priceLists = new SeePriceLists();

  /**
   * Caso de uso para actualizar listas de precios
   * @private
   * @type {UpdateLists}
   */
  private updateListsFinish = new UpdateLists();

  /**
   * Caso de uso para gestionar validez temporal de listas
   * @private
   * @type {DateValidityUsecase}
   */
  private dateValidityUsecase = new DateValidityUsecase();

  /**
   * Caso de uso para obtener plantillas de precios desde SAP
   * @private
   * @type {getPricingtemplate}
   */
  private pricingtemplate = new getPricingtemplate();

  /**
   * Método centralizado para enviar respuestas HTTP con un formato consistente.
   * 
   * Estandariza el formato de todas las respuestas del controlador, asegurando
   * que siempre incluyan los mismos campos: success, data, message y errors.
   * 
   * @private
   * @param {Response} res - Objeto de respuesta de Express
   * @param {number} status - Código de estado HTTP (200, 400, 500, etc.)
   * @param {boolean} success - Indica si la operación fue exitosa
   * @param {any} data - Datos a devolver en la respuesta
   * @param {string} message - Mensaje descriptivo del resultado
   * @param {any[]} [errors=[]] - Lista de errores (opcional)
   * 
   * @returns {Response} Respuesta HTTP formateada
   * 
   * @example
   * this.sendResponse(res, 200, true, userData, "Usuario creado exitosamente");
   * this.sendResponse(res, 400, false, null, "Datos inválidos", ["Campo X requerido"]);
   */
  private sendResponse(
    res: Response,
    status: number,
    success: boolean,
    data: any,
    message: string,
    errors: any[] = []
  ) {
    return res.status(status).json({ success, data, message, errors });
  }

  /**
   * Controlador para insertar nuevas listas de precios.
   * 
   * Maneja la petición HTTP POST para registrar una lista de precios.
   * Valida que los datos sean un array, añade el ID del proveedor autenticado
   * a cada item, y delega la lógica de negocio al caso de uso correspondiente.
   * 
   * @async
   * @public
   * @param {Request} req - Objeto de petición de Express
   * @param {Object} req.body - Cuerpo de la petición
   * @param {Array} req.body.data - Array de items de lista de precios
   * @param {Object} req.user - Usuario autenticado (añadido por authMiddleware)
   * @param {number} req.user.id - ID del proveedor autenticado
   * @param {Response} res - Objeto de respuesta de Express
   * 
   * @returns {Promise<Response>} Respuesta HTTP con el resultado de la operación
   * 
   * @example
   * // Request body:
   * {
   *   "data": [
   *     {
   *       "COD_PROV": "12345",
   *       "COD_SAP": "SAP001",
   *       "COSTO_UNIT": 100.50,
   *       "DESC1": 10,
   *       "DESC2": 5
   *     }
   *   ]
   * }
   * 
   * // Response 200:
   * {
   *   "success": true,
   *   "data": [...],
   *   "message": "Lista de precios procesada correctamente",
   *   "errors": []
   * }
   */
  public insertListPrecios = async (req: Request, res: Response) => {
    const proveedor = (req as any).user?.id;

    if (!req.body?.data || !Array.isArray(req.body.data)) {
      return this.sendResponse(
        res,
        400,
        false,
        null,
        "Datos inválidos",
        ["Se requiere un arreglo de datos"]
      );
    }

    try {
      // Añadimos el proveedor_id a cada item de la lista
      const dataWithProveedor = req.body.data.map((item: any) => ({
        ...item,
        PROVEEDOR: proveedor,
      }));

      const result = await this.registeListPrecios.newListPrecios(dataWithProveedor);

      return this.sendResponse(
        res,
        200,
        true,
        result,
        "Lista de precios procesada correctamente"
      );
    } catch (error: any) {
      console.error("Error en insertListPrecios:", error.message);
      return this.sendResponse(
        res,
        500,
        false,
        null,
        error.message || "Error interno del servidor",
        [error.message]
      );
    }
  };


  /**
   * Controlador para consultar listas de precios existentes.
   * 
   * Maneja la petición HTTP GET para obtener las listas de precios del proveedor
   * autenticado. Combina información de las listas locales con datos de SAP,
   * incluyendo descripciones, precios efectivos y tipos de impuesto.
   * 
   * @async
   * @public
   * @param {Request} req - Objeto de petición de Express
   * @param {Object} req.user - Usuario autenticado (añadido por authMiddleware)
   * @param {number} req.user.id - ID del proveedor autenticado
   * @param {Response} res - Objeto de respuesta de Express
   * 
   * @returns {Promise<Response>} Respuesta HTTP con las listas de precios
   * 
   * @example
   * // Response 200:
   * {
   *   "success": true,
   *   "data": [
   *     {
   *       "id": 1,
   *       "cod_prov": "12345",
   *       "cod_sap": "SAP001",
   *       "descripcion": "Producto X",
   *       "costo_unitario": 100.50,
   *       "descuento1": 10,
   *       "descuento2": 5,
   *       "proveedor_id": 100,
   *       "fecha_actualizacion_precio": "2024-01-15",
   *       "tipo_impuesto": "IVA",
   *       "precio_bruto": 120.00,
   *       "precio_neto": 108.00
   *     }
   *   ],
   *   "message": "Datos obtenidos correctamente",
   *   "errors": []
   * }
   */
  public seeListPrice = async (req: Request, res: Response) => {
    try {
      // tomamos como id de proveedor aquel que esta logeado
      const proveedor = (req as any).user?.id;



      if (!proveedor) {
        return this.sendResponse(res, 400, false, null, "Proveedor no especificado");
      }

      const result = await this.priceLists.getCombinedPrices(proveedor);
      return this.sendResponse(res, 200, true, result, "Datos obtenidos correctamente");
    } catch (error: any) {
      console.error("Error en seeListPrice:", error.message);
      return this.sendResponse(res, 500, false, null, "Error al obtener la lista de precios", [error.message]);
    }
  };

  /**
   * Controlador para actualizar precios en listas existentes.
   * 
   * Maneja la petición HTTP POST para actualizar costos unitarios y descuentos
   * de items específicos en listas de precios. Permite actualizaciones parciales,
   * actualizando solo los campos proporcionados.
   * 
   * @async
   * @public
   * @param {Request} req - Objeto de petición de Express
   * @param {Object} req.body - Cuerpo de la petición
   * @param {Array} req.body.data - Array de items a actualizar
   * @param {number} req.body.data[].id - ID del registro a actualizar
   * @param {number} [req.body.data[].costo_unitario] - Nuevo costo unitario (opcional)
   * @param {number} [req.body.data[].descuento1] - Nuevo descuento 1 (opcional)
   * @param {number} [req.body.data[].descuento2] - Nuevo descuento 2 (opcional)
   * @param {Response} res - Objeto de respuesta de Express
   * 
   * @returns {Promise<Response>} Respuesta HTTP con el resultado de la actualización
   * 
   * @example
   * // Request body:
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "costo_unitario": 150.00,
   *       "descuento1": 12
   *     },
   *     {
   *       "id": 2,
   *       "descuento2": 8
   *     }
   *   ]
   * }
   * 
   * // Response 200:
   * {
   *   "success": true,
   *   "data": {
   *     "updatedCount": 2,
   *     "updatedItems": [...],
   *     "message": "2 registros actualizados correctamente"
   *   },
   *   "message": "Lista de precios actualizada correctamente",
   *   "errors": []
   * }
   */
  public updatePrice = async (req: Request, res: Response) => {
    if (!req.body?.data || !Array.isArray(req.body.data)) {
      return this.sendResponse(res, 400, false, null, "Datos inválidos", ["Se requiere un arreglo de datos"]);
    }

    try {

      const result = await this.updateListsFinish.updateListsPrecios(req.body.data);


      return this.sendResponse(res, 200, true, result, "Lista de precios actualizada correctamente");
    } catch (error: any) {
      console.error("Error en updatePrice:", error.message);
      return this.sendResponse(res, 500, false, null, "Error actualizando lista de precios", [error.message]);
    }
  };

  /**
   * Controlador para gestionar la vigencia temporal de listas de precios.
   * 
   * Maneja la petición HTTP POST para insertar o actualizar las fechas de
   * inicio y fin de vigencia de una lista de precios. Utiliza operación UPSERT
   * para actualizar si ya existe una validez para el proveedor.
   * 
   * @async
   * @public
   * @param {Request} req - Objeto de petición de Express
   * @param {Object} req.body - Cuerpo de la petición
   * @param {Array} req.body.data - Array de validaciones de fecha
   * @param {number} req.body.data[].id - ID de la validez
   * @param {string} req.body.data[].fecha_inicio - Fecha de inicio (formato ISO 8601)
   * @param {string} req.body.data[].fecha_fin - Fecha de fin (formato ISO 8601)
   * @param {Object} req.user - Usuario autenticado (añadido por authMiddleware)
   * @param {number} req.user.id - ID del proveedor autenticado
   * @param {Response} res - Objeto de respuesta de Express
   * 
   * @returns {Promise<Response>} Respuesta HTTP con el resultado de la operación
   * 
   * @example
   * // Request body:
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "fecha_inicio": "2024-01-01",
   *       "fecha_fin": "2024-12-31"
   *     }
   *   ]
   * }
   * 
   * // Response 200:
   * {
   *   "success": true,
   *   "data": [
   *     {
   *       "id": 1,
   *       "id_proveedor": 100,
   *       "fecha_inicio": "2024-01-01",
   *       "fecha_fin": "2024-12-31"
   *     }
   *   ],
   *   "message": "Validez de fechas actualizada correctamente",
   *   "errors": []
   * }
   */
  public dateValidity = async (req: Request, res: Response) => {
    if (!req.body?.data || !Array.isArray(req.body.data)) {
      return this.sendResponse(res, 400, false, null, "Datos inválidos", ["Se requiere un arreglo de datos"]);
    }
    const proveedor = (req as any).user?.id;

    try {


      const dataWithProveedor = req.body.data.map((item: any) => ({
        ...item,
        idProveedor: proveedor,
      }));
      const result = await this.dateValidityUsecase.updateValidityDate(dataWithProveedor);
      return this.sendResponse(res, 200, true, result, "Validez de fechas actualizada correctamente");
    } catch (error: any) {
      console.error("Error en dateValidity:", error.message);
      return this.sendResponse(res, 500, false, null, "Error actualizando validez de fechas", [error.message]);
    }
  };






  /**
   * Controlador para obtener plantilla de precios desde SAP.
   * 
   * Maneja la petición HTTP GET para obtener información base de productos
   * desde el sistema SAP del proveedor autenticado. Esta plantilla sirve como
   * base para crear o actualizar listas de precios, incluyendo códigos de
   * material, descripciones y precios efectivos.
   * 
   * @async
   * @public
   * @param {Request} req - Objeto de petición de Express
   * @param {Object} req.user - Usuario autenticado (añadido por authMiddleware)
   * @param {number} req.user.id - ID del proveedor autenticado
   * @param {Response} res - Objeto de respuesta de Express
   * 
   * @returns {Promise<Response>} Respuesta HTTP con la plantilla de precios desde SAP
   * 
   * @example
   * // Response 200:
   * {
   *   "success": true,
   *   "data": [
   *     {
   *       "bk_material": "12345",
   *       "des_material": "Producto X",
   *       "atr_precio_efectiv": 120.00
   *     },
   *     {
   *       "bk_material": "67890",
   *       "des_material": "Producto Y",
   *       "atr_precio_efectiv": 200.00
   *     }
   *   ],
   *   "message": "Datos obtenidos correctamente",
   *   "errors": []
   * }
   */
  public getPricingtemplate = async (req: Request, res: Response) => {
    try {

      const proveedor = (req as any).user?.id;

      if (!proveedor) {
        return this.sendResponse(res, 400, false, null, "Proveedor no especificado");
      }

      const result = await this.pricingtemplate.getPricingTemplate(proveedor);
      return this.sendResponse(res, 200, true, result, "Datos obtenidos correctamente");
    } catch (error: any) {
      console.error("Error en getPricingtemplate:", error.message);
      return this.sendResponse(res, 500, false, null, "Error al obtener la plantilla de precios", [error.message]);
    }
  };
}
