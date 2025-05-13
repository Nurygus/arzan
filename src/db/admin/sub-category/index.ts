import { SubCategoryDB } from "./query";
import {
  AdminSubCategoryListRequest,
  AdminSubCategoryRequest,
} from "@/types/request/admin/sub-category";
import { ApiResponse } from "@/types/response";
import { AdminSubCategoryResponse } from "@/types/response/admin/sub-category";

export class SubCategoryDAO {
  private subCategory: SubCategoryDB;

  constructor() {
    this.subCategory = new SubCategoryDB();
  }

  post = async (
    body: AdminSubCategoryRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.subCategory.insert(body);
    return result;
  };

  list = async (
    query: AdminSubCategoryListRequest,
  ): Promise<ApiResponse<AdminSubCategoryResponse[]>> => {
    const result = await this.subCategory.list(query);
    return result;
  };

  get = async (id: string): Promise<ApiResponse<AdminSubCategoryResponse>> => {
    const result = await this.subCategory.get(id);
    return result;
  };

  delete = async (id: string): Promise<ApiResponse<undefined>> => {
    const result = await this.subCategory.delete(id);
    return result;
  };
}
