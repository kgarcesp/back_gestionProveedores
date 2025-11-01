import pool from "../../../config/database";
import { PriceListItem, UpdatePriceListItem, SupplierPriceRow } from "../../../shared/types/priceList";
import { DateValidity } from "../domain/dateValidity";

/**
 * Repositorio para gestionar operaciones de persistencia de listas de precios.
 * 
 * Esta clase maneja todas las operaciones de base de datos relacionadas con
 * listas de precios de proveedores, incluyendo inserción, actualización,
 * consultas y validación de fechas de vigencia.
 * 
 * @class RepositoryListPrecios
 * @module PriceList/Repositories
 */
export default class RepositoryListPrecios {

  /**
   * Inserta nuevas listas de precios en el sistema.
   * 
   * Realiza la inserción de múltiples items de listas de precios en una
   * transacción, asegurando que todos los registros se inserten correctamente
   * o se revierta la operación completa en caso de error.
   * 
   * @async
   * @public
   * @param {PriceListItem[]} data - Array de items de lista de precios a insertar
   * @returns {Promise<SupplierPriceRow[]>} Array de registros insertados con sus IDs asignados
   * 
   * @throws {Error} Si los datos no son un array
   * @throws {Error} Si ocurre un error durante la inserción
   * 
   * @example
   * const repository = new RepositoryListPrecios();
   * const insertados = await repository.insertarListPrecios([
   *   {
   *     COD_PROV: '12345',
   *     COD_SAP: 'SAP001',
   *     COSTO_UNIT: 100.50,
   *     DESC1: 10,
   *     DESC2: 5,
   *     PROVEEDOR: 1
   *   }
   * ]);
   */
  public async insertarListPrecios(data: PriceListItem[]): Promise<SupplierPriceRow[]> {
    if (!Array.isArray(data)) {
      throw new Error("Los datos deben ser un array");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const insertedItems: SupplierPriceRow[] = [];

      for (const item of data) {
        const query = {
          text: `
            INSERT INTO supplier_price_list (
              cod_prov, cod_sap, costo_unitario, descuento1, descuento2, proveedor_id
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
          `,
          values: [
            item.COD_PROV,
            item.COD_SAP,
            parseFloat(String(item.COSTO_UNIT)),
            parseFloat(String(item.DESC1)),
            parseFloat(String(item.DESC2)),
            item.PROVEEDOR,
          ],
        };

        const result = await client.query(query);
        insertedItems.push(result.rows[0]);
      }

      await client.query("COMMIT");
      return insertedItems;
    } catch (error: any) {
      await client.query("ROLLBACK");
      throw new Error(`Error al insertar lista de precios: ${error.message}`);
    } finally {
      client.release();
    }
  }

  /**
   * Obtiene listas de precios combinadas con información de SAP.
   * 
   * Realiza una consulta que combina datos de las listas de precios locales
   * con información adicional del sistema SAP, incluyendo descripciones,
   * precios efectivos, tipos de impuestos y fechas de actualización.
   * 
   * @async
   * @public
   * @param {string} [proveedor] - Código del proveedor para filtrar (opcional)
   * @returns {Promise<SupplierPriceRow[]>} Array de registros con información completa
   * 
   * @throws {Error} Si ocurre un error durante la consulta
   * 
   * @example
   * const repository = new RepositoryListPrecios();
   * 
   * // Obtener todas las listas
   * const todas = await repository.getPrices();
   * 
   * // Obtener listas de un proveedor específico
   * const proveedor = await repository.getPrices('100');
   */
  public async getPrices(proveedor?: string): Promise<SupplierPriceRow[]> {

    const client = await pool.connect();
    try {
      let baseQuery = `SELECT DISTINCT
          sp.id,
          sp.cod_prov,
          sp.cod_sap,
          pd.des_material as descripcion,
          sp.costo_unitario,
          CASE 
              WHEN sp.descuento1 = TRUNC(sp.descuento1) THEN sp.descuento1::integer
              ELSE sp.descuento1
          END AS descuento1,
          CASE 
              WHEN sp.descuento2 = TRUNC(sp.descuento2) THEN sp.descuento2::integer
              ELSE sp.descuento2
          END AS descuento2,
          pd.bk_proveedor as proveedor_id,
          sp.fecha_actualizacion as fecha_actualizacion_precio,
          pd.tax_1 as tipo_impuesto,
          pd.atr_precio_efectiv as precio_bruto,
          pd.atr_precio_efectiv as precio_neto,
          sp.fecha_actualizacion as fecha_actualizacion_proveedor
      FROM supplier_price_list sp
      LEFT JOIN postgre_sap.stg_consulta_costo pd 
        ON sp.cod_prov = pd.bk_material
      WHERE  pd.bk_centro = '1001' 
    `;

      if (proveedor) {
        baseQuery += ` AND pd.bk_proveedor = $1`;
      }

      baseQuery += ` ORDER BY sp.fecha_actualizacion DESC`;

      const result = await client.query(baseQuery, proveedor ? [proveedor] : []);
      return result.rows;
    } catch (error: any) {
      throw new Error(`Error al obtener lista de precios: ${error.message}`);
    } finally {
      client.release();
    }
  }



  /**
   * Obtiene plantilla de precios desde SAP para crear listas.
   * 
   * Recupera información base de productos desde el sistema SAP, incluyendo
   * códigos de material, descripciones y precios efectivos. Esta información
   * sirve como plantilla para crear o actualizar listas de precios.
   * 
   * @async
   * @public
   * @param {string} [proveedor] - Código del proveedor para filtrar (opcional)
   * @returns {Promise<SupplierPriceRow[]>} Array con información de productos desde SAP
   * 
   * @throws {Error} Si ocurre un error durante la consulta
   * 
   * @example
   * const repository = new RepositoryListPrecios();
   * 
   * // Obtener plantilla completa
   * const plantilla = await repository.getPricingTemplate();
   * 
   * // Obtener plantilla de un proveedor
   * const plantillaProveedor = await repository.getPricingTemplate('100');
   */
  public async getPricingTemplate(proveedor?: string): Promise<SupplierPriceRow[]> {
  const client = await pool.connect();
  try {
    // Consulta base con alias 'sc'
    let baseQuery = `
      SELECT sc.bk_material,
             sc.des_material,
             sc.atr_precio_efectiv
      FROM postgre_sap.stg_consulta_costo sc
      WHERE sc.bk_centro = '1001'
    `;

    // Si llega el proveedor, se agrega al WHERE
    if (proveedor) {
      baseQuery += ` AND sc.bk_proveedor = $1`;
    }

    // Ejecutar consulta con o sin parámetro
    const result = await client.query(baseQuery, proveedor ? [proveedor] : []);

    return result.rows as SupplierPriceRow[];
  } catch (error: any) {
    throw new Error(`Error al obtener lista de precios: ${error.message}`);
  } finally {
    client.release();
  }
}


  /**
   * Inserta o actualiza fechas de validez de listas de precios.
   * 
   * Utiliza operación UPSERT (INSERT ... ON CONFLICT) para insertar nuevas
   * validaciones de fecha o actualizar las existentes basándose en el
   * id_proveedor. Esto asegura que cada proveedor tenga una única validez activa.
   * 
   * @async
   * @public
   * @param {DateValidity[]} data - Array de validaciones de fecha a procesar
   * @returns {Promise<DateValidity[]>} Array de validaciones insertadas/actualizadas
   * 
   * @throws {Error} Si ocurre un error durante la operación
   * 
   * @example
   * const repository = new RepositoryListPrecios();
   * const validaciones = await repository.dateValidity([
   *   {
   *     id: 1,
   *     idProveedor: 100,
   *     fecha_inicio: '2024-01-01',
   *     fecha_fin: '2024-12-31'
   *   }
   * ]);
   */
  public async dateValidity(data: DateValidity[]): Promise<DateValidity[]> {
    const client = await pool.connect();
    try {
      const upserted: DateValidity[] = [];

      for (const item of data) {
        const result = await client.query(
          `
        INSERT INTO date_validity (id_proveedor, fecha_inicio, fecha_fin)
        VALUES ($1, $2, $3)
        ON CONFLICT (id_proveedor)
        DO UPDATE SET fecha_inicio = EXCLUDED.fecha_inicio,
                      fecha_fin = EXCLUDED.fecha_fin
        RETURNING id, id_proveedor, fecha_inicio, fecha_fin
        `,
          [item.idProveedor, item.fecha_inicio, item.fecha_fin]
        );

        if (result.rows[0]) {
          upserted.push(result.rows[0]);
        }
      }

      return upserted;
    } catch (error: any) {
      throw new Error(`Error en dateValidity: ${error.message}`);
    } finally {
      client.release();
    }
  }




  /**
   * Actualiza precios en listas existentes.
   * 
   * Actualiza selectivamente costos unitarios y descuentos de items en listas
   * de precios. Solo actualiza registros donde los valores son diferentes a los
   * existentes, evitando actualizaciones innecesarias. La operación se realiza
   * en una transacción para garantizar consistencia.
   * 
   * @async
   * @public
   * @param {UpdatePriceListItem[]} data - Array de items a actualizar
   * @param {number} data[].id - ID del registro a actualizar
   * @param {number} data[].costo_unitario - Nuevo costo unitario
   * @param {number} data[].descuento1 - Nuevo primer descuento
   * @param {number} data[].descuento2 - Nuevo segundo descuento
   * 
   * @returns {Promise<Object>} Resultado de la operación
   * @returns {number} return.updatedCount - Cantidad de registros actualizados
   * @returns {SupplierPriceRow[]} return.updatedItems - Array de registros actualizados
   * @returns {string} return.message - Mensaje descriptivo del resultado
   * 
   * @throws {Error} Si los datos no son un array
   * @throws {Error} Si ocurre un error durante la actualización
   * 
   * @example
   * const repository = new RepositoryListPrecios();
   * const resultado = await repository.updateListPrice([
   *   {
   *     id: 1,
   *     costo_unitario: 150.00,
   *     descuento1: 10,
   *     descuento2: 5
   *   }
   * ]);
   * console.log(resultado.message);
   * // "1 registros actualizados correctamente"
   */
  public async updateListPrice(data: UpdatePriceListItem[]): Promise<{
    updatedCount: number;
    updatedItems: SupplierPriceRow[];
    message: string;
  }> {
    if (!Array.isArray(data)) {
      throw new Error("Los datos deben ser un array");
    }

    if (data.length === 0) {
      return { updatedCount: 0, updatedItems: [], message: "No se proporcionaron datos para actualizar" };
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      let updatedCount = 0;
      const updatedItems: SupplierPriceRow[] = [];

      for (const item of data) {
        const query = {
          text: `
            UPDATE supplier_price_list 
            SET 
              costo_unitario = $1,
              descuento1 = $2,
              descuento2 = $3,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
              AND (
                costo_unitario IS DISTINCT FROM $1 OR
                descuento1 IS DISTINCT FROM $2 OR
                descuento2 IS DISTINCT FROM $3
              )
            RETURNING id, cod_prov, cod_sap, costo_unitario, descuento1, descuento2, proveedor_id
          `,
          values: [
            parseFloat(String(item.costo_unitario)),
            parseFloat(String(item.descuento1)),
            parseFloat(String(item.descuento2)),
            item.id,
          ],
        };

        const result = await client.query(query);
        if (result.rows.length > 0) {
          updatedCount++;
          updatedItems.push(result.rows[0]);
        }
      }

      await client.query("COMMIT");

      return {
        updatedCount,
        updatedItems,
        message:
          updatedCount === 0
            ? "No se modificaron registros (los valores eran iguales)"
            : `${updatedCount} registros actualizados correctamente`,
      };
    } catch (error: any) {
      await client.query("ROLLBACK");
      throw new Error(`Error al actualizar lista de precios: ${error.message}`);
    } finally {
      client.release();
    }
  }
}
