import PriceListUpdate from "../domain/PriceListUpdate";
import RepositoryListPrecios from "../repositories/repositoryPriceList";

class UpdateLists {
  private repository: RepositoryListPrecios;

  constructor() {
    this.repository = new RepositoryListPrecios();
  }

async updateListsPrecios(data: any[]) {
  try {
    const entities = data.map(item => new PriceListUpdate(item));
    
    const adapted = entities.map(e => ({
      id: Number(e.COD_PROV), 
      costo_unitario: Number(e.NEW_COSTO_UNIT),
      descuento1: 0,
      descuento2: 0
    }));

    return await this.repository.updateListPrice(adapted);
  } catch (error) {
    console.error("Error en updateListsPrecios:", error);
    throw error;
  }
}

}

export default UpdateLists;
