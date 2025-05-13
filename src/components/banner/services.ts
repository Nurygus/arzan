import { BannerDAO } from "@/db/banner";
import {
  UserBannerGetRequest,
  UserBannerListRequest,
} from "@/types/request/banner";
import { ApiLocationResponse } from "@/types/response/location";

export class BannerServices {
  bannerDAO: BannerDAO;
  constructor() {
    this.bannerDAO = new BannerDAO();
  }

  list = async (
    body: UserBannerListRequest,
  ): Promise<ApiLocationResponse[]> => {
    const result = await this.bannerDAO.list(body);
    return result;
  };

  get = async (body: UserBannerGetRequest): Promise<any> => {
    const result = await this.bannerDAO.get(body);
    return result;
  };
}
