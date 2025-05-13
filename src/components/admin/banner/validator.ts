import { checkSchema } from "express-validator";

export class AdminBannerValidator {
  static createValidator = checkSchema({
    title: {
      in: "body",
      exists: {
        errorMessage: "title does not exist!",
      },
      isString: {
        errorMessage: "title must be string!",
      },
      trim: true,
      isLength: {
        options: { min: 1 },
        errorMessage: "title length must be minimum 1 character",
      },
    },
    description: {
      in: "body",
      exists: {
        errorMessage: "description does not exist!",
      },
      isString: {
        errorMessage: "description must be string!",
      },
      trim: true,
      isLength: {
        options: { min: 1 },
        errorMessage: "description length must be minimum 1 character",
      },
    },
    url: {
      in: "body",
      exists: {
        errorMessage: "url does not exist!",
      },
      isString: {
        errorMessage: "url must be string!",
      },
      // isURL: {
      //   errorMessage: "url is not an URL!",
      // },
      isLength: {
        options: { max: 256 },
        errorMessage: "url length must be below 256 characters",
      },
    },
    start_date: {
      in: "body",
      exists: {
        errorMessage: "start_date does not exist!",
      },
      isISO8601: {
        errorMessage: "start_date is not in ISO8601!",
      },
    },
    end_date: {
      in: "body",
      exists: {
        errorMessage: "end_date does not exist!",
      },
      isISO8601: {
        errorMessage: "end_date is not in ISO8601!",
      },
    },
    platform_id: {
      in: "body",
      exists: {
        errorMessage: "platform_id does not exist!",
      },
      isNumeric: {
        errorMessage: "platform_id is not numeric!",
      },
    },
    page_category_ids: {
      in: "body",
      exists: {
        errorMessage: "page_category_ids does not exists!",
      },
      custom: {
        options: (value) => {
          try {
            // VALUE must be JSON.stringtify([1, ...])
            const arr = JSON.parse(value);
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
            return "";
          }
        },
        errorMessage: "page_category_ids must be a numeric array",
      },
      // toArray: true,
      // isArray: {
      //   errorMessage: "page_ids is not arrray!",
      // },
    },
    location_ids: {
      in: "body",
      exists: {
        errorMessage: "location_ids does not exists!",
      },
      custom: {
        options: (value) => {
          try {
            const arr = JSON.parse(value);
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
            return "";
          }
        },
        errorMessage: "location_ids must be a numeric array",
      },
      // isArray: { errorMessage: "location_id is not array!" },
    },
  });

  static edit = checkSchema({
    id: {
      in: "body",
      exists: {
        errorMessage: "id does not exists!",
      },
      isNumeric: { errorMessage: "id is not numeric!" },
    },
    title: {
      in: "body",
      optional: true,
      isString: {
        errorMessage: "title must be string!",
      },
      trim: true,
      isLength: {
        options: { min: 1 },
        errorMessage: "title length must be minimum 1 character",
      },
    },
    description: {
      in: "body",
      optional: true,
      isString: {
        errorMessage: "description must be string!",
      },
      trim: true,
      isLength: {
        options: { min: 1 },
        errorMessage: "description length must be minimum 1 character",
      },
    },
    url: {
      in: "body",
      optional: true,
      isString: {
        errorMessage: "url must be string!",
      },
      // isURL: {
      //   errorMessage: "url is not an URL!",
      // },
      isLength: {
        options: { max: 256 },
        errorMessage: "url length must be below 256 characters",
      },
    },
    start_date: {
      in: "body",
      optional: true,
      isISO8601: {
        errorMessage: "start_date is not in ISO8601!",
      },
    },
    end_date: {
      in: "body",
      optional: true,
      isISO8601: {
        errorMessage: "end_date is not in ISO8601!",
      },
    },
    platform_id: {
      in: "body",
      optional: true,
      isNumeric: {
        errorMessage: "platform_id is not numeric!",
      },
    },
    page_category_ids: {
      in: "body",
      optional: true,
      custom: {
        options: (value) => {
          try {
            // VALUE must be JSON.stringtify([1, ...])
            const arr = JSON.parse(value);
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
            return "";
          }
        },
        errorMessage: "page_category_ids must be a numeric array",
      },
    },
    location_ids: {
      in: "body",
      optional: true,
      custom: {
        options: (value) => {
          try {
            const arr = JSON.parse(value);
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
            return "";
          }
        },
        errorMessage: "location_ids must be a numeric array",
      },
      // isArray: { errorMessage: "location_id is not array!" },
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
}
