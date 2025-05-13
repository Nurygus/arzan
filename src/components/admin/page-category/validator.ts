import { checkSchema } from "express-validator";

export class AdminPageCategoryValidator {
  static createValidator = checkSchema({
    page_id: {
      in: "body",
      exists: {
        errorMessage: "page_id does not exist!",
      },
      isNumeric: {
        errorMessage: "page_id must be numeric!",
      },
    },
    category_name: {
      in: "body",
      exists: {
        errorMessage: "category_name does not exist!",
      },
      isString: {
        errorMessage: "category_name must be string!",
      },
    },
  });

  static edit = checkSchema({
    page_category_id: {
      in: "body",
      exists: {
        errorMessage: "page_category_id does not exist!",
      },
      isNumeric: {
        errorMessage: "page_category_id must be numeric!",
      },
    },
    page_id: {
      in: "body",
      optional: true,
      isNumeric: {
        errorMessage: "page_id must be numeric!",
      },
    },
    category_name: {
      in: "body",
      optional: true,
      isString: {
        errorMessage: "category_name must be string!",
      },
    },
  });

  static getValidator = checkSchema({
    id: {
      in: "params",
      exists: {
        errorMessage: "id does not exists!",
      },
      isNumeric: { errorMessage: "id is not numeric!" },
    },
  });

  static deleteValidator = checkSchema({
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
  static listPageValidator = checkSchema({});
  static listCategoryValidator = checkSchema({});
}
