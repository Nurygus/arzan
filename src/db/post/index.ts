import { PostDB } from "./query";
import { ApiResponse } from "@/types/response";
import {
  ApiPostDeleteRequest,
  ApiPostListRequest,
  ApiPostRequest,
  UserPostGetRequest,
  UserPostLikeRequest,
  UserPostUpdateRequest,
  UserPostViewRequest,
} from "@/types/request/post";
import { ApiPostResponse } from "@/types/response/post";

export class PostDAO {
  private postDB: PostDB;

  constructor() {
    this.postDB = new PostDB();
  }

  post = async (
    body: ApiPostRequest,
    images: string[],
    userId: number,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.postDB.post(body, images, userId);
    return result;
  };

  list = async (
    query: ApiPostListRequest,
  ): Promise<ApiResponse<ApiPostResponse[]>> => {
    const result = await this.postDB.list(query);
    return result;
  };

  get = async (
    body: UserPostGetRequest,
  ): Promise<ApiResponse<ApiPostResponse>> => {
    const result = await this.postDB.get(body);
    return result;
  };

  like = async (body: UserPostLikeRequest): Promise<ApiResponse<undefined>> => {
    const result = await this.postDB.like(body);
    return result;
  };

  getBadgeCount = async (
    session: any,
    lastFetchedDate?: number,
    publicationTypeId?: number,
  ): Promise<ApiResponse<{ count: number }>> => {
    const result = await this.postDB.getBadgeCount(
      session,
      lastFetchedDate,
      publicationTypeId,
    );
    return result;
  };

  view = async (body: UserPostViewRequest): Promise<ApiResponse<undefined>> => {
    const result = await this.postDB.view(body);
    return result;
  };

  delete = async (
    body: ApiPostDeleteRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.postDB.delete(body);
    return result;
  };

  update = async (
    body: UserPostUpdateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.postDB.update(body);
    return result;
  };
}
