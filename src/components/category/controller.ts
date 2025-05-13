import { OK } from "http-status/lib";
import { CategoryServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";

export class ApiCategoryController {
  static list = async (_: Req, res: Res, next: NextFn) => {
    try {
      const categoryServices = new CategoryServices();
      const result = await categoryServices.list();

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  //   static get = async (req: Req, res: Res, next: NextFn) => {
  //     try {
  //       const id = req.params.id;
  //       const categoryServices = new CategoryServices();
  //       const result = await categoryServices.get(id);

  //       res.status(OK).json(
  //         apiResponse({
  //           message: "Category list",
  //           data: result,
  //         }),
  //       );
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
}
