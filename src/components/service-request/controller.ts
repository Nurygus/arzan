import { BAD_REQUEST, OK } from "http-status/lib";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiServiceRequestServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import { ApiServiceRequestBody } from "@/types/request/service-request";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export class ApiServiceRequestController {
  static post = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as ApiServiceRequestBody;

      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };

      body.user_auth_id = decodedData.id;

      const serviceRequestServices = new ApiServiceRequestServices();

      const result = await serviceRequestServices.post(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };
}
