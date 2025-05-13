import { AdminPageCategoryDAO } from "@/db/admin/page-category";
import {
  AdminCategoryListRequest,
  AdminPageCategoryCreateRequest,
  AdminPageCategoryDeleteRequest,
  AdminPageCategoryEditRequest,
  AdminPageCategoryGetRequest,
  AdminPageCategoryListRequest,
  AdminPageListRequest,
} from "@/types/request/admin/page-category";

import { ApiResponse } from "@/types/response";

export class AdminPageCategoryServices {
  adminPageCategoryDAO: AdminPageCategoryDAO;
  constructor() {
    this.adminPageCategoryDAO = new AdminPageCategoryDAO();
  }

  create = async (
    body: AdminPageCategoryCreateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.adminPageCategoryDAO.create(body);
    return result;
  };

  edit = async (
    body: AdminPageCategoryEditRequest,
  ): Promise<ApiResponse<any>> => {
    const result = await this.adminPageCategoryDAO.edit(body);
    return result;
  };

  get = async (body: AdminPageCategoryGetRequest): Promise<any> => {
    const result = await this.adminPageCategoryDAO.get(body);
    return result;
  };

  delete = async (
    body: AdminPageCategoryDeleteRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.adminPageCategoryDAO.delete(body);
    return result;
  };

  list = async (body: AdminPageCategoryListRequest): Promise<any[]> => {
    const result = await this.adminPageCategoryDAO.list(body);
    return result;
  };

  listPage = async (body: AdminPageListRequest): Promise<any[]> => {
    const result = await this.adminPageCategoryDAO.listPage(body);
    return result;
  };

  listCategory = async (body: AdminCategoryListRequest): Promise<any[]> => {
    const result = await this.adminPageCategoryDAO.listCategory(body);
    return result;
  };
}
