import { PageDB } from "./query";
import { ApiPageResponse } from "@/types/response/page";

export class PageDAO {
  private page: PageDB;

  constructor() {
    this.page = new PageDB();
  }

  list = async (): Promise<ApiPageResponse[]> => {
    const list = await this.page.list();
    return list;
  };
}
