import { AdminUserProfileDB } from "./utils";
import { ApiResponse } from "@/types/response";
import {
  AdminDeleteUserRequest,
  AdminGetFollowRewardRequest,
  AdminListFollowRewardRequest,
  AdminListTopListLimitRequest,
  AdminSetFollowRewardRequest,
  AdminSetTopListLimitRequest,
  AdminUserDayStreakCoinRewardSetRequest,
} from "@/types/request/admin/user-profile";

export class AdminUserProfileDAO {
  private user: AdminUserProfileDB;
  constructor() {
    this.user = new AdminUserProfileDB();
  }

  listFollowReward = async (
    body: AdminListFollowRewardRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: any[];
  }> => {
    const result = await this.user.listFollowReward(body);
    return result;
  };

  getFollowReward = async (
    body: AdminGetFollowRewardRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: any;
  }> => {
    const result = await this.user.getFollowReward(body);
    return result;
  };

  setFollowReward = async (
    body: AdminSetFollowRewardRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.user.setFollowReward(body);
    return result;
  };

  setTopListLimit = async (
    body: AdminSetTopListLimitRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.user.setTopListLimit(body);
    return result;
  };

  listTopListLimit = async (
    body: AdminListTopListLimitRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: any[];
  }> => {
    const result = await this.user.listTopListLimit(body);
    return result;
  };

  delteUser = async (
    body: AdminDeleteUserRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.user.delteUser(body);
    return result;
  };

  setDayStreakCoinReward = async (
    body: AdminUserDayStreakCoinRewardSetRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.user.setDayStreakCoinReward(body);
    return result;
  };
}
