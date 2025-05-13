import { checkSchema } from "express-validator";

export class UserVideoValidator {
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
    user_id: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "user_id is not numeric!" },
    },
    page_category_id: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "page_category_id is not numeric!" },
    },
    query: {
      optional: true,
      in: "query",
      exists: {
        errorMessage: "query does not exists!",
      },
      isString: { errorMessage: "query is not string!" },
      trim: true,
      isLength: {
        options: { min: 1 },
        errorMessage: "query length must be minimum 1 character",
      },
    },
    sort: {
      optional: true,
      in: "query",
      isString: { errorMessage: "sort is not string!" },
    },
    order: {
      optional: true,
      in: "query",
      isString: { errorMessage: "order is not string!" },
    },
    limit: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "limit is not numeric!" },
    },
    offset: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "offset is not numeric!" },
    },
  });

  static likeValidator = checkSchema({
    id: {
      in: "body",
      isNumeric: { errorMessage: "id is not numeric!" },
    },
  });

  static viewValidator = checkSchema({
    id: {
      in: "body",
      isNumeric: { errorMessage: "id is not numeric!" },
    },
  });
}
