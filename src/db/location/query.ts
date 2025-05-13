import pg from "@/config/db";
import { ApiLocationResponse } from "@/types/response/location";

export class LocationDB {
  async list(): Promise<ApiLocationResponse[]> {
    const { rows: list } = await pg.query(
      "SELECT id, display_name as name FROM tb_location",
    );

    return list;
  }
}
