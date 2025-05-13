import { BAD_REQUEST, OK } from "http-status/lib";
import { AdminPaymentServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";

export class AdminPaymentController {
  static post = async (req: Req, res: Res, next: NextFn) => {
    try {
      const image = req.file!.path;
      const body = req.body as AdminPaymentServices;
      const adminPaymentServices = new AdminPaymentServices();
      const result = await adminPaymentServices.post(body, image);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static list = async (_: Req, res: Res, next: NextFn) => {
    try {
      const adminPaymentServices = new AdminPaymentServices();
      const result = await adminPaymentServices.list();

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static userList = async (_: Req, res: Res, next: NextFn) => {
    try {
      const adminPaymentServices = new AdminPaymentServices();
      const result = await adminPaymentServices.userList();

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
  //           message: "Category",
  //           data: result,
  //         }),
  //       );
  //     } catch (error) {
  //       next(error);
  //     }
  //   };

  static delete = async (req: Req, res: Res, next: NextFn) => {
    try {
      const id = req.params.id;
      const adminPaymentServices = new AdminPaymentServices();
      const result = await adminPaymentServices.delete(id);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };
}
