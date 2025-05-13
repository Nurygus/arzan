import { UserDB } from "./query";
import {
  AdminUserListRequest,
  AdminUserRequest,
} from "@/types/request/admin/user";
import { ApiResponse } from "@/types/response";
import { AdminUserResponse } from "@/types/response/admin/user";

export class AdminUserDAO {
  private user: UserDB;

  constructor() {
    this.user = new UserDB();
  }

  post = async (
    body: AdminUserRequest,
    image: string | undefined,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.user.insert(body, image);
    return result;
  };

  list = async (
    query: AdminUserListRequest,
  ): Promise<
    ApiResponse<{ total_count: number; users: AdminUserResponse[] }>
  > => {
    const result = await this.user.list(query);
    return result;
  };

  //   get = async (id: string): Promise<ApiResponse<AdminSubCategoryResponse>> => {
  //     const result = await this.subCategory.get(id);
  //     return result;
  //   };

  //   delete = async (id: string): Promise<ApiResponse<undefined>> => {
  //     const result = await this.subCategory.delete(id);
  //     return result;
  //   };
}
