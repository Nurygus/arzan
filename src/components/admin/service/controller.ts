import { BAD_REQUEST, OK } from "http-status/lib";
import { AdminServiceServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";

export class AdminServiceController {
  static post = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body;
      const file = req.file!.path;
      const adminServiceServices = new AdminServiceServices();

      const result = await adminServiceServices.post(body, file);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static put = async (req: Req, res: Res, next: NextFn) => {
    try {
      const body = req.body;
      const id = Number(req.params.id);
      const file = req.file?.path;
      if (req.body.location_costs) {
        body.location_costs = JSON.parse(body.location_costs);
      }
      const adminServiceServices = new AdminServiceServices();

      const result = await adminServiceServices.put(id, body, file);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static list = async (_: Req, res: Res, next: NextFn) => {
    try {
      const adminServiceServices = new AdminServiceServices();

      const result = await adminServiceServices.list();

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
      const id = Number(req.params.id);
      const adminServiceServices = new AdminServiceServices();

      const result = await adminServiceServices.get(id);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Req, res: Res, next: NextFn) => {
    try {
      const id = Number(req.params.id);
      const adminServiceServices = new AdminServiceServices();

      const result = await adminServiceServices.delete(id);

      if (!result.status) {
        res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      next(error);
    }
  };
}
