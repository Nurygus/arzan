import axios from "axios";
import pg from "@/config/db";
import { ApiResponse } from "@/types/response";
import { ApiPaymentResponse } from "@/types/response/payment";

export class PaymentDAO {
  list = async (): Promise<ApiResponse<ApiPaymentResponse[]>> => {
    const { rows: list } = await pg.query(
      `SELECT tb_payment.id as id, tb_image.url as image, tb_payment.amount as amount, tb_payment.price as price
        FROM tb_payment
        JOIN tb_payment_image ON tb_payment_image.payment_id = tb_payment.id
        JOIN tb_image ON tb_image.id = tb_payment_image.image_id`,
    );
    return {
      status: true,
      message: "Payment list",
      data: list,
    };
  };

  status = async (
    userId: number,
    orderId: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const { rows: userPaymentList } = await pg.query(
        "SELECT id, payment_id FROM tb_user_payment WHERE user_auth_id = $1 AND order_id = $2",
        [userId, orderId],
      );
      const userPayment = userPaymentList[0];
      if (!userPayment) {
        return {
          status: false,
          message: "Order with given id doesn't exists!",
        };
      }
      const res = await axios.get(
        `https://mpi.gov.tm/payment/rest/getOrderStatus.do?orderId=${orderId}&language=ru&password=KUfd53Gdfejg2Sb&userName=209122507205`,
      );

      if (res.data.orderStatus !== 2) {
        return {
          status: false,
          message: "Payment doesn't made!",
        };
      }

      await pg.query("UPDATE tb_user_payment SET status = TRUE WHERE id = $1", [
        userPayment.id,
      ]);

      const { rows: paymentList } = await pg.query(
        "SELECT amount FROM tb_payment WHERE id = $1",
        [userPayment.payment_id],
      );

      const amount = paymentList[0].amount;

      await pg.query(
        "UPDATE tb_user_coin_balance SET balance = balance + $1 WHERE user_auth_id = $2",
        [amount, userId],
      );

      return {
        status: true,
        message: "Payment successfully completed!",
        data: res.data,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  };

  post = async (
    paymentId: string,
    userId: number,
  ): Promise<ApiResponse<string>> => {
    try {
      const { rows: paymentList } = await pg.query(
        "SELECT * FROM tb_payment WHERE id = $1",
        [paymentId],
      );
      const payment = paymentList[0];
      if (!payment) {
        return {
          status: false,
          message: "Payment doesn't exist!",
        };
      }
      const { rows: orderNumberList } = await pg.query<{
        order_number: number;
      }>(
        "SELECT order_number FROM tb_payment_order_number ORDER BY created_at DESC LIMIT 1",
      );
      const orderNumber = orderNumberList[0].order_number;
      console.log(Number(orderNumber) + 1, payment.price * 100);
      const res = await axios.get(
        `https://mpi.gov.tm/payment/rest/register.do?orderNumber=${
          Number(orderNumber) + 1
        }&amount=${
          payment.price * 100
        }&currency=934&language=ru&password=KUfd53Gdfejg2Sb&returnUrl=/payment/finish&userName=209122507205&pageView=DESKTOP&description=Arzan TM maglumat platformasynda hyzmat satyn almak üçin&sessionTimeoutSecs=300`,
      );

      await pg.query(
        "INSERT INTO tb_payment_order_number(order_number) VALUES($1)",
        [Number(orderNumber) + 1],
      );

      await pg.query(
        "INSERT INTO tb_user_payment(order_id, user_auth_id, payment_id) VALUES($1, $2, $3)",
        [res.data.orderId, userId, paymentId],
      );

      return {
        status: true,
        message: "Payment form",
        data: res.data,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  };
}
