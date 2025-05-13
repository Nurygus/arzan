import { BAD_REQUEST, OK } from "http-status/lib";
import { AdminUserProfileServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import {
  AdminDeleteUserRequest,
  AdminGetFollowRewardRequest,
  AdminListFollowRewardRequest,
  AdminListTopListLimitRequest,
  AdminSetFollowRewardRequest,
  AdminSetTopListLimitRequest,
  AdminUserDayStreakCoinRewardSetRequest,
} from "@/types/request/admin/user-profile";

export class AdminUserProfileController {
  static listFollowReward = async (req: Req, res: Res, next: NextFn) => {
    try {
      const query = req.query as AdminListFollowRewardRequest;
      const services = new AdminUserProfileServices();
      const result = await services.listFollowReward(query);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(
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
      return next(error);
    }
  };

  static getFollowReward = async (req: Req, res: Res, next: NextFn) => {
    try {
      const query = req.query as unknown as AdminGetFollowRewardRequest;
      const services = new AdminUserProfileServices();
      const result = await services.getFollowReward(query);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(
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
      return next(error);
    }
  };

  static setFollowReward = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminSetFollowRewardRequest;
      const services = new AdminUserProfileServices();
      const result = await services.setFollowReward(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(
          apiResponse({
            status: false,
            message: result.message,
          }),
        );
      }

      res.status(OK).json(
        apiResponse({
          message: result.message,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };

  static setTopListLimit = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminSetTopListLimitRequest;
      const services = new AdminUserProfileServices();
      const result = await services.setTopListLimit(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(
          apiResponse({
            status: false,
            message: result.message,
          }),
        );
      }

      res.status(OK).json(
        apiResponse({
          message: result.message,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };

  static listTopListLimit = async (req: Req, res: Res, next: NextFn) => {
    try {
      const query = req.query as AdminListTopListLimitRequest;
      const services = new AdminUserProfileServices();
      const result = await services.listTopListLimit(query);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(
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
      return next(error);
    }
  };

  static delteUser = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const body: AdminDeleteUserRequest = { id: Number(id) };
      const services = new AdminUserProfileServices();
      const result = await services.delteUser(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(
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
      return next(error);
    }
  };

  static setDayStreakCoinReward = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminUserDayStreakCoinRewardSetRequest;
      const services = new AdminUserProfileServices();
      const result = await services.setDayStreakCoinReward(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };
}
