import { UserVideoDAO } from "@/db/video";
import {
  UserVideoGetRequest,
  UserVideoLikeRequest,
  UserVideoListRequest,
  UserVideoViewRequest,
} from "@/types/request/video";
import { ApiResponse } from "@/types/response";

export class UserVideoServices {
  userVideoDAO: UserVideoDAO;
  constructor() {
    this.userVideoDAO = new UserVideoDAO();
  }

  get = async (body: UserVideoGetRequest): Promise<ApiResponse<any>> => {
    const result = await this.userVideoDAO.get(body);
    return result;
  };

  list = async (body: UserVideoListRequest): Promise<ApiResponse<any[]>> => {
    const result = await this.userVideoDAO.list(body);
    return result;
  };

  like = async (
    body: UserVideoLikeRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.userVideoDAO.like(body);
    return result;
  };

  getBadgeCount = async (
    session: any,
    lastFetchedDate?: number,
  ): Promise<ApiResponse<{ count: number }>> => {
    const result = await this.userVideoDAO.getBadgeCount(
      session,
      lastFetchedDate,
    );
    return result;
  };

  view = async (
    body: UserVideoViewRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.userVideoDAO.view(body);
    return result;
  };
}
