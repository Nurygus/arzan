import { AdminUserProfileDAO } from "@/db/admin/user-profile";
import {
  AdminDeleteUserRequest,
  AdminGetFollowRewardRequest,
  AdminListFollowRewardRequest,
  AdminListTopListLimitRequest,
  AdminSetFollowRewardRequest,
  AdminSetTopListLimitRequest,
  AdminUserDayStreakCoinRewardSetRequest,
} from "@/types/request/admin/user-profile";
import { ApiResponse } from "@/types/response";

export class AdminUserProfileServices {
  adminUserProfileDAO: AdminUserProfileDAO;
  constructor() {
    this.adminUserProfileDAO = new AdminUserProfileDAO();
  }

  listFollowReward = async (
    body: AdminListFollowRewardRequest,
  ): Promise<{ status: boolean; message: string; data?: any[] }> => {
    const result = await this.adminUserProfileDAO.listFollowReward(body);

    return result;
  };

  getFollowReward = async (
    body: AdminGetFollowRewardRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: any;
  }> => {
    const result = await this.adminUserProfileDAO.getFollowReward(body);

    return result;
  };

  setFollowReward = async (
    body: AdminSetFollowRewardRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.adminUserProfileDAO.setFollowReward(body);

    return result;
  };

  setTopListLimit = async (
    body: AdminSetTopListLimitRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.adminUserProfileDAO.setTopListLimit(body);

    return result;
  };

  listTopListLimit = async (
    body: AdminListTopListLimitRequest,
  ): Promise<{ status: boolean; message: string; data?: any[] }> => {
    const result = await this.adminUserProfileDAO.listTopListLimit(body);

    return result;
  };

  delteUser = async (
    body: AdminDeleteUserRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: any;
  }> => {
    const result = await this.adminUserProfileDAO.delteUser(body);

    return result;
  };

  setDayStreakCoinReward = async (
    body: AdminUserDayStreakCoinRewardSetRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.adminUserProfileDAO.setDayStreakCoinReward(body);
    return result;
  };
}
