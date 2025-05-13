import { PlatformDB } from "./query";
import { ApiPlatformResponse } from "@/types/response/platform";

export class PlatformDAO {
  private platform: PlatformDB;

  constructor() {
    this.platform = new PlatformDB();
  }

  list = async (): Promise<ApiPlatformResponse[]> => {
    const list = await this.platform.list();
    return list;
  };
}
