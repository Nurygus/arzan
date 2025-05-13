import { BAD_REQUEST, OK } from "http-status/lib";
import { CategoryServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import { AdminCategoryRequest } from "@/types/request/admin/category";

export class AdminCategoryController {
  static post = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminCategoryRequest;
      const image = req.file!.path;
      const categoryServices = new CategoryServices();
      const result = await categoryServices.post(body, image);

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
      const query = req.query;
      const categoryServices = new CategoryServices();
      const result = await categoryServices.list(query);

      res.status(OK).json(
        apiResponse({
          message: "Category list",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static get = async (req: Req, res: Res, next: NextFn) => {
    try {
      const id = req.params.id;
      const categoryServices = new CategoryServices();
      const result = await categoryServices.get(id);

      res.status(OK).json(
        apiResponse({
          message: "Category",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Req, res: Res, next: NextFn) => {
    try {
      const id = req.params.id;
      const categoryServices = new CategoryServices();
      const result = await categoryServices.delete(id);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };
}
