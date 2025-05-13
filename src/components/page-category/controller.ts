import { OK } from "http-status/lib";
import { UserPageCategoryServices } from "./services";
import {
  UserPageCategoryGetRequest,
  UserPageCategoryListRequest,
} from "@/types/request/page-category";
import { apiResponse } from "@/helpers/apiResponse";

export class UserPageCategoryController {
  static get = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const requestBody: UserPageCategoryGetRequest = { id: Number(id) };
      const videoCategoryServices = new UserPageCategoryServices();
      const result = await videoCategoryServices.get(requestBody);

      res.status(OK).json(
        apiResponse({
          message: "page category data",
          data: result,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };

  static list = async (req: Req, res: Res, next: NextFn) => {
    try {
      const query = req.query as UserPageCategoryListRequest;
      const videoCategoryServices = new UserPageCategoryServices();
      const result = await videoCategoryServices.list(query);

      res.status(OK).json(
        apiResponse({
          message: "page-category list",
          data: result,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };
}
