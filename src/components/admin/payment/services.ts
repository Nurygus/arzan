import { AdminPaymentDAO } from "@/db/admin/payment";
import { ApiResponse } from "@/types/response";
import { AdminPaymentResponse } from "@/types/response/admin/payment";

export class AdminPaymentServices {
  paymentDAO: AdminPaymentDAO;
  constructor() {
    this.paymentDAO = new AdminPaymentDAO();
  }

  post = async (body: any, image: string): Promise<ApiResponse<undefined>> => {
    const result = await this.paymentDAO.post(body, image);

    return result;
  };

  list = async (): Promise<ApiResponse<AdminPaymentResponse[]>> => {
    const result = await this.paymentDAO.list();

    return result;
  };

  userList = async (): Promise<ApiResponse<AdminPaymentResponse[]>> => {
    const result = await this.paymentDAO.userList();

    return result;
  };

  //   get = async (id: string): Promise<AdminCategoryResponse> => {
  //     const result = await this.categoryDAO.get(id);

  //     return result;
  //   };

  delete = async (id: string): Promise<ApiResponse<undefined>> => {
    const result = await this.paymentDAO.delete(id);

    return result;
  };
}
