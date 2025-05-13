import { AdminVideoDAO } from "@/db/admin/video";
import {
  AdminVideoCreateRequest,
  AdminVideoDeleteRequest,
  AdminVideoEditRequest,
  AdminVideoGetPublicationTypeRequest,
  AdminVideoGetRequest,
  AdminVideoListRequest,
  AdminVideoSetPublicationTypeRequest,
} from "@/types/request/admin/video";
import { ApiResponse } from "@/types/response";
export class AdminVideoServices {
  adminVideoDAO: AdminVideoDAO;
  constructor() {
    this.adminVideoDAO = new AdminVideoDAO();
  }

  create = async (
    body: AdminVideoCreateRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: any;
  }> => {
    const result = await this.adminVideoDAO.create(body);

    return result;
  };

  edit = async (
    body: AdminVideoEditRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: any;
  }> => {
    const result = await this.adminVideoDAO.edit(body);
    return result;
  };

  get = async (
    body: AdminVideoGetRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: any;
  }> => {
    const result = await this.adminVideoDAO.get(body);

    return result;
  };

  delete = async (
    body: AdminVideoDeleteRequest,
  ): Promise<{
    status: boolean;
    message: string;
    data?: any;
  }> => {
    const result = await this.adminVideoDAO.delete(body);

    return result;
  };

  list = async (body: AdminVideoListRequest): Promise<any[]> => {
    const result = await this.adminVideoDAO.list(body);

    return result;
  };

  setPublicationType = async (
    body: AdminVideoSetPublicationTypeRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.adminVideoDAO.setPublicationType(body);

    return result;
  };

  getPublicationType = async (
    body: AdminVideoGetPublicationTypeRequest,
  ): Promise<any> => {
    const result = await this.adminVideoDAO.getPublicationType(body);

    return result;
  };
}
