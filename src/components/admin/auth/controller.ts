import { BAD_REQUEST, OK } from "http-status/lib";
import { AdminAuthServices } from "./services";
import { AdminAuthLoginRequest } from "@/types/request/admin/auth";
import { apiResponse } from "@/helpers/apiResponse";

export class AdminAuthController {
  static login = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AdminAuthLoginRequest;
      const authServices = new AdminAuthServices();
      const result = await authServices.login(requestBody);

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
}
