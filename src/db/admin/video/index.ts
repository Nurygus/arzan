import { VideoDB } from "./utils";
import { ApiResponse } from "@/types/response";
import {
  AdminVideoCreateRequest,
  AdminVideoDeleteRequest,
  AdminVideoEditRequest,
  AdminVideoGetPublicationTypeRequest,
  AdminVideoGetRequest,
  AdminVideoListRequest,
  AdminVideoSetPublicationTypeRequest,
} from "@/types/request/admin/video";

export class AdminVideoDAO {
  private video: VideoDB;

  constructor() {
    this.video = new VideoDB();
  }
  create = async (
    body: AdminVideoCreateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.video.post(body);
    return result;
  };

  edit = async (body: AdminVideoEditRequest): Promise<ApiResponse<any>> => {
    const result = await this.video.edit(body);
    return result;
  };

  get = async (body: AdminVideoGetRequest): Promise<any> => {
    const result = await this.video.get(body);
    return result;
  };

  delete = async (
    body: AdminVideoDeleteRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.video.delete(body);
    return result;
  };

  list = async (body: AdminVideoListRequest): Promise<any[]> => {
    const result = await this.video.list(body);
    return result;
  };

  setPublicationType = async (
    body: AdminVideoSetPublicationTypeRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.video.setPublicationType(body);
    return result;
  };

  getPublicationType = async (
    body: AdminVideoGetPublicationTypeRequest,
  ): Promise<any> => {
    const result = await this.video.getPublicationType(body);
    return result;
  };
}
