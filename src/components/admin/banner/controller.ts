import { BAD_REQUEST, OK } from "http-status/lib";
import { AdminBannerServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import {
  AdminBannerCreateRequest,
  AdminBannerDeleteRequest,
  AdminBannerEditRequest,
  AdminBannerGetRequest,
  AdminBannerListRequest,
} from "@/types/request/admin/banner";

export class AdminBannerController {
  static create = async (req: Req, res: Res, next: NextFn) => {
    try {
      const adminBannerServices = new AdminBannerServices();
      const requestBody = req.body as AdminBannerCreateRequest;
      requestBody.page_category_ids = JSON.parse(req.body.page_category_ids);
      requestBody.location_ids = JSON.parse(req.body.location_ids);
      requestBody.platform_id = JSON.parse(req.body.platform_id);
      requestBody.image = req.file!.path;
      const result = await adminBannerServices.create(requestBody);
      if (!result.status) {
        res.status(BAD_REQUEST).json(
          apiResponse({
            status: false,
            message: result.message,
          }),
        );
      }

      res.status(OK).json(
        apiResponse({
          message: result.message,
          data: result.data,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static edit = async (req: Req, res: Res, next: NextFn) => {
    try {
      const adminBannerServices = new AdminBannerServices();
      const requestBody = req.body as AdminBannerEditRequest;
      if (req.body.page_category_ids) {
        requestBody.page_category_ids = JSON.parse(req.body.page_category_ids);
      }
      if (req.body.location_ids) {
        requestBody.location_ids = JSON.parse(req.body.location_ids);
      }
      if (req.body.platform_id) {
        requestBody.platform_id = JSON.parse(req.body.platform_id);
      }
      if (req.file) {
        requestBody.image = req.file!.path;
      }
      const result = await adminBannerServices.edit(requestBody);
      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static list = async (req: Req, res: Res, next: NextFn) => {
    try {
      const query = req.query as AdminBannerListRequest;
      const adminBannerServices = new AdminBannerServices();
      const result = await adminBannerServices.list(query);

      res.status(OK).json(
        apiResponse({
          message: "Banner list",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static get = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const body: AdminBannerGetRequest = { id: Number(id) };
      const adminBannerServices = new AdminBannerServices();
      const result = await adminBannerServices.get(body);

      res.status(OK).json(
        apiResponse({
          message: "Banner data",
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
      const body: AdminBannerDeleteRequest = { id: Number(id) };
      const adminBannerServices = new AdminBannerServices();
      const result = await adminBannerServices.delete(body);

      if (!result.status) {
        res.status(BAD_REQUEST).json(
          apiResponse({
            message: result.message,
            status: false,
          }),
        );
      }
      res.status(OK).json(
        apiResponse({
          message: result.message,
          data: result.data,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
