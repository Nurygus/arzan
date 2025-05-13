import { BAD_REQUEST, OK } from "http-status/lib";
import { AdminPostServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import {
  AdminPostDeleteRequest,
  AdminPostGetPublicationTypeRequest,
  AdminPostListRequest,
  AdminPostSetPublicationTypeRequest,
  AdminPostUpdateRequest,
} from "@/types/request/admin/post";

export class AdminPostController {
  static post = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body;
      const files = req.files as any[];
      const adminPostServices = new AdminPostServices();

      const images = files.reduce((acc, curValue) => {
        return [...acc, curValue.path];
      }, []);

      const result = await adminPostServices.post(body, images);

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
      const query = req.query as AdminPostListRequest;
      const adminPostServices = new AdminPostServices();
      const result = await adminPostServices.list(query);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static get = async (req: Req, res: Res, next: NextFn) => {
    try {
      const id = req.params.id;
      const adminPostServices = new AdminPostServices();
      const result = await adminPostServices.get(id);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const body: AdminPostDeleteRequest = { id: Number(id) };
      const adminPostServices = new AdminPostServices();
      const result = await adminPostServices.delete(body);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static approve = async (req: Req, res: Res, next: NextFn) => {
    try {
      const id = req.params.id;
      const body = req.body;
      const adminPostServices = new AdminPostServices();
      const result = await adminPostServices.approve(id, body);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static setPublicationType = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminPostSetPublicationTypeRequest;
      const services = new AdminPostServices();
      const result = await services.setPublicationType(body);

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
      const body: AdminPostGetPublicationTypeRequest = { id: Number(id) };
      const services = new AdminPostServices();
      const result = await services.getPublicationType(body);

      res.status(OK).json(
        apiResponse({
          message: "post publication type",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminPostUpdateRequest;
      const files = req.files as any[];
      if (files && files.length > 0) {
        body.images = files.reduce((acc, curValue) => {
          return [...acc, curValue.path];
        }, []);
      }

      const services = new AdminPostServices();
      const result = await services.update(body);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };
}
