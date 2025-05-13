import { BAD_REQUEST, OK } from "http-status/lib";
import { AdminSubCategoryServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import {
  AdminSubCategoryListRequest,
  AdminSubCategoryRequest,
} from "@/types/request/admin/sub-category";

export class AdminSubCategoryController {
  static post = async (req: Req, res: Res, next: NextFn) => {
    try {
      const adminSubCategoryServices = new AdminSubCategoryServices();
      const body = req.body as AdminSubCategoryRequest;
      const result = await adminSubCategoryServices.post(body);
      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static list = async (req: Req, res: Res, next: NextFn) => {
    try {
      const query = req.query as AdminSubCategoryListRequest;
      const adminSubCategoryServices = new AdminSubCategoryServices();
      const result = await adminSubCategoryServices.list(query);

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static get = async (req: Req, res: Res, next: NextFn) => {
    try {
      const id = req.params.id;
      const adminSubCategoryServices = new AdminSubCategoryServices();
      const result = await adminSubCategoryServices.get(id);

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Req, res: Res, next: NextFn) => {
    try {
      const id = req.params.id;
      const adminSubCategoryServices = new AdminSubCategoryServices();
      const result = await adminSubCategoryServices.delete(id);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };
}
