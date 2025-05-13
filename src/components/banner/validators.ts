import { checkSchema } from "express-validator";

export class BannerListValidator {
  static getValidator = checkSchema({
    id: {
      in: "params",
      exists: {
        errorMessage: "id does not exists!",
      },
      isNumeric: { errorMessage: "id is not numeric!" },
    },
  });

  static listValidator = checkSchema({
    platform: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "platform is not numeric!" },
    },
    location: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "location is not numeric!" },
    },
    page_category: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "page_category is not numeric!" },
    },
    page: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "page is not numeric!" },
    },
  });
}
