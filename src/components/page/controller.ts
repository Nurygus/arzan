import { OK } from "http-status/lib";
import { ApiPageServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";

export class ApiPageController {
  static list = async (_: Req, res: Res, next: NextFn) => {
    try {
      const pageServices = new ApiPageServices();
      const result = await pageServices.list();

      res.status(OK).json(
        apiResponse({
          message: "Page list",
          data: result,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };
}
