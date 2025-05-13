import { PaymentDAO } from "@/db/payment";
import { ApiResponse } from "@/types/response";
import { ApiPaymentResponse } from "@/types/response/payment";

export class ApiPaymentServices {
  paymentDAO: PaymentDAO;
  constructor() {
    this.paymentDAO = new PaymentDAO();
  }

  list = async (): Promise<ApiResponse<ApiPaymentResponse[]>> => {
    const result = await this.paymentDAO.list();

    return result;
  };

  status = async (
    userId: number,
    orderId: string,
  ): Promise<ApiResponse<any>> => {
    const result = await this.paymentDAO.status(userId, orderId);

    return result;
  };

  post = async (
    paymentId: string,
    userId: number,
  ): Promise<ApiResponse<string>> => {
    const result = await this.paymentDAO.post(paymentId, userId);

    return result;
  };
}
