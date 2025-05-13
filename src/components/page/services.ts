import { PageDAO } from "@/db/page";
import { ApiPageResponse } from "@/types/response/page";

export class ApiPageServices {
  pageDAO: PageDAO;
  constructor() {
    this.pageDAO = new PageDAO();
  }

  list = async (): Promise<ApiPageResponse[]> => {
    const result = await this.pageDAO.list();

    return result;
  };
}
