import { PageCategoryDB } from "./utils";
import {
  UserPageCategoryGetRequest,
  UserPageCategoryListRequest,
} from "@/types/request/page-category";

export class UserPageCategoryDAO {
  private pageCategory: PageCategoryDB;

  constructor() {
    this.pageCategory = new PageCategoryDB();
  }

  get = async (body: UserPageCategoryGetRequest): Promise<any> => {
    const result = await this.pageCategory.get(body);
    return result;
  };

  list = async (body: UserPageCategoryListRequest): Promise<any[]> => {
    const result = await this.pageCategory.list(body);
    return result;
  };
}
