import { CategoryDAO } from "@/db/admin/category";
import {
  AdminCategoryListRequest,
  AdminCategoryRequest,
} from "@/types/request/admin/category";
import { ApiResponse } from "@/types/response";
import { AdminCategoryResponse } from "@/types/response/admin/category";

export class CategoryServices {
  categoryDAO: CategoryDAO;
  constructor() {
    this.categoryDAO = new CategoryDAO();
  }

  post = async (
    body: AdminCategoryRequest,
    image: string,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.categoryDAO.post(body, image);

    return result;
  };

  list = async (
    query: AdminCategoryListRequest,
  ): Promise<AdminCategoryResponse[]> => {
    const result = await this.categoryDAO.list(query);

    return result;
  };

  get = async (id: string): Promise<AdminCategoryResponse> => {
    const result = await this.categoryDAO.get(id);

    return result;
  };

  delete = async (id: string): Promise<ApiResponse<undefined>> => {
    const result = await this.categoryDAO.delete(id);

    return result;
  };
}
