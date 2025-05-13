import { NextFunction, Request, Response } from "express";
import { UNAUTHORIZED, FORBIDDEN } from "http-status/lib";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { apiResponse } from "@/helpers/apiResponse";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export const userAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;
    if (!token) {
      return res
        .status(UNAUTHORIZED)
        .send(
          apiResponse({ status: false, message: "Access token is required" }),
        );
    }
    const decodedData = jwt.verify(token!, JWT_SECRET);
    if (!decodedData) {
      return res
        .status(FORBIDDEN)
        .send(apiResponse({ message: "Access token is broken!" }));
    }
    return next();
  } catch (e) {
    return res
      .status(FORBIDDEN)
      .send(apiResponse({ status: false, message: "Invalid token error" }));
  }
};
