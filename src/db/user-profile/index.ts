import { UserProfileDB } from "./utils";
import { ApiResponse } from "@/types/response";
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

export class UserProfileDAO {
  private user: UserProfileDB;

  constructor() {
    this.user = new UserProfileDB();
  }

  list = async (body: UserProfileListRequest): Promise<any[]> => {
    const result = await this.user.list(body);
    return result;
  };

  get = async (body: UserProfileGetRequest): Promise<any> => {
    const result = await this.user.get(body);
    return result;
  };

  update = async (
    body: UserProfileUpdateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.user.update(body);
    return result;
  };

  setAvatar = async (
    body: UserProfileSetAvatarRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.user.setAvatar(body);
    return result;
  };

  follow = async (body: UserFollowRequest): Promise<ApiResponse<undefined>> => {
    const result = await this.user.follow(body);
    return result;
  };

  unFollow = async (
    body: UserUnFollowRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.user.unFollow(body);
    return result;
  };

  setDayStreak = async (
    body: UserDayStreakSetRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.user.setDayStreak(body);
    return result;
  };

  listDayStreakCoinReward = async (
    body: UserDayStreakCoinRewardListRequest,
  ): Promise<ApiResponse<any[]>> => {
    const result = await this.user.listDayStreakCoinReward(body);
    return result;
  };

  addUserProfileBackgroundImage = async (
    body: UserProfileBackgroundImageAddRequest,
  ): Promise<ApiResponse<any>> => {
    const result = await this.user.addUserProfileBackgroundImage(body);
    return result;
  };

  deleteUserProfileBackgroundImage = async (
    body: UserProfileBackgroundImageDeleteRequest,
  ): Promise<ApiResponse<any>> => {
    const result = await this.user.deleteUserProfileBackgroundImage(body);
    return result;
  };
}
