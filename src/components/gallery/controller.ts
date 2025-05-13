import { BAD_REQUEST, OK } from "http-status/lib";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { GalleryServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import {
  UserGalleryBadgeCountRequest,
  UserGalleryGetRequest,
  UserGalleryListRequest,
  UserGalleryPhotoLikeRequest,
  UserGalleryPhotoViewRequest,
} from "@/types/request/gallery";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export class UserGalleryController {
  static list = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.query as UserGalleryListRequest;
      const session = req.session as any;
      try {
        const token = req.headers.authorization!.split(" ")[1];
        const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
        body.current_user_id = decodedData.id;
      } catch (e) {}
      const services = new GalleryServices();
      const result = await services.list(body);

      if (
        result.length > 0 &&
        (!session.last_fetched_gallery_date
          ? true
          : new Date(result[0].created_at).getTime() >
            session.last_fetched_gallery_date)
      ) {
        session.last_fetched_gallery_date = new Date(
          result[0].created_at,
        ).getTime();
      }

      res.status(OK).json(
        apiResponse({
          message: "Gallery list",
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
      const body: UserGalleryGetRequest = { id: Number(id) };
      try {
        const token = req.headers.authorization!.split(" ")[1];
        const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
        body.current_user_id = decodedData.id;
      } catch (e) {}
      const services = new GalleryServices();
      const result = await services.get(body);

      res.status(OK).json(
        apiResponse({
          message: "Gallery",
          data: result,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };

  static getBadgeCount = async (req: Req, res: Res, next: NextFn) => {
    try {
      const session = req.session;
      const { last_fetched_date } = req.query as UserGalleryBadgeCountRequest;
      const galleryServices = new GalleryServices();
      const result = await galleryServices.getBadgeCount(
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

  static like = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as UserGalleryPhotoLikeRequest;
      const token = req.headers.authorization!.split(" ")[1];
      const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      body.current_user_id = decodedData.id;
      const services = new GalleryServices();
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
      const body = req.body as UserGalleryPhotoViewRequest;
      // const token = req.headers.authorization!.split(" ")[1];
      // const decodedData = jwt.verify(token!, JWT_SECRET) as { id: number };
      // body.current_user_id = decodedData.id;
      const services = new GalleryServices();
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
}
