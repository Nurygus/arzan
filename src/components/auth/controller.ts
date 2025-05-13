import { BAD_REQUEST, OK } from "http-status/lib";
import { AuthServices } from "./services";
import {
  AuthAccountLoginRequest,
  AuthAccountVerifyCheckRequest,
  AuthAccountVerifyRequest,
  AuthPasswordRecoveryRequest,
  AuthSignUpRequest,
} from "@/types/request/auth";
import { apiResponse } from "@/helpers/apiResponse";

export class AuthController {
  static signup = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AuthSignUpRequest;
      const authServices = new AuthServices();
      const result = await authServices.signup(requestBody);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(
          apiResponse({
            message: result.message,
            status: false,
          }),
        );
      }

      res.status(OK).json(
        apiResponse({
          message: result.message,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };

  static login = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AuthAccountLoginRequest;
      const authServices = new AuthServices();
      const result = await authServices.login(requestBody);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(
          apiResponse({
            status: false,
            message: result.message,
          }),
        );
      }

      res.status(OK).json(
        apiResponse({
          message: result.message,
          data: result.data,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };

  static accountVerify = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AuthAccountVerifyRequest;
      const authServices = new AuthServices();
      const result = await authServices.accountVerify(requestBody);

      if (!result) {
        return res.status(BAD_REQUEST).json(
          apiResponse({
            status: false,
          }),
        );
      }

      res.status(OK).json(
        apiResponse({
          status: true,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };

  static accountVerifyCheck = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AuthAccountVerifyCheckRequest;
      const authServices = new AuthServices();
      const result = await authServices.accountVerifyCheck(requestBody);

      if (!result) {
        return res.status(BAD_REQUEST).json(
          apiResponse({
            status: false,
          }),
        );
      }

      res.status(OK).json(
        apiResponse({
          status: true,
        }),
      );
    } catch (error) {
      return next(error);
    }
  };

  static recoverVerifyCheck = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AuthAccountVerifyCheckRequest;
      const authServices = new AuthServices();
      const result = await authServices.recoverVerifyCheck(requestBody);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static userExists = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AuthAccountVerifyCheckRequest;
      const authServices = new AuthServices();
      const result = await authServices.userExists(requestBody);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };

  static resetPassword = async (req: Req, res: Res, next: NextFn) => {
    try {
      const requestBody = req.body as AuthPasswordRecoveryRequest;
      const authServices = new AuthServices();
      const result = await authServices.resetPassword(requestBody);

      if (!result.status) {
        return res.status(BAD_REQUEST).json(apiResponse(result));
      }

      res.status(OK).json(apiResponse(result));
    } catch (error) {
      return next(error);
    }
  };
}
