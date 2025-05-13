import { checkSchema } from "express-validator";

export class ApiServiceRequestValidator {
  static postValidator = checkSchema({
    service_id: {
      in: "body",
      exists: {
        errorMessage: "Service id doesn't exists!",
      },
    },
    location_ids: {
      in: "body",
      exists: {
        errorMessage: "Location ids doesn't exists!",
      },
      isArray: {
        options: {
          min: 1,
        },
        errorMessage: "Location ids is not array!",
      },
      custom: {
        options(value: any[]) {
          if (!value.every(Number.isInteger))
            throw new Error("Location ids is not numeric!");
          return true;
        },
      },
    },
    count: {
      optional: true,
      in: "body",
      isNumeric: {
        errorMessage: "Count is not numeric!",
      },
    },
    active_time: {
      in: "body",
      exists: {
        errorMessage: "Active time doesn't exists!",
      },
      isISO8601: {
        errorMessage: "Incorrect timestamp!",
      },
    },
    month: {
      optional: true,
      in: "body",
      isNumeric: {
        errorMessage: "month is not numeric!",
      },
    },
  });
}
