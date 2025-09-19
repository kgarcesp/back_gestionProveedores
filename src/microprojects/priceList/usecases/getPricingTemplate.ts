import RepositoryListaPrecios from "../repositories/repositoryPriceList";

export default class getPricingtemplate {
  private repository: RepositoryListaPrecios;

  constructor() {
    this.repository = new RepositoryListaPrecios();
  }

  /**
   * Obtiene la lista de precios filtrada opcionalmente por proveedor.
   * @param proveedorFilter Código del proveedor (opcional)
   */

  
  public async getPricingTemplate(proveedorFilter?: string) {
    try {
      return await this.repository.getPricingTemplate(proveedorFilter);
    } catch (error) {
      console.error( error);
      throw error;
    }
  }
}
