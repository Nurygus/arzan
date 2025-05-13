import { NextFunction, Request, Response } from "express";

import HttpStatus, {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  REQUEST_TIMEOUT,
} from "http-status/lib";
import { TimeOutError } from "@/helpers/error";
import { apiResponse } from "@/helpers/apiResponse";

export const notFoundError = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(NOT_FOUND).json({
    error: {
      code: NOT_FOUND,
      message: HttpStatus[NOT_FOUND],
      path: req.originalUrl,
    },
  });
};

export const genericErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let resCode: number = err.status || INTERNAL_SERVER_ERROR;
  let resBody = err.message;

  if (err.code === "ETIMEDOUT") {
    resCode = REQUEST_TIMEOUT;
    resBody = new TimeOutError(req.originalUrl);
  }

  res.status(resCode).json(
    apiResponse({
      status: false,
      message: resBody,
    }),
  );
};
