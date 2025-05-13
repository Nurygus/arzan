import { checkSchema } from "express-validator";

export class PostValidator {
  static createValidator = checkSchema({
    title: {
      in: "body",
      exists: {
        errorMessage: "Title field doesn't exists!",
      },
      isLength: {
        options: {
          min: 8,
        },
        errorMessage: "Title length should be logner than 8 characters!",
      },
    },
    description: {
      in: "body",
      exists: {
        errorMessage: "Description field doesn't exists!",
      },
    },
    phone: {
      in: "body",
      matches: {
        options: /^[+][9]{2}[3][6][1-5][0-9]{6}$/,
        errorMessage: "Not a valid phone number!",
      },
    },
    price: {
      in: "body",
      exists: {
        errorMessage: "Price field doesn't exists!",
      },
    },
    category_id: {
      in: "body",
      exists: {
        errorMessage: "Category id field doesn't exists!",
      },
    },
    sub_category_id: {
      in: "body",
      exists: {
        errorMessage: "Sub category id doesn't exists!",
      },
    },
    start_date: {
      in: "body",
      isISO8601: {
        errorMessage: "Start date not a valid!",
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

  static listValidator = checkSchema({
    user_id: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "user_id is not numeric!" },
    },
    category_id: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "page_category_id is not numeric!" },
    },
    sub_category_id: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "page_category_id is not numeric!" },
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

  static update = checkSchema({
    post_id: {
      in: "body",
      exists: {
        errorMessage: "post_id does not exists!",
      },
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
