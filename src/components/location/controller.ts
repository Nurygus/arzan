import { OK } from "http-status/lib";
import { LocationServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";

export class LocationController {
  static list = async (_: Req, res: Res, next: NextFn) => {
    try {
      const locationServices = new LocationServices();
      const result = await locationServices.list();

      res.status(OK).json(
        apiResponse({
          message: "Location list",
          data: result,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };
}
