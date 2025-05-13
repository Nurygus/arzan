import { AdminPublicationTypeDAO } from "@/db/admin/publication-type";
import {
  AdminPublicationTypeCreateRequest,
  AdminPublicationTypeGetRequest,
  AdminPublicationTypeListRequest,
} from "@/types/request/admin/publication-type";
import { ApiResponse } from "@/types/response";

export class AdminPublicationTypeServices {
  serviceDAO: AdminPublicationTypeDAO;
  constructor() {
    this.serviceDAO = new AdminPublicationTypeDAO();
  }

  create = async (
    body: AdminPublicationTypeCreateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.serviceDAO.create(body);
    return result;
  };

  get = async (body: AdminPublicationTypeGetRequest): Promise<any> => {
    const result = await this.serviceDAO.get(body);
    return result;
  };

  list = async (body: AdminPublicationTypeListRequest): Promise<any[]> => {
    const result = await this.serviceDAO.list(body);
    return result;
  };
}
