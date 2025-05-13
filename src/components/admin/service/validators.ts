import { checkSchema } from "express-validator";
import { serviceLocationData } from "@/types/request/admin/service";

export class AdminServiceValidator {
  static postValidator = checkSchema({
    name: {
      in: "body",
      exists: {
        errorMessage: "name does not exist!",
      },
      isString: {
        errorMessage: "Name must be type of string!",
      },
      isLength: {
        options: {
          min: 3,
        },
        errorMessage: "Name length must be at least 3 characters!",
      },
    },
    cost: {
      in: "body",
      exists: {
        errorMessage: "Cost doesn't exists!",
      },
      isNumeric: {
        errorMessage: "Cost is not numeric!",
      },
    },
    count: {
      in: "body",
      isBoolean: {
        errorMessage: "Count is not boolean!",
      },
    },
    month: {
      optional: true,
      in: "body",
      isBoolean: {
        errorMessage: "month is not boolean!",
      },
    },
    month_cost: {
      optional: true,
      in: "body",
      isNumeric: {
        errorMessage: "month_cost is not numeric!",
      },
    },
    location_costs: {
      optional: true,
      in: "body",
      custom: {
        options: (value) => {
          try {
            const arr = JSON.parse(value);

            for (let i = 0; i < arr.length; i++) {
              const temp = arr[i] as serviceLocationData;
              if (!temp) {
                return "";
              }
            }
            return value;
          } catch (_) {
            return "";
          }
        },
        errorMessage:
          "location_costs must be array or json array of location data",
      },
    },
  });
}
