import { BAD_REQUEST, OK } from "http-status/lib";
import { AdminPublicationTypeServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import {
  AdminPublicationTypeCreateRequest,
  AdminPublicationTypeGetRequest,
  AdminPublicationTypeListRequest,
} from "@/types/request/admin/publication-type";

export class AdminPublicationTypeController {
  static create = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AdminPublicationTypeCreateRequest;
      const services = new AdminPublicationTypeServices();
      const result = await services.create(requestBody);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static get = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { id } = req.params || "";
      const requestBody: AdminPublicationTypeGetRequest = { id: Number(id) };
      const services = new AdminPublicationTypeServices();
      const result = await services.get(requestBody);

      res.status(OK).json(
        apiResponse({
          message: "publication-type data",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  static list = async (req: Req, res: Res, next: NextFn) => {
    try {
      const query = req.query as AdminPublicationTypeListRequest;
      const services = new AdminPublicationTypeServices();
      const result = await services.list(query);

      res.status(OK).json(
        apiResponse({
          message: "publication-type list",
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
