import { AdminServiceDAO } from "@/db/admin/service";
import { AdminServiceRequest } from "@/types/request/admin/service";
import { ApiResponse } from "@/types/response";

export class AdminServiceServices {
  serviceDAO: AdminServiceDAO;
  constructor() {
    this.serviceDAO = new AdminServiceDAO();
  }

  post = async (
    body: AdminServiceRequest,
    image: string,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.serviceDAO.post(body, image);

    return result;
  };

  put = async (
    id: number,
    body: AdminServiceRequest,
    image?: string,
  ): Promise<ApiResponse<any>> => {
    const result = await this.serviceDAO.put(id, body, image);

    return result;
  };

  list = async (): Promise<ApiResponse<any[]>> => {
    const result = await this.serviceDAO.list();

    return result;
  };

  get = async (id: number): Promise<ApiResponse<any>> => {
    const result = await this.serviceDAO.get(id);

    return result;
  };

  delete = async (id: number): Promise<ApiResponse<undefined>> => {
    const result = await this.serviceDAO.delete(id);

    return result;
  };
}
