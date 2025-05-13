import { AdminUserDAO } from "@/db/admin/user";
import {
  AdminUserListRequest,
  AdminUserRequest,
} from "@/types/request/admin/user";
import { ApiResponse } from "@/types/response";
import { AdminUserResponse } from "@/types/response/admin/user";

export class AdminUserServices {
  userDAO: AdminUserDAO;
  constructor() {
    this.userDAO = new AdminUserDAO();
  }

  post = async (
    body: AdminUserRequest,
    image: string | undefined,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.userDAO.post(body, image);

    return result;
  };

  list = async (
    query: AdminUserListRequest,
  ): Promise<
    ApiResponse<{ total_count: number; users: AdminUserResponse[] }>
  > => {
    const result = await this.userDAO.list(query);

    return result;
  };

  //   get = async (id: string): Promise<AdminCategoryResponse> => {
  //     const result = await this.categoryDAO.get(id);

  //     return result;
  //   };

  //   delete = async (id: string): Promise<ApiResponse<undefined>> => {
  //     const result = await this.categoryDAO.delete(id);

  //     return result;
  //   };
}
