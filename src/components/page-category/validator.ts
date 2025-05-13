import { checkSchema } from "express-validator";

export class UserPageCategoryValidator {
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
    page_id: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "page_id is not numeric!" },
    },
  });
}
