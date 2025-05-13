import { UserPageCategoryDAO } from "@/db/page-category";
import {
  UserPageCategoryGetRequest,
  UserPageCategoryListRequest,
} from "@/types/request/page-category";

export class UserPageCategoryServices {
  userPageCategoryDAO: UserPageCategoryDAO;
  constructor() {
    this.userPageCategoryDAO = new UserPageCategoryDAO();
  }

  get = async (body: UserPageCategoryGetRequest): Promise<any> => {
    const result = await this.userPageCategoryDAO.get(body);
    return result;
  };

  list = async (body: UserPageCategoryListRequest): Promise<any[]> => {
    const result = await this.userPageCategoryDAO.list(body);
    return result;
  };
}
