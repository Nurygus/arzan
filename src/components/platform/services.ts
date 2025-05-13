import { PlatformDAO } from "@/db/platform";
import { ApiPlatformResponse } from "@/types/response/platform";

export class ApiPlatformServices {
  platformDAO: PlatformDAO;
  constructor() {
    this.platformDAO = new PlatformDAO();
  }

  list = async (): Promise<ApiPlatformResponse[]> => {
    const result = await this.platformDAO.list();

    return result;
  };
}
