import { BAD_REQUEST, OK } from "http-status/lib";
import { AdminPageCategoryServices } from "./services";
import {
  AdminPageCategoryCreateRequest,
  AdminPageCategoryDeleteRequest,
  AdminPageCategoryEditRequest,
  AdminPageCategoryGetRequest,
  AdminPageCategoryListRequest,
} from "@/types/request/admin/page-category";
import { apiResponse } from "@/helpers/apiResponse";

export class AdminPageCategoryController {
  static create = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AdminPageCategoryCreateRequest;
      requestBody.image = req.file!.path;
      const videoCategoryServices = new AdminPageCategoryServices();
      const result = await videoCategoryServices.create(requestBody);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static edit = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AdminPageCategoryEditRequest;
      if (req.file) {
        requestBody.image = req.file!.path;
      }
      const videoCategoryServices = new AdminPageCategoryServices();
      const result = await videoCategoryServices.edit(requestBody);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static get = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const requestBody: AdminPageCategoryGetRequest = { id: Number(id) };
      const videoCategoryServices = new AdminPageCategoryServices();
      const result = await videoCategoryServices.get(requestBody);

      res.status(OK).json(
        apiResponse({
          message: "page category data",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const requestBody: AdminPageCategoryDeleteRequest = { id: Number(id) };
      const videoCategoryServices = new AdminPageCategoryServices();
      const result = await videoCategoryServices.delete(requestBody);

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
      const query = req.query as AdminPageCategoryListRequest;
      const videoCategoryServices = new AdminPageCategoryServices();
      const result = await videoCategoryServices.list(query);

      res.status(OK).json(
        apiResponse({
          message: "page-category list",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static listPage = async (req: Req, res: Res, next: NextFn) => {
    try {
      const query = req.query as AdminPageCategoryListRequest;
      const services = new AdminPageCategoryServices();
      const result = await services.listPage(query);

      res.status(OK).json(
        apiResponse({
          message: "page list",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static listCategory = async (req: Req, res: Res, next: NextFn) => {
    try {
      const query = req.query as AdminPageCategoryListRequest;
      const services = new AdminPageCategoryServices();
      const result = await services.listCategory(query);

      res.status(OK).json(
        apiResponse({
          message: "category list",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
