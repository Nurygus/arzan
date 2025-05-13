import AppInformation from "@/types/response/AppInformation";
import { HomeDAO } from "@/db/home";
import { getAppInfoQuery } from "@/types/request/home";

export class HomeServices {
  homeDAO!: HomeDAO;
  constructor() {
    this.homeDAO = new HomeDAO();
  }

  getAppInfo = async (
    appInfoKey?: getAppInfoQuery,
  ): Promise<AppInformation> => {
    const result = await this.homeDAO.get(appInfoKey);

    return result;
  };
}
