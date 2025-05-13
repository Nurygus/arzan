import { checkSchema } from "express-validator";

export class UserProfileValidator {
  static listValidator = checkSchema({
    location_id: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "location_id is not numeric!" },
    },
    subscription_type_id: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "subscription_type_id is not numeric!" },
    },
    subscription_type: {
      optional: true,
      in: "query",
      isString: { errorMessage: "subscription_type is not string!" },
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
  static getValidator = checkSchema({
    id: {
      in: "params",
      exists: {
        errorMessage: "id does not exists!",
      },
      isNumeric: { errorMessage: "id is not numeric!" },
    },
  });
  static update = checkSchema({
    name: {
      optional: true,
      in: "body",
      isString: { errorMessage: "name is not string!" },
      trim: true,
      isLength: {
        options: { min: 1 },
        errorMessage: "name length must be minimum 1 character",
      },
    },
    about: {
      optional: true,
      in: "body",
      isString: { errorMessage: "about is not string!" },
    },
  });
  static followValidator = checkSchema({
    id: {
      in: "body",
      isNumeric: { errorMessage: "id is not numeric!" },
    },
  });
  static unFollowValidator = checkSchema({
    id: {
      in: "body",
      isNumeric: { errorMessage: "id is not numeric!" },
    },
  });
  static setDayStreak = checkSchema({});
  static listDayStreakCoinReward = checkSchema({});
  static addUserProfileBackgroundImage = checkSchema({});
  static deleteUserProfileBackgroundImage = checkSchema({
    image_ids: {
      in: "body",
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
        errorMessage: "image_ids must be a numeric array",
      },
    },
  });
}
