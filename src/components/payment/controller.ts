import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BAD_REQUEST, OK } from "http-status/lib";
import { ApiPaymentServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";

dotenv.config();

const JWT_SECRET = String(process.env.JWT_SECRET);

export class ApiPaymentController {
  static list = async (_: Req, res: Res, next: NextFn) => {
    try {
      const paymentServices = new ApiPaymentServices();
      const result = await paymentServices.list();

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static status = async (req: Req, res: Res, next: NextFn) => {
    try {
      const orderId = req.params.uuid;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };

      const userId = decodedData.id;

      const paymentServices = new ApiPaymentServices();
      const result = await paymentServices.status(userId, orderId);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static post = async (req: Req, res: Res, next: NextFn) => {
    try {
      const id = req.params.id;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };

      const userId = decodedData.id;

      const paymentServices = new ApiPaymentServices();
      const result = await paymentServices.post(id, userId);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };
}
