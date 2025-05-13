import { BAD_REQUEST, OK } from "http-status/lib";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserVideoServices } from "./services";
import {
  UserVideoBadgeCountRequest,
  UserVideoGetRequest,
  UserVideoLikeRequest,
  UserVideoListRequest,
  UserVideoViewRequest,
} from "@/types/request/video";
import { apiResponse } from "@/helpers/apiResponse";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export class UserVideoController {
  static get = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const body: UserVideoGetRequest = { id: Number(id) };
      try {
        const token = req.headers.authorization!.split(" ")[1];
        const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
        body.current_user_id = decodedData.id;
      } catch (e) {}
      const videoServices = new UserVideoServices();
      const result = await videoServices.get(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static list = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.query as UserVideoListRequest;
      const session = req.session as any;
      try {
        const token = req.headers.authorization!.split(" ")[1];
        const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
        body.current_user_id = decodedData.id;
      } catch (e) {}
      const videoServices = new UserVideoServices();
      const result = await videoServices.list(body);

      if (
        result.data &&
        result.data.length > 0 &&
        (!session.last_fetched_video_date
          ? true
          : new Date(result.data[0].created_at).getTime() >
            session.last_fetched_video_date)
      ) {
        session.last_fetched_video_date = new Date(
          result.data[0].created_at,
        ).getTime();
      }

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static like = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as UserVideoLikeRequest;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      body.current_user_id = decodedData.id;
      const videoServices = new UserVideoServices();
      const result = await videoServices.like(body);

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

  static getBadgeCount = async (req: Req, res: Res, next: NextFn) => {
    try {
      const session = req.session;
      const { last_fetched_date } = req.query as UserVideoBadgeCountRequest;
      const videoServices = new UserVideoServices();
      const result = await videoServices.getBadgeCount(
        session,
        last_fetched_date,
      );

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static view = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as UserVideoViewRequest;
      // const token = req.headers.authorization!.split(" ")[1];
      // const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      // body.current_user_id = decodedData.id;
      const videoServices = new UserVideoServices();
      const result = await videoServices.view(body);

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
}
