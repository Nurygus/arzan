import { checkSchema } from "express-validator";
import dotenv from "dotenv";

dotenv.config();

const STAT_PASS = `${process.env.STAT_PASS}`;

export class AuthValidator {
  static signupValidator = checkSchema({
    name: {
      in: "body",
      exists: {
        errorMessage: "Check your input data!",
      },
      isString: {
        errorMessage: "Check your input data!",
      },
      isLength: {
        options: {
          min: 5,
        },
        errorMessage: "Username must be at least 8 characters long",
      },
    },
    phone: {
      in: "body",
      exists: {
        errorMessage: "Check your input data!",
      },
      isString: {
        errorMessage: "Check your input data!",
      },
      matches: {
        options: /^[+][9]{2}[3][6][1-5][0-9]{6}$/,
        errorMessage: "Not a valid phone number!",
      },
    },
    password: {
      exists: {
        errorMessage: "Check your input data!",
      },
      isString: {
        errorMessage: "Check your input data!",
      },
      isLength: {
        options: {
          min: 6,
          max: 15,
        },
        errorMessage:
          "Password length must be at least 8 and below 16 characters",
      },
      // isStrongPassword: {
      //   options: {
      //     minLowercase: 1,
      //     minUppercase: 1,
      //     minNumbers: 1,
      //     minSymbols: 1,
      //   },
      //   errorMessage:
      //     "Password must contain at least one lowercase, uppercase, digit and special character",
      // },
      in: "body",
    },
  });

  static loginValidator = checkSchema({
    phone: {
      in: "body",
      exists: {
        errorMessage: "Check your input data!",
      },
      isString: {
        errorMessage: "Check your input data!",
      },
      matches: {
        options: /^[+][9]{2}[3][6][1-5][0-9]{6}$/,
        errorMessage: "Not a valid phone number!",
      },
    },
    password: {
      in: "body",
      exists: {
        errorMessage: "Check your input data!",
      },
      isString: {
        errorMessage: "Check your input data!",
      },
      isLength: {
        options: {
          min: 6,
          max: 15,
        },
        errorMessage:
          "Password length must be at least 8 and below 16 characters",
      },
      // isStrongPassword: {
      //   options: {
      //     minLowercase: 1,
      //     minUppercase: 1,
      //     minNumbers: 1,
      //     minSymbols: 1,
      //   },
      //   errorMessage:
      //     "Password must contain at least one lowercase, uppercase, digit and special character",
      // },
    },
  });

  static accountVerifyValidator = checkSchema({
    phone: {
      in: "body",
      exists: {
        errorMessage: "Check your input data!",
      },
      isString: {
        errorMessage: "Check your input data!",
      },
      matches: {
        options: /^[+][9]{2}[3][6][1-5][0-9]{6}$/,
        errorMessage: "Not a valid phone number!",
      },
    },
    statpass: {
      in: "body",
      exists: {
        errorMessage: "Check your input data!",
      },
      isString: {
        errorMessage: "Check your input data!",
      },
      equals: {
        options: STAT_PASS,
        errorMessage: "Check your input data",
      },
    },

    recover: {
      in: "body",
      exists: {
        errorMessage: "Check your input data!",
      },
      isBoolean: {
        errorMessage: "Check your input data!",
      },
    },
  });

  static accountVerifyCheckValidator = checkSchema({
    phone: {
      in: "body",
      exists: {
        errorMessage: "Check your input data!",
      },
      isString: {
        errorMessage: "Check your input data!",
      },
      matches: {
        options: /^[+][9]{2}[3][6][1-5][0-9]{6}$/,
        errorMessage: "Not a valid phone number!",
      },
    },
  });

  static passwordRecoveryValidator = checkSchema({
    phone: {
      in: "body",
      exists: {
        errorMessage: "Check your input data!",
      },
      isString: {
        errorMessage: "Check your input data!",
      },
      matches: {
        options: /^[+][9]{2}[3][6][1-5][0-9]{6}$/,
        errorMessage: "Not a valid phone number!",
      },
    },
    password: {
      in: "body",
      exists: {
        errorMessage: "Check your input data!",
      },
      isLength: {
        options: {
          min: 6,
        },
        errorMessage: "Password must be at least 6 characters long!",
      },
    },
  });
}
