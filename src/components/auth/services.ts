import { AuthDAO } from "@/db/auth";
import {
  AuthAccountLoginRequest,
  AuthAccountVerifyCheckRequest,
  AuthAccountVerifyRequest,
  AuthPasswordRecoveryRequest,
  AuthSignUpRequest,
} from "@/types/request/auth";
import { ApiResponse } from "@/types/response";

export class AuthServices {
  authDAO: AuthDAO;
  constructor() {
    this.authDAO = new AuthDAO();
  }

  signup = async (
    body: AuthSignUpRequest,
  ): Promise<{
    status: boolean;
    message: string;
  }> => {
    const result = await this.authDAO.signup(body);

    return result;
  };

  login = async (
    body: AuthAccountLoginRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: {
      token: string;
    };
  }> => {
    const result = await this.authDAO.login(body);

    return result;
  };

  accountVerify = async (body: AuthAccountVerifyRequest): Promise<boolean> => {
    const result = await this.authDAO.accountVerify(body);

    return result;
  };

  accountVerifyCheck = async (
    body: AuthAccountVerifyCheckRequest,
  ): Promise<boolean> => {
    const result = await this.authDAO.accountVerifyCheck(body);

    return result;
  };

  recoverVerifyCheck = async (
    body: AuthAccountVerifyCheckRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.authDAO.recoverVerifyCheck(body);

    return result;
  };

  userExists = async (
    body: AuthAccountVerifyCheckRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.authDAO.userExists(body);

    return result;
  };

  resetPassword = async (
    body: AuthPasswordRecoveryRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.authDAO.recoverPassword(body);

    return result;
  };
}
