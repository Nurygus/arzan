import { AdminAuthDAO } from "@/db/admin/auth";
import { AdminAuthLoginRequest } from "@/types/request/admin/auth";

export class AdminAuthServices {
  adminAuthDAO: AdminAuthDAO;
  constructor() {
    this.adminAuthDAO = new AdminAuthDAO();
  }

  login = async (
    body: AdminAuthLoginRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: {
      token: string;
    };
  }> => {
    const result = await this.adminAuthDAO.login(body);

    return result;
  };
}
