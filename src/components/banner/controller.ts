import { OK } from "http-status/lib";
import { BannerServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import {
  UserBannerGetRequest,
  UserBannerListRequest,
} from "@/types/request/banner";

export class BannerController {
  static list = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.query as UserBannerListRequest;
      const bannerServices = new BannerServices();
      const result = await bannerServices.list(body);

      res.status(OK).json(
        apiResponse({
          message: "Banner list",
          data: result,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };

  static get = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const body: UserBannerGetRequest = { id: Number(id) };
      const bannerServices = new BannerServices();
      const result = await bannerServices.get(body);

      res.status(OK).json(
        apiResponse({
          message: "Banner data",
          data: result,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };
}
