import { BAD_REQUEST, OK } from "http-status/lib";
import { GalleryServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import {
  AdminGalleryAddImageRequest,
  AdminGalleryCreateRequest,
  AdminGalleryDeleteImageRequest,
  AdminGalleryDeleteRequest,
  AdminGalleryEditRequest,
  AdminGalleryGetRequest,
  AdminGalleryListRequest,
  AdminGalleryPhotoGetPublicationTypeRequest,
  AdminGalleryPhotoSetPublicationTypeRequest,
} from "@/types/request/admin/gallery";

export class AdminGalleryController {
  static create = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminGalleryCreateRequest;
      const { avatar_image, images } = req.files as any;
      body.images = images.map((e: { path: string }) => e.path) as string[];
      body.avatar_image = avatar_image[0].path;
      // body.page_category_ids = JSON.parse(req.body.page_category_ids);

      const services = new GalleryServices();

      const result = await services.create(body);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static edit = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminGalleryEditRequest;
      if (req.files) {
        const { avatar_image } = req.files as any;
        if (avatar_image && avatar_image.length > 0) {
          body.avatar_image = avatar_image[0].path;
        }
      }

      const services = new GalleryServices();

      const result = await services.edit(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static addImages = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminGalleryAddImageRequest;
      const { images } = req.files as any;
      body.images = images.map((e: { path: string }) => e.path) as string[];
      const services = new GalleryServices();
      const result = await services.addImages(body);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static deleteImages = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminGalleryDeleteImageRequest;
      const services = new GalleryServices();
      const result = await services.deleteImages(body);

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
      const body = req.query as AdminGalleryListRequest;
      const services = new GalleryServices();
      const result = await services.list(body);

      res.status(OK).json(
        apiResponse({
          message: "Gallery list",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static get = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const body: AdminGalleryGetRequest = { id: Number(id) };
      const services = new GalleryServices();
      const result = await services.get(body);

      res.status(OK).json(
        apiResponse({
          message: "Gallery",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const body: AdminGalleryDeleteRequest = { id: Number(id) };
      const services = new GalleryServices();
      const result = await services.delete(body);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static setPublicationType = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body as AdminGalleryPhotoSetPublicationTypeRequest;
      const services = new GalleryServices();
      const result = await services.setPublicationType(body);

      if (!result.status) {
        res.status(BAD_REQUEST).json(
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
      next(error);
    }
  };

  static getPublicationType = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const body: AdminGalleryPhotoGetPublicationTypeRequest = {
        id: Number(id),
      };
      const services = new GalleryServices();
      const result = await services.getPublicationType(body);

      res.status(OK).json(
        apiResponse({
          message: "gallery photo publication type",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
