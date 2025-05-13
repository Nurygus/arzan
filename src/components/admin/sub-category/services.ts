import { SubCategoryDAO } from "@/db/admin/sub-category";
import {
  AdminSubCategoryListRequest,
  AdminSubCategoryRequest,
} from "@/types/request/admin/sub-category";
import { ApiResponse } from "@/types/response";
import { AdminSubCategoryResponse } from "@/types/response/admin/sub-category";

export class AdminSubCategoryServices {
  subCategoryDAO: SubCategoryDAO;
  constructor() {
    this.subCategoryDAO = new SubCategoryDAO();
  }

  post = async (
    body: AdminSubCategoryRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.subCategoryDAO.post(body);

    return result;
  };

  list = async (
    query: AdminSubCategoryListRequest,
  ): Promise<ApiResponse<AdminSubCategoryResponse[]>> => {
    const result = await this.subCategoryDAO.list(query);

    return result;
  };

  get = async (id: string): Promise<ApiResponse<AdminSubCategoryResponse>> => {
    const result = await this.subCategoryDAO.get(id);

    return result;
  };

  delete = async (id: string): Promise<ApiResponse<undefined>> => {
    const result = await this.subCategoryDAO.delete(id);

    return result;
  };
}
