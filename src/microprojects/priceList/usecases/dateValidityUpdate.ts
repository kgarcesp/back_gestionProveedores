import RepositoryListPrecios from "../repositories/repositoryPriceList";
import { DateValidity } from "../domain/dateValidity";

class DateValidityUsecase {
  private repository: RepositoryListPrecios;

  constructor() {
    this.repository = new RepositoryListPrecios();
  }

  async updateValidityDate(data: DateValidity[]): Promise<DateValidity[]> {
    return await this.repository.dateValidity(data);
  }
}

export default DateValidityUsecase;
