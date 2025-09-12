import pool from "../../../config/database";
import { PriceListItem, UpdatePriceListItem, SupplierPriceRow } from "../../../shared/types/priceList";
import { DateValidity } from "../domain/dateValidity";

export default class RepositoryListPrecios {
  
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

  public async getPrices(proveedor?: string): Promise<SupplierPriceRow[]> {

    const client = await pool.connect();
    try {
      let baseQuery = `
      SELECT DISTINCT
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
      LEFT JOIN postgre_stg.stg_consulta_costo pd 
        ON sp.cod_prov = pd.bk_material
      WHERE  pd.bk_centro = '1001'
    `;

      if (proveedor) {
        baseQuery += ` AND sp.proveedor_id = $1`;
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
