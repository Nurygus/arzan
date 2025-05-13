import { AdminBannerDAO } from "@/db/admin/banner";
import {
  AdminBannerCreateRequest,
  AdminBannerDeleteRequest,
  AdminBannerEditRequest,
  AdminBannerGetRequest,
  AdminBannerListRequest,
} from "@/types/request/admin/banner";
import { ApiResponse } from "@/types/response";

export class AdminBannerServices {
  adminBannerDAO: AdminBannerDAO;
  constructor() {
    this.adminBannerDAO = new AdminBannerDAO();
  }

  create = async (
    body: AdminBannerCreateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.adminBannerDAO.create(body);
    return result;
  };

  edit = async (body: AdminBannerEditRequest): Promise<ApiResponse<any>> => {
    const result = await this.adminBannerDAO.edit(body);
    return result;
  };

  get = async (body: AdminBannerGetRequest): Promise<any> => {
    const result = await this.adminBannerDAO.get(body);
    return result;
  };

  list = async (body: AdminBannerListRequest): Promise<any[]> => {
    const result = await this.adminBannerDAO.list(body);
    return result;
  };

  delete = async (
    body: AdminBannerDeleteRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.adminBannerDAO.delete(body);
    return result;
  };
}
