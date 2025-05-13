import { CategoryDAO } from "@/db/category";
import { ApiResponse } from "@/types/response";
import { ApiCategoryResponse } from "@/types/response/category";

export class CategoryServices {
  categoryDAO: CategoryDAO;
  constructor() {
    this.categoryDAO = new CategoryDAO();
  }

  list = async (): Promise<ApiResponse<ApiCategoryResponse[]>> => {
    const result = await this.categoryDAO.list();

    return result;
  };

  //   get = async (id: string): Promise<AdminCategoryResponse> => {
  //     const result = await this.categoryDAO.get(id);

  //     return result;
  //   };
}
