import { checkSchema } from "express-validator";

export class AdminSubCategoryValidator {
  static postValidator = checkSchema({
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
    category_id: {
      exists: {
        errorMessage: "Category id field not exist",
      },
      isNumeric: {
        errorMessage: "Category id is not numeric value",
      },
    },
  });

  static getValidator = checkSchema({
    id: {
      exists: {
        errorMessage: "Id param doesn't exist",
      },
      isNumeric: {
        errorMessage: "Category id is not numeric value",
      },
    },
  });
}
