import { ServiceRequestDAO } from "@/db/service-request";
import { ApiServiceRequestBody } from "@/types/request/service-request";
import { ApiResponse } from "@/types/response";

export class ApiServiceRequestServices {
  serviceRequestDAO: ServiceRequestDAO;
  constructor() {
    this.serviceRequestDAO = new ServiceRequestDAO();
  }

  post = async (
    body: ApiServiceRequestBody,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.serviceRequestDAO.post(body);

    return result;
  };
}
