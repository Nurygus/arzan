import { checkSchema } from "express-validator";

export class AdminUserProfileValidator {
  static listFollowReward = checkSchema({
    subscription_type_id: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "subscription_type_id is not numeric!" },
    },
    location_id: {
      optional: true,
      in: "query",
      isNumeric: { errorMessage: "location_id is not numeric!" },
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

  static getFollowReward = checkSchema({
    subscription_type_id: {
      in: "query",
      exists: {
        errorMessage: "subscription_type_id does not exists!",
      },
      isNumeric: { errorMessage: "subscription_type_id is not numeric!" },
    },
    location_id: {
      in: "query",
      exists: {
        errorMessage: "location_id does not exists!",
      },
      isNumeric: { errorMessage: "location_id is not numeric!" },
    },
  });

  static setFollowReward = checkSchema({
    subscription_type_id: {
      in: "body",
      exists: {
        errorMessage: "subscription_type_id does not exist!",
      },
      isNumeric: {
        errorMessage: "subscription_type_id must be numeric!",
      },
    },
    location_id: {
      in: "body",
      exists: {
        errorMessage: "location_id does not exist!",
      },
      isNumeric: {
        errorMessage: "location_id must be numeric!",
      },
    },
    coin_amount: {
      in: "body",
      exists: {
        errorMessage: "coin_amount does not exist!",
      },
      isNumeric: {
        errorMessage: "coin_amount must be numeric!",
      },
    },
  });

  static setTopListLimit = checkSchema({
    limit_count: {
      in: "body",
      exists: {
        errorMessage: "limit_count does not exist!",
      },
      isNumeric: {
        errorMessage: "limit_count must be numeric!",
      },
    },
    name: {
      in: "body",
      exists: {
        errorMessage: "name does not exist!",
      },
      isString: {
        errorMessage: "name must be string!",
      },
      trim: true,
      isLength: {
        options: { min: 1 },
        errorMessage: "name length must be minimum 1 character",
      },
    },
  });

  static listTopListLimit = checkSchema({});

  static delteUser = checkSchema({
    id: {
      in: "params",
      exists: {
        errorMessage: "id does not exists!",
      },
      isNumeric: { errorMessage: "id is not numeric!" },
    },
  });

  static setDayStreakCoinReward = checkSchema({
    day_id: {
      in: "body",
      exists: {
        errorMessage: "day_id does not exist!",
      },
      isNumeric: {
        errorMessage: "day_id must be numeric!",
      },
    },
    coin_amount: {
      in: "body",
      exists: {
        errorMessage: "coin_amount does not exist!",
      },
      isNumeric: {
        errorMessage: "coin_amount must be numeric!",
      },
    },
  });
}
