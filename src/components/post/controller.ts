import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BAD_REQUEST, OK } from "http-status/lib";
import { PostServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import {
  ApiPostDeleteRequest,
  ApiPostListRequest,
  UserPostBadgeCountRequest,
  UserPostGetRequest,
  UserPostLikeRequest,
  UserPostUpdateRequest,
  UserPostViewRequest,
} from "@/types/request/post";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export class ApiPostController {
  static post = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body;
      const files = req.files as any[];
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };

      const userId = decodedData.id;

      const postServices = new PostServices();
      const images = files.reduce((acc, curValue) => {
        return [...acc, curValue.path];
      }, []);
      const result = await postServices.post(body, images, userId);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      return res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static list = async (req: Req, res: Res, next: NextFn) => {
    try {
      const query = req.query as ApiPostListRequest;
      const session = req.session as any;
      try {
        const token = req.headers.authorization!.split(" ")[1];
        const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
        query.current_user_id = decodedData.id;
      } catch (e) {}
      const postServices = new PostServices();
      const result = await postServices.list(query);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      if (
        Number(query.publication_type_id) === 3 &&
        result.data &&
        result.data.length > 0 &&
        (!session.last_fetched_selected_post_date
          ? true
          : new Date(result.data[0].created_at).getTime() >
            session.last_fetched_selected_post_date)
      ) {
        session.last_fetched_selected_post_date = new Date(
          result.data[0].created_at,
        ).getTime();
      }

      if (
        Number(query.publication_type_id) !== 3 &&
        result.data &&
        result.data.length > 0 &&
        (!session.last_fetched_post_date
          ? true
          : new Date(result.data[0].created_at).getTime() >
            session.last_fetched_post_date)
      ) {
        session.last_fetched_post_date = new Date(
          result.data[0].created_at,
        ).getTime();
      }

      res.status(OK).send(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static get = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const body: UserPostGetRequest = { id: Number(id) };
      try {
        const token = req.headers.authorization!.split(" ")[1];
        const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
        body.current_user_id = decodedData.id;
      } catch (e) {}
      const postServices = new PostServices();
      const result = await postServices.get(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static getBadgeCount = async (req: Req, res: Res, next: NextFn) => {
    try {
      const session = req.session;
      const { last_fetched_date, publication_type_id } =
        req.query as UserPostBadgeCountRequest;
      const postServices = new PostServices();
      const result = await postServices.getBadgeCount(
        session,
        Number(last_fetched_date),
        Number(publication_type_id),
      );

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
      const body = req.body as UserPostLikeRequest;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      body.current_user_id = decodedData.id;
      const services = new PostServices();
      const result = await services.like(body);

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

  static view = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as UserPostViewRequest;
      // const token = req.headers.authorization!.split(" ")[1];
      // const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      // body.current_user_id = decodedData.id;
      const services = new PostServices();
      const result = await services.view(body);

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

  static delete = async (req: Req, res: Res, next: NextFn) => {
    try {
      const token = req.headers.authorization!.split(" ")[1];
      jwt.verify(token!, JWT_SECRET) as { id: number };
      const { id } = req.params || "";
      const body: ApiPostDeleteRequest = { id: Number(id) };
      const adminPostServices = new PostServices();
      const result = await adminPostServices.delete(body);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as UserPostUpdateRequest;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      body.current_user_id = decodedData.id;

      const files = req.files as any[];
      if (files && files.length > 0) {
        body.images = files.reduce((acc, curValue) => {
          return [...acc, curValue.path];
        }, []);
      }
      const services = new PostServices();
      const result = await services.update(body);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };
}
