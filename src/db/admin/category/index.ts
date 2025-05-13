import { CategoryDB } from "./query";
import {
  AdminCategoryListRequest,
  AdminCategoryRequest,
} from "@/types/request/admin/category";
import { ApiResponse } from "@/types/response";
import { AdminCategoryResponse } from "@/types/response/admin/category";

export class CategoryDAO {
  private category: CategoryDB;

  constructor() {
    this.category = new CategoryDB();
  }

  post = async (
    body: AdminCategoryRequest,
    image: string,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.category.insert(body, image);
    return result;
  };

  list = async (
    query: AdminCategoryListRequest,
  ): Promise<AdminCategoryResponse[]> => {
    const result = await this.category.list(query);
    return result;
  };

  get = async (id: string): Promise<AdminCategoryResponse> => {
    const result = await this.category.get(id);
    return result;
  };

  delete = async (id: string): Promise<ApiResponse<undefined>> => {
    const result = await this.category.delete(id);
    return result;
  };
}
