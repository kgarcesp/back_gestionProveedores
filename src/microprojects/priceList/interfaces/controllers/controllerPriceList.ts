import { Request, Response } from "express";
import GetListaPrecios from "../../usecases/getPriceList";
import SeePriceLists from "../../usecases/seePriceLists";
import UpdateLists from "../../usecases/updateLists";
import DateValidityUsecase from "../../usecases/dateValidityUpdate";

export default class ControllerListaPrecios {
  
  // Casos de uso que encapsulan la lógica de negocio
  private registeListPrecios = new GetListaPrecios();
  private priceLists = new SeePriceLists();
  private updateListsFinish = new UpdateLists();
  private dateValidityUsecase = new DateValidityUsecase();

  /**
   * Método centralizado para enviar respuestas HTTP con un formato consistente.
   * 
   * @param res     Objeto de respuesta de Express
   * @param status  Código de estado HTTP
   * @param success Indica si la operación fue exitosa
   * @param data    Datos a devolver en la respuesta
   * @param message Mensaje descriptivo del resultado
   * @param errors  Lista de errores (opcional)
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
   * Inserta una nueva lista de precios.
   * 
   * - Valida que los datos recibidos sean un arreglo.
   * - Llama al caso de uso `GetListaPrecios` para registrar los precios.
   * - Devuelve un mensaje de éxito o error.
   */

public insertListPrecios = async (req: Request, res: Response) => {
  const proveedor = (req as any).user?.role;

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
   * Obtiene listas de precios existentes.
   * 
   * - Permite filtrar por proveedor mediante el query param `proveedor`.
   * - Llama al caso de uso `SeePriceLists` para recuperar los datos.
   * - Devuelve las listas obtenidas o un error si ocurre un fallo.
   */
public seeListPrice = async (req: Request, res: Response) => {
  try {
    // tomamos como id de proveedor aquel que esta logeado
    const proveedor = (req as any).user?.role;

    if (!proveedor) {
      return this.sendResponse(res, 400, false, null, "Proveedor no especificado");
    }

    const result = await this.priceLists.getCombinedPrices(proveedor);
    return this.sendResponse(res, 200, true, result, "Datos obtenidos correctamente");
  } catch (error: any) {
    console.error("Error en seeListPrice:", error);
    return this.sendResponse(res, 500, false, null, "Error al obtener la lista de precios", [error.message]);
  }
};

  /**
   * Actualiza precios existentes.
   * 
   * - Valida que los datos recibidos sean un arreglo.
   * - Llama al caso de uso `UpdateLists` para ejecutar la actualización.
   * - Devuelve un mensaje de confirmación o error.
   */
  public updatePrice = async (req: Request, res: Response) => {
    if (!req.body?.data || !Array.isArray(req.body.data)) {
      return this.sendResponse(res, 400, false, null, "Datos inválidos", ["Se requiere un arreglo de datos"]);
    }

    try {
      
      const result = await this.updateListsFinish.updateListsPrecios(req.body.data);

      
      return this.sendResponse(res, 200, true, result, "Lista de precios actualizada correctamente");
    } catch (error: any) {
      console.error("Error en updatePrice:", error);
      return this.sendResponse(res, 500, false, null, "Error actualizando lista de precios", [error.message]);
    }
  };

  /**
   * Inserta o actualiza la vigencia de listas de precios (fecha de inicio y fin).
   * 
   * - Valida que los datos recibidos sean un arreglo.
   * - Llama al caso de uso `DateValidityUsecase` para aplicar la lógica de inserción/actualización.
   * - Devuelve el resultado de la operación o un error.
   */
  public dateValidity = async (req: Request, res: Response) => {
    if (!req.body?.data || !Array.isArray(req.body.data)) {      
      return this.sendResponse(res, 400, false, null, "Datos inválidos", ["Se requiere un arreglo de datos"]);
    }
    const proveedor = (req as any).user?.role;
    
    try {


      const dataWithProveedor = req.body.data.map((item: any) => ({
        ...item,
        idProveedor: proveedor,
      }));
      const result = await this.dateValidityUsecase.updateValidityDate(dataWithProveedor);
      return this.sendResponse(res, 200, true, result, "Validez de fechas actualizada correctamente");
    } catch (error: any) {
      console.error("Error en dateValidity:", error);
      return this.sendResponse(res, 500, false, null, "Error actualizando validez de fechas", [error.message]);
    }
  };
}
