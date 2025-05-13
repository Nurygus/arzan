import { checkSchema } from "express-validator";

export class AdminCategoryValidator {
  static createValidator = checkSchema({
    name: {
      exists: {
        errorMessage: "Name field not exist",
      },
      isString: {
        errorMessage: "Name is not a string format!",
      },
      isLength: {
        options: {
          min: 2,
        },
        errorMessage: "Category name length should be logner than 2 symbols!",
      },
    },
  });
}
