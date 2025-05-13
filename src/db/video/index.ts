import { VideoDB } from "./utils";
import { ApiResponse } from "@/types/response";
import {
  UserVideoGetRequest,
  UserVideoLikeRequest,
  UserVideoListRequest,
  UserVideoViewRequest,
} from "@/types/request/video";

export class UserVideoDAO {
  private video: VideoDB;

  constructor() {
    this.video = new VideoDB();
  }

  get = async (body: UserVideoGetRequest): Promise<ApiResponse<any>> => {
    const result = await this.video.get(body);
    return result;
  };

  list = async (body: UserVideoListRequest): Promise<ApiResponse<any[]>> => {
    const result = await this.video.list(body);
    return result;
  };

  like = async (
    body: UserVideoLikeRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.video.like(body);
    return result;
  };

  getBadgeCount = async (
    session: any,
    lastFetchedDate?: number,
  ): Promise<ApiResponse<{ count: number }>> => {
    const result = await this.video.getBadgeCount(session, lastFetchedDate);
    return result;
  };

  view = async (
    body: UserVideoViewRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.video.view(body);
    return result;
  };
}
