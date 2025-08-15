// src/usecases/SeePriceLists.ts
import RepositoryListaPrecios from "../repositories/repositoryPriceList";

export default class SeePriceLists {
  private repository: RepositoryListaPrecios;

  constructor() {
    this.repository = new RepositoryListaPrecios();
  }

  /**
   * Obtiene la lista de precios filtrada opcionalmente por proveedor.
   * @param proveedorFilter Código del proveedor (opcional)
   */
  public async getCombinedPrices(proveedorFilter?: string) {
    try {
      return await this.repository.getPrices(proveedorFilter);
    } catch (error) {
      console.error("Error en getCombinedPrices:", error);
      throw error;
    }
  }
}
