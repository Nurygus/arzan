import pg from "@/config/db";
import { ApiPageResponse } from "@/types/response/page";

export class PageDB {
  async list(): Promise<ApiPageResponse[]> {
    const { rows: list } = await pg.query("SELECT id, name FROM tb_page");

    return list;
  }
}
