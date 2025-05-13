import { CategoryDB } from "./query";
import { ApiResponse } from "@/types/response";
import { ApiCategoryResponse } from "@/types/response/category";

export class CategoryDAO {
  private category: CategoryDB;

  constructor() {
    this.category = new CategoryDB();
  }

  list = async (): Promise<ApiResponse<ApiCategoryResponse[]>> => {
    const list = await this.category.list();
    return list;
  };
}
