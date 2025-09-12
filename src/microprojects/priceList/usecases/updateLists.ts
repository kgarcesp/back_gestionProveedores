// src/services/updateLists.ts
import RepositoryListPrecios from "../repositories/repositoryPriceList";

class UpdateLists {
  private repository: RepositoryListPrecios;

  constructor() {
    this.repository = new RepositoryListPrecios();
  }

  async updateListsPrecios(data: any[]) {
    try {
console.log(data);

      const adapted = data.map((item) => ({
        id: Number(item.id),
        ...(item.costo_unitario !== undefined && { costo_unitario: Number(item.costo_unitario) }),
        ...(item.descuento1 !== undefined && { descuento1: Number(item.descuento1) }),
        ...(item.descuento2 !== undefined && { descuento2: Number(item.descuento2) }),
      }));

      return await this.repository.updateListPrice(adapted);
    } catch (error) {
      console.error("Error en updateListsPrecios:", error);
      throw error;
    }
  }
}

export default UpdateLists;
