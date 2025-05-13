import { BannerDB } from "./query";
import {
  UserBannerGetRequest,
  UserBannerListRequest,
} from "@/types/request/banner";

export class BannerDAO {
  private banner: BannerDB;

  constructor() {
    this.banner = new BannerDB();
  }

  get = async (body: UserBannerGetRequest): Promise<any> => {
    const adminBannerData = await this.banner.get(body);
    return adminBannerData;
  };

  list = async (body: UserBannerListRequest): Promise<any[]> => {
    const adminBannerDataList = await this.banner.list(body);
    return adminBannerDataList;
  };
}
