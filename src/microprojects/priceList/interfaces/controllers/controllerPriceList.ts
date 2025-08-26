import { Request, Response } from "express";
import GetListaPrecios from "../../usecases/getPriceList";
import SeePriceLists from "../../usecases/seePriceLists";
import UpdateLists from "../../usecases/updateLists";

export default class ControllerListaPrecios {
  
  // Casos de uso que encapsulan la lógica de negocio
  private registeListPrecios = new GetListaPrecios();
  private priceLists = new SeePriceLists();
  private updateListsFinish = new UpdateLists();

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
   * Inserta una nueva lista de precios en el sistema.
   * 
   * - Valida que la estructura de datos recibida sea un arreglo.
   * - Llama al caso de uso `GetListaPrecios` para procesar la inserción.
   * - Devuelve un mensaje de éxito o error según corresponda.
   */
  public insertListPrecios = async (req: Request, res: Response) => {
    if (!req.body?.data || !Array.isArray(req.body.data)) {
       return this.sendResponse(res, 400, false, null, "Datos inválidos", ["Se requiere un arreglo de datos"]);
    }

    try {
      const result = await this.registeListPrecios.newListPrecios(req.body.data);
      return this.sendResponse(
        res,
        200,
        true,
        result,
        "Lista de precios procesada correctamente"
      );
    } catch (error: any) {
      console.error("Error en insertListPrecios:", error);
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
   * Obtiene la lista de precios existente.
   * 
   * - Permite filtrar por proveedor mediante el parámetro de consulta `proveedor`.
   * - Llama al caso de uso `SeePriceLists` para obtener los datos combinados.
   * - Devuelve los datos obtenidos o un error si falla la consulta.
   */
  public seeListPrice = async (req: Request, res: Response) => {
    
    try {
      const { proveedor } = req.query;
      const result = await this.priceLists.getCombinedPrices(proveedor as string);
      return this.sendResponse(res, 200, true, result, "Datos obtenidos correctamente");
    } catch (error: any) {
      console.error("Error en seeListPrice:", error);
      return this.sendResponse(
        res,
        500,
        false,
        null,
        "Error al obtener la lista de precios",
        [error.message]
      );
    }
  };

  /**
   * Actualiza una lista de precios existente.
   * 
   * - Valida que la estructura de datos recibida sea un arreglo.
   * - Llama al caso de uso `UpdateLists` para realizar la actualización.
   * - Devuelve un mensaje de éxito o error según corresponda.
   */
    public updatePrice = async (req: Request, res: Response) => {
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
    } catch (error: any) {
      console.error("Error en updatePrice:", error);
      return res.status(500).json({
        success: false,
        message: "Error actualizando lista de precios",
        errors: [error.message],
      });
    }
  };


public  dateValidity = async (req: Request, res: Response) => {
      
    try {
      const { fechaI, fechaF } = req.query;
      const result = await this.priceLists.getCombinedPrices(fechaI as );
      return this.sendResponse(res, 200, true, result, "Datos obtenidos correctamente");
    } catch (error: any) {
      console.error("Error en seeListPrice:", error);
      return this.sendResponse(
        res,
        500,
        false,
        null,
        "Error al obtener la lista de precios",
        [error.message]
      );
    }
}
}

