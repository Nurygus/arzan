import { OK } from "http-status/lib";
import { HomeServices } from "./services";
import { getAppInfoQuery } from "@/types/request/home";
import { apiResponse } from "@/helpers/apiResponse";

export class HomeController {
  static getAppInfo = async (req: Req, res: Res, next: NextFn) => {
    try {
      const appInfoKey = req.query.key as getAppInfoQuery;
      const homeServices = new HomeServices();
      const result = await homeServices.getAppInfo(appInfoKey);

      res.status(OK).json(
        apiResponse({
          message: "Home",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
