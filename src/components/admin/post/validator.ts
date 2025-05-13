import { checkSchema } from "express-validator";

export class AdminPostValidator {
  static setPublicationTypeValidator = checkSchema({
    id: {
      in: "body",
      exists: {
        errorMessage: "id does not exist!",
      },
      isNumeric: {
        errorMessage: "id must be numeric!",
      },
    },
    publication_type_id: {
      in: "body",
      exists: {
        errorMessage: "publication_type_id does not exist!",
      },
      isNumeric: {
        errorMessage: "publication_type_id must be numeric!",
      },
    },
  });

  static getPublicationTypeValidator = checkSchema({
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

  static update = checkSchema({
    post_id: {
      in: "body",
      isNumeric: { errorMessage: "post_id is not numeric!" },
    },
    title: {
      optional: true,
      in: "body",
      isString: { errorMessage: "title is not string!" },
      isLength: {
        options: {
          min: 8,
        },
        errorMessage: "Title length should be logner than 8 characters!",
      },
    },
    description: {
      optional: true,
      in: "body",
      isString: { errorMessage: "description is not string!" },
    },
    phone: {
      optional: true,
      in: "body",
      matches: {
        options: /^[+][9]{2}[3][6][1-5][0-9]{6}$/,
        errorMessage: "Not a valid phone number!",
      },
    },
    price: {
      optional: true,
      in: "body",
      isNumeric: { errorMessage: "price is not numeric!" },
    },
    discount: {
      optional: true,
      in: "body",
      isNumeric: { errorMessage: "discount is not numeric!" },
    },
    category_id: {
      optional: true,
      in: "body",
      isNumeric: { errorMessage: "category_id is not numeric!" },
    },
    sub_category_id: {
      optional: true,
      in: "body",
      isNumeric: { errorMessage: "sub_category_id is not numeric!" },
    },
    start_date: {
      optional: true,
      in: "body",
      isISO8601: {
        errorMessage: "Start date not a valid!",
      },
    },
    end_date: {
      optional: true,
      in: "body",
      isISO8601: {
        errorMessage: "Start date not a valid!",
      },
    },
  });
}
