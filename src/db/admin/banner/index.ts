import { AdminBannerDB } from "./utils";
import {
  AdminBannerCreateRequest,
  AdminBannerDeleteRequest,
  AdminBannerEditRequest,
  AdminBannerGetRequest,
  AdminBannerListRequest,
} from "@/types/request/admin/banner";
import { ApiResponse } from "@/types/response";

export class AdminBannerDAO {
  private banner: AdminBannerDB;

  constructor() {
    this.banner = new AdminBannerDB();
  }
  create = async (
    body: AdminBannerCreateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.banner.insert(body);
    return result;
  };

  edit = async (body: AdminBannerEditRequest): Promise<ApiResponse<any>> => {
    const result = await this.banner.edit(body);
    return result;
  };

  get = async (body: AdminBannerGetRequest): Promise<any> => {
    const adminBannerData = await this.banner.get(body);
    return adminBannerData;
  };

  list = async (body: AdminBannerListRequest): Promise<any[]> => {
    const adminBannerDataList = await this.banner.list(body);
    return adminBannerDataList;
  };

  delete = async (
    body: AdminBannerDeleteRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.banner.delete(body);
    return result;
  };
}
