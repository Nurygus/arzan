import { PostDAO } from "@/db/admin/post";
import {
  AdminPostApproveRequest,
  AdminPostDeleteRequest,
  AdminPostGetPublicationTypeRequest,
  AdminPostListRequest,
  AdminPostRequest,
  AdminPostSetPublicationTypeRequest,
  AdminPostUpdateRequest,
} from "@/types/request/admin/post";
import { ApiResponse } from "@/types/response";
import { ApiPostResponse } from "@/types/response/post";

export class AdminPostServices {
  postDAO: PostDAO;
  constructor() {
    this.postDAO = new PostDAO();
  }

  post = async (
    body: AdminPostRequest,
    files: string[],
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.postDAO.post(body, files);

    return result;
  };

  list = async (
    query: AdminPostListRequest,
  ): Promise<ApiResponse<ApiPostResponse[]>> => {
    const result = await this.postDAO.list(query);

    return result;
  };

  get = async (id: string): Promise<ApiResponse<ApiPostResponse>> => {
    const result = await this.postDAO.get(id);

    return result;
  };

  delete = async (
    body: AdminPostDeleteRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.postDAO.delete(body);

    return result;
  };

  approve = async (
    id: string,
    body: AdminPostApproveRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.postDAO.approve(id, body);

    return result;
  };

  setPublicationType = async (
    body: AdminPostSetPublicationTypeRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.postDAO.setPublicationType(body);
    return result;
  };

  getPublicationType = async (
    body: AdminPostGetPublicationTypeRequest,
  ): Promise<any> => {
    const result = await this.postDAO.getPublicationType(body);
    return result;
  };

  update = async (
    body: AdminPostUpdateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.postDAO.update(body);
    return result;
  };
}
