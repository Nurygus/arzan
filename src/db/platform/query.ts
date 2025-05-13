import pg from "@/config/db";
import { ApiPlatformResponse } from "@/types/response/platform";

export class PlatformDB {
  async list(): Promise<ApiPlatformResponse[]> {
    const { rows: list } = await pg.query("SELECT id, name FROM tb_platform");

    return list;
  }
}
