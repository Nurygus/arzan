import { UserProfileDAO } from "@/db/user-profile";
import {
  UserDayStreakCoinRewardListRequest,
  UserDayStreakSetRequest,
  UserFollowRequest,
  UserProfileBackgroundImageAddRequest,
  UserProfileBackgroundImageDeleteRequest,
  UserProfileGetRequest,
  UserProfileListRequest,
  UserProfileSetAvatarRequest,
  UserProfileUpdateRequest,
  UserUnFollowRequest,
} from "@/types/request/user-profile";
import { ApiResponse } from "@/types/response";

export class UserProfileServices {
  userDAO: UserProfileDAO;
  constructor() {
    this.userDAO = new UserProfileDAO();
  }
  list = async (body: UserProfileListRequest): Promise<any[]> => {
    const result = await this.userDAO.list(body);
    return result;
  };
  get = async (body: UserProfileGetRequest): Promise<any> => {
    const result = await this.userDAO.get(body);
    return result;
  };
  update = async (
    body: UserProfileUpdateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.userDAO.update(body);
    return result;
  };

  setAvatar = async (
    body: UserProfileSetAvatarRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.userDAO.setAvatar(body);
    return result;
  };

  follow = async (body: UserFollowRequest): Promise<ApiResponse<undefined>> => {
    const result = await this.userDAO.follow(body);
    return result;
  };

  unFollow = async (
    body: UserUnFollowRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.userDAO.unFollow(body);
    return result;
  };

  setDayStreak = async (
    body: UserDayStreakSetRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.userDAO.setDayStreak(body);
    return result;
  };

  listDayStreakCoinReward = async (
    body: UserDayStreakCoinRewardListRequest,
  ): Promise<ApiResponse<any[]>> => {
    const result = await this.userDAO.listDayStreakCoinReward(body);
    return result;
  };

  addUserProfileBackgroundImage = async (
    body: UserProfileBackgroundImageAddRequest,
  ): Promise<ApiResponse<any>> => {
    const result = await this.userDAO.addUserProfileBackgroundImage(body);
    return result;
  };

  deleteUserProfileBackgroundImage = async (
    body: UserProfileBackgroundImageDeleteRequest,
  ): Promise<ApiResponse<any>> => {
    const result = await this.userDAO.deleteUserProfileBackgroundImage(body);
    return result;
  };
}
