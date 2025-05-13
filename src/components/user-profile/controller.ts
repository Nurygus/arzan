import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BAD_REQUEST, OK } from "http-status/lib";
import { UserProfileServices } from "./services";
import {
  UserDayStreakCoinRewardListRequest,
  UserDayStreakSetRequest,
  UserFollowRequest,
  UserProfileBackgroundImageAddRequest,
  UserProfileBackgroundImageDeleteRequest,
  UserProfileGetRequest,
  UserProfileListRequest,
  UserProfileSetAvatarRequest,
  UserProfileUpdateRequest,
  UserUnFollowRequest,
} from "@/types/request/user-profile";
import { apiResponse } from "@/helpers/apiResponse";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export class UserProfileController {
  static list = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.query as UserProfileListRequest;
      const services = new UserProfileServices();
      const result = await services.list(body);

      res.status(OK).json(
        apiResponse({
          message: "user profile list",
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
      const body: UserProfileGetRequest = { id: Number(id) };
      const services = new UserProfileServices();
      const result = await services.get(body);

      res.status(OK).json(
        apiResponse({
          message: "user profile get",
          data: result,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };

  static update = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as UserProfileUpdateRequest;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      body.current_user_id = decodedData.id;
      const services = new UserProfileServices();

      const result = await services.update(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static setAvatar = async (req: Req, res: Res, next: NextFn) => {
    try {
      const image = req.file?.path;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      const body: UserProfileSetAvatarRequest = {
        id: decodedData.id,
        image: image,
      };
      const services = new UserProfileServices();

      const result = await services.setAvatar(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static follow = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as UserFollowRequest;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      body.current_user_id = decodedData.id;
      const services = new UserProfileServices();

      const result = await services.follow(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static unFollow = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as UserUnFollowRequest;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      body.current_user_id = decodedData.id;
      const services = new UserProfileServices();

      const result = await services.unFollow(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static setDayStreak = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as UserDayStreakSetRequest;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      body.current_user_id = decodedData.id;
      const services = new UserProfileServices();

      const result = await services.setDayStreak(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static listDayStreakCoinReward = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as UserDayStreakCoinRewardListRequest;
      const services = new UserProfileServices();

      const result = await services.listDayStreakCoinReward(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static addUserProfileBackgroundImage = async (
    req: Req,
    res: Res,
    next: NextFn,
  ) => {
    try {
      const body = req.body as UserProfileBackgroundImageAddRequest;
      const files = req.files as any[];
      body.images = files.reduce((acc, curValue) => {
        return [...acc, curValue.path];
      }, []);
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      body.current_user_id = decodedData.id;
      const services = new UserProfileServices();

      const result = await services.addUserProfileBackgroundImage(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static deleteUserProfileBackgroundImage = async (
    req: Req,
    res: Res,
    next: NextFn,
  ) => {
    try {
      const body = req.body as UserProfileBackgroundImageDeleteRequest;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      body.current_user_id = decodedData.id;
      const services = new UserProfileServices();

      const result = await services.deleteUserProfileBackgroundImage(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };
}
