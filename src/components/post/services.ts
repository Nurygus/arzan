import { PostDAO } from "@/db/post";
import {
  ApiPostDeleteRequest,
  ApiPostListRequest,
  ApiPostRequest,
  UserPostGetRequest,
  UserPostLikeRequest,
  UserPostUpdateRequest,
  UserPostViewRequest,
} from "@/types/request/post";
import { ApiResponse } from "@/types/response";
import { ApiPostResponse } from "@/types/response/post";

export class PostServices {
  postDAO: PostDAO;
  constructor() {
    this.postDAO = new PostDAO();
  }

  post = async (
    body: ApiPostRequest,
    files: string[],
    userId: number,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.postDAO.post(body, files, userId);

    return result;
  };

  list = async (
    query: ApiPostListRequest,
  ): Promise<ApiResponse<ApiPostResponse[]>> => {
    const result = await this.postDAO.list(query);

    return result;
  };

  get = async (
    body: UserPostGetRequest,
  ): Promise<ApiResponse<ApiPostResponse>> => {
    const result = await this.postDAO.get(body);
    return result;
  };

  like = async (body: UserPostLikeRequest): Promise<ApiResponse<undefined>> => {
    const result = await this.postDAO.like(body);
    return result;
  };

  getBadgeCount = async (
    session: any,
    lastFetchedDate?: number,
    publicationTypeId?: number,
  ): Promise<ApiResponse<{ count: number }>> => {
    const result = await this.postDAO.getBadgeCount(
      session,
      lastFetchedDate,
      publicationTypeId,
    );
    return result;
  };

  view = async (body: UserPostViewRequest): Promise<ApiResponse<undefined>> => {
    const result = await this.postDAO.view(body);
    return result;
  };

  delete = async (
    body: ApiPostDeleteRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.postDAO.delete(body);

    return result;
  };

  update = async (
    body: UserPostUpdateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.postDAO.update(body);
    return result;
  };
}
