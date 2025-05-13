import { checkSchema } from "express-validator";

export const adminLoginValidator = checkSchema({
  email: {
    exists: {
      errorMessage: "email does not exists!",
    },
    isString: {
      errorMessage: "email is not string!",
    },
    isEmail: {
      errorMessage: "email is not valid!",
    },
  },
  password: {
    exists: {
      errorMessage: "password does not exists!",
    },
    isString: {
      errorMessage: "password is not string!",
    },
    isLength: {
      options: {
        min: 8,
        max: 15,
      },
      errorMessage:
        "password length must be at least 8 and below 16 characters",
    },
    isStrongPassword: {
      options: {
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      },
      errorMessage:
        "password must contain at least one lowercase, uppercase, digit and special character",
    },
    in: "body",
  },
});
