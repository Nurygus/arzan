import { checkAdminPassword, generateAccessToken } from "./utils";
import type { AdminAuthLoginRequest } from "@/types/request/admin/auth";

export class AdminAuthDAO {
  login = async (
    body: AdminAuthLoginRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: { token: string };
  }> => {
    const adminData = await checkAdminPassword(body);

    if (adminData) {
      const accessToken = generateAccessToken(adminData.id);
      return {
        status: true,
        message: "Successfully logged in!",
        data: {
          token: accessToken,
        },
      };
    }
    return {
      message: "Check your input data!",
      status: false,
    };
  };
}
