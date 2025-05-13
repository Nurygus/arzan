import { PageCategoryDB } from "./utils";
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

export class AdminPageCategoryDAO {
  private pageCategory: PageCategoryDB;

  constructor() {
    this.pageCategory = new PageCategoryDB();
  }

  create = async (
    body: AdminPageCategoryCreateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.pageCategory.insert(body);
    return result;
  };

  edit = async (
    body: AdminPageCategoryEditRequest,
  ): Promise<ApiResponse<any>> => {
    const result = await this.pageCategory.edit(body);
    return result;
  };

  get = async (body: AdminPageCategoryGetRequest): Promise<any> => {
    const result = await this.pageCategory.get(body);
    return result;
  };

  delete = async (
    body: AdminPageCategoryDeleteRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.pageCategory.delete(body);
    return result;
  };

  list = async (body: AdminPageCategoryListRequest): Promise<any[]> => {
    const result = await this.pageCategory.list(body);
    return result;
  };

  listPage = async (body: AdminPageListRequest): Promise<any[]> => {
    const result = await this.pageCategory.listPage(body);
    return result;
  };

  listCategory = async (body: AdminCategoryListRequest): Promise<any[]> => {
    const result = await this.pageCategory.listCategory(body);
    return result;
  };
}
