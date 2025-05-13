import { checkUserPassword, generateAccessToken, getUserRole } from "./login";
import {
  deleteUser,
  getUserIdByPhone,
  insertAuthUser,
  insertPhone,
  isPhoneExists,
  isUnverifiedUser,
  isUserWithUsernameExists,
} from "./signup";
import { changePassword } from "./reset-password";
import {
  passwordRecoverRequested,
  recoverPassword,
  removeRecoverPassword,
  subscribeAsUser,
  verifyUser,
} from "./verify";
import { ApiResponse } from "@/types/response";
import type {
  AuthAccountLoginRequest,
  AuthAccountVerifyCheckRequest,
  AuthAccountVerifyRequest,
  AuthPasswordRecoveryRequest,
  AuthSignUpRequest,
} from "@/types/request/auth";

export class AuthDAO {
  signup = async (
    body: AuthSignUpRequest,
  ): Promise<{ status: boolean; message: string }> => {
    const { name, phone } = body;

    const addUnverifiedUser = async () => {
      const isUsernameExist = await isUserWithUsernameExists(name);

      if (isUsernameExist) {
        return false;
      }

      const userId = await insertAuthUser(body);

      await Promise.all([insertPhone({ user_id: userId, phone })]);

      return true;
    };

    const phoneExists = await isPhoneExists(phone);

    if (!phoneExists) {
      const success = await addUnverifiedUser();
      if (!success) {
        return {
          message: "User with this username already exists!",
          status: false,
        };
      }
      return {
        message: "Success, verify your account to proceed!",
        status: true,
      };
    }

    const userId = await getUserIdByPhone(phone);
    const isUnverified = await isUnverifiedUser(userId);
    if (isUnverified) {
      await Promise.all([await deleteUser(userId), await addUnverifiedUser()]);

      return {
        message: "Success, verify your account to proceed",
        status: true,
      };
    }

    return {
      message: "You are already signed up verify your account to proceed!",
      status: false,
    };
  };

  login = async (
    body: AuthAccountLoginRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: { token: string };
  }> => {
    const { phone, password } = body;

    const phoneExists = await isPhoneExists(phone);

    if (!phoneExists) {
      return {
        status: false,
        message: "Register first to login!",
      };
    }

    const userId = await getUserIdByPhone(phone);
    const isUnverified = await isUnverifiedUser(userId);
    if (isUnverified) {
      return {
        status: false,
        message: "Verify your account to login!",
      };
    }

    const validPassword = await checkUserPassword(userId, password);
    if (!validPassword) {
      return {
        status: false,
        message: "Entered password is incorrect!",
      };
    }

    const subscriptionType = await getUserRole(userId);

    const accessToken = generateAccessToken(userId, subscriptionType);

    return {
      status: true,
      message: "Successfully logged in!",
      data: {
        token: accessToken,
      },
    };
  };

  accountVerify = async (body: AuthAccountVerifyRequest): Promise<boolean> => {
    const { phone, recover } = body;

    const phoneExists = await isPhoneExists(phone);

    if (!phoneExists) {
      return false;
    }

    const userId = await getUserIdByPhone(phone);

    const recoverRequested = await passwordRecoverRequested(userId);

    if (recover && recoverRequested) {
      return true;
    }

    if (recover) {
      await recoverPassword(userId);
      return true;
    }

    const isUnverified = await isUnverifiedUser(userId);

    if (isUnverified) {
      await subscribeAsUser(userId);
      await verifyUser(userId);

      return true;
    }

    return true;
  };

  accountVerifyCheck = async (
    body: AuthAccountVerifyCheckRequest,
  ): Promise<boolean> => {
    const { phone } = body;

    const phoneExists = await isPhoneExists(phone);

    if (!phoneExists) {
      return false;
    }

    const userId = await getUserIdByPhone(phone);
    const isUnverified = await isUnverifiedUser(userId);

    if (!isUnverified) {
      return true;
    }

    return false;
  };

  recoverVerifyCheck = async (
    body: AuthAccountVerifyCheckRequest,
  ): Promise<ApiResponse<undefined>> => {
    const { phone } = body;

    const phoneExists = await isPhoneExists(phone);

    if (!phoneExists) {
      return {
        status: false,
        message: "Phone number not registered!",
      };
    }

    const userId = await getUserIdByPhone(phone);
    const recoveryRequested = await passwordRecoverRequested(userId);

    if (!recoveryRequested) {
      return {
        status: false,
        message: "Password recovery not requested!",
      };
    }

    return {
      status: true,
      message: "Password recovery verified!",
    };
  };

  userExists = async (
    body: AuthAccountVerifyCheckRequest,
  ): Promise<ApiResponse<undefined>> => {
    const { phone } = body;

    const phoneExists = await isPhoneExists(phone);

    if (!phoneExists) {
      return {
        status: false,
        message: "Phone number not registered!",
      };
    }

    return {
      status: true,
      message: "Phone number registered!",
    };
  };

  recoverPassword = async (
    body: AuthPasswordRecoveryRequest,
  ): Promise<ApiResponse<undefined>> => {
    try {
      const { phone, password } = body;

      const phoneExists = await isPhoneExists(phone);

      if (!phoneExists) {
        return {
          status: false,
          message: "User with this phone doesn't exists!",
        };
      }

      const userId = await getUserIdByPhone(phone);

      const recoverRequested = await passwordRecoverRequested(userId);

      if (!recoverRequested) {
        return {
          status: false,
          message: "Recover not requested!",
        };
      }

      await changePassword(userId, password);
      await removeRecoverPassword(userId);

      return {
        status: true,
        message: "Password recovery completed successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  };
}
