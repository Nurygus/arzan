import { OK } from "http-status/lib";
import { ApiPlatformServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";

export class ApiPlatformController {
  static list = async (_: Req, res: Res, next: NextFn) => {
    try {
      const platformServices = new ApiPlatformServices();
      const result = await platformServices.list();

      res.status(OK).json(
        apiResponse({
          message: "Platform list",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
