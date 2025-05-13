import { checkSchema } from "express-validator";

export class AdminGalleryValidator {
  static createValidator = checkSchema({
    title: {
      in: "body",
      exists: {
        errorMessage: "title field not exist",
      },
      isString: {
        errorMessage: "title is not a string format!",
      },
      isLength: {
        options: {
          min: 2,
        },
        errorMessage: "title length should be logner than 2 symbols!",
      },
    },
    user_id: {
      in: "body",
      exists: {
        errorMessage: "user_id does not exists!",
      },
      isNumeric: { errorMessage: "user_id is not numeric!" },
    },
    page_category_id: {
      in: "body",
      exists: {
        errorMessage: "page_category_id does not exists!",
      },
      isNumeric: { errorMessage: "page_category_id is not numeric!" },
    },
  });

  static edit = checkSchema({
    gallery_id: {
      in: "body",
      exists: {
        errorMessage: "gallery_id does not exists!",
      },
      isNumeric: { errorMessage: "gallery_id is not numeric!" },
    },
    title: {
      in: "body",
      optional: true,
      isString: {
        errorMessage: "title is not a string format!",
      },
      isLength: {
        options: {
          min: 2,
        },
        errorMessage: "title length should be logner than 2 symbols!",
      },
    },
    user_id: {
      in: "body",
      optional: true,
      isNumeric: { errorMessage: "user_id is not numeric!" },
    },
    page_category_id: {
      in: "body",
      optional: true,
      isNumeric: { errorMessage: "page_category_id is not numeric!" },
    },
  });
  static addImages = checkSchema({
    gallery_id: {
      in: "body",
      exists: {
        errorMessage: "gallery_id does not exists!",
      },
      isNumeric: { errorMessage: "gallery_id is not numeric!" },
    },
  });
  static deleteImages = checkSchema({
    gallery_id: {
      in: "body",
      exists: {
        errorMessage: "gallery_id does not exists!",
      },
      isNumeric: { errorMessage: "gallery_id is not numeric!" },
    },
    image_ids: {
      in: "body",
      custom: {
        options: (value) => {
          try {
            // VALUE must be JSON.stringtify([1, ...])
            let arr = [];
            if (value instanceof Array) {
              arr = value;
            } else {
              arr = JSON.parse(value);
            }

            const isNotValid = arr.reduce((acc: boolean[], curValue: any) => {
              if (typeof curValue === "number") {
                return [...acc, true];
              }
              return [...acc, false];
            }, []);
            if (isNotValid.length === 0) {
              return "";
            }
            const checkNotPassed = isNotValid.includes(false);
            if (checkNotPassed) {
              return "";
            }
            return value;
          } catch (_) {
            console.log(_);
            return "";
          }
        },
        errorMessage: "image_ids must be a numeric array",
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
    publication_type_id: {
      optional: true,
      in: "query",
      exists: {
        errorMessage: "publication_type_id does not exist!",
      },
      isNumeric: {
        errorMessage: "publication_type_id must be numeric!",
      },
    },
  });

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
}
