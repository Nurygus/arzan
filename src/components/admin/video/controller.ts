import { BAD_REQUEST, OK } from "http-status/lib";
import { AdminVideoServices } from "./services";
import {
  AdminVideoCreateRequest,
  AdminVideoDeleteRequest,
  AdminVideoEditRequest,
  AdminVideoGetPublicationTypeRequest,
  AdminVideoGetRequest,
  AdminVideoListRequest,
  AdminVideoSetPublicationTypeRequest,
} from "@/types/request/admin/video";
import { apiResponse } from "@/helpers/apiResponse";

export class AdminVideoController {
  static create = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AdminVideoCreateRequest;
      const videoServices = new AdminVideoServices();
      const { video, thumbnail } = req.files as any;
      requestBody.video = video[0].path;
      requestBody.thumbnail = thumbnail[0].path;
      requestBody.page_category_ids = JSON.parse(req.body.page_category_ids);
      const result = await videoServices.create(requestBody);

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
      const requestBody = req.body as AdminVideoEditRequest;
      const videoServices = new AdminVideoServices();
      if (req.body.page_category_ids) {
        requestBody.page_category_ids = JSON.parse(req.body.page_category_ids);
      }
      if (req.files) {
        const { thumbnail } = req.files as any;
        if (thumbnail && thumbnail.length > 0) {
          requestBody.thumbnail = thumbnail[0].path;
        }
      }
      const result = await videoServices.edit(requestBody);

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
      const requestBody: AdminVideoGetRequest = { id: Number(id) };
      const videoServices = new AdminVideoServices();
      const result = await videoServices.get(requestBody);

      res.status(OK).json(
        apiResponse({
          message: "Video",
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
      const requestBody: AdminVideoDeleteRequest = { id: Number(id) };
      const videoServices = new AdminVideoServices();
      const result = await videoServices.delete(requestBody);

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

  static list = async (req: Req, res: Res, next: NextFn) => {
    try {
      const query = req.query as AdminVideoListRequest;
      const videoServices = new AdminVideoServices();
      const result = await videoServices.list(query);

      res.status(OK).json(
        apiResponse({
          message: "video list",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static setPublicationType = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminVideoSetPublicationTypeRequest;
      const videoServices = new AdminVideoServices();
      const result = await videoServices.setPublicationType(body);

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

  static getPublicationType = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const body: AdminVideoGetPublicationTypeRequest = { id: Number(id) };
      const videoServices = new AdminVideoServices();
      const result = await videoServices.getPublicationType(body);

      res.status(OK).json(
        apiResponse({
          message: "video publication type",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
