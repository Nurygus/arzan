import { Result, ValidationChain, validationResult } from "express-validator";
import { Middleware as ValidatorMiddleware } from "express-validator/src/base";
import { apiResponse } from "./apiResponse";

type MultiValidatorChain = ValidatorMiddleware & {
  run: (req: Request) => Promise<Result>;
};

const catchValidatorError = (req: Req, res: Res, next: NextFn): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map((value) => value.msg);
    res.status(400).json(
      apiResponse({
        status: false,
        message: errorMsg[0],
      }),
    );
  }
  next();
};

export const sanitizer = (
  validator: (ValidationChain | MultiValidatorChain)[],
) => [...validator, catchValidatorError];
