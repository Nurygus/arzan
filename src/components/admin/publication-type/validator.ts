import { checkSchema } from "express-validator";

export class AdminPublicationTypeValidator {
  static createValidator = checkSchema({
    type: {
      in: "body",
      exists: {
        errorMessage: "name does not exist!",
      },
      isString: {
        errorMessage: "name must be string!",
      },
    },
    amount: {
      optional: true,
      in: "body",
      isNumeric: {
        errorMessage: "amount must be numeric!",
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
    type: {
      optional: true,
      in: "query",
      isString: { errorMessage: "type is not string!" },
    },
  });
}
