import { BAD_REQUEST, OK } from "http-status/lib";
import { AdminUserServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import {
  AdminUserListRequest,
  AdminUserRequest,
} from "@/types/request/admin/user";

export class AdminUserController {
  static post = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminUserRequest;
      console.log("Image", req.file);
      const image = req.file?.path;
      const adminUserServices = new AdminUserServices();
      const result = await adminUserServices.post(body, image);

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
      const query = req.query as AdminUserListRequest;
      const adminUserServices = new AdminUserServices();
      const result = await adminUserServices.list(query);

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  //   static get = async (req: Req, res: Res, next: NextFn) => {
  //     try {
  //       const id = req.params.id;
  //       const categoryServices = new CategoryServices();
  //       const result = await categoryServices.get(id);

  //       res.status(OK).json(
  //         apiResponse({
  //           message: "Category list",
  //           data: result,
  //         }),
  //       );
  //     } catch (error) {
  //       next(error);
  //     }
  //   };

  //   static delete = async (req: Req, res: Res, next: NextFn) => {
  //     try {
  //       const id = req.params.id;
  //       const categoryServices = new CategoryServices();
  //       const result = await categoryServices.delete(id);

  //       if (!result.status) {
  //         res.status(BAD_REQUEST).json(apiResponse(result));
  //       }

  //       res.status(OK).json(apiResponse(result));
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
}
