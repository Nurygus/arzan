import pg from "@/config/db";
import { AdminPaymentRequest } from "@/types/request/admin/payment";
import { ApiResponse } from "@/types/response";
import { AdminPaymentResponse } from "@/types/response/admin/payment";

export class AdminPaymentDAO {
  post = async (
    body: AdminPaymentRequest,
    image: string,
  ): Promise<ApiResponse<undefined>> => {
    try {
      const { amount, price } = body;

      const { rows: paymentList } = await pg.query<{ id: number }>(
        "INSERT INTO tb_payment(amount, price) VALUES($1, $2) RETURNING id",
        [amount, price],
      );
      const { rows: imageList } = await pg.query<{ id: number }>(
        "INSERT INTO tb_image(url) VALUES($1) RETURNING id",
        [image],
      );

      const imageId = imageList[0].id;
      const paymentId = paymentList[0].id;

      await pg.query(
        "INSERT INTO tb_payment_image(image_id, payment_id) VALUES($1, $2)",
        [imageId, paymentId],
      );

      return {
        status: true,
        message: "Payment created successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  };

  list = async (): Promise<ApiResponse<AdminPaymentResponse[]>> => {
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

  userList = async (): Promise<ApiResponse<AdminPaymentResponse[]>> => {
    try {
      const { rows: list } = await pg.query(
        `SELECT
        tb_user_payment.id as id,
        tb_user_payment.order_id as order_id,
        tb_user_payment.status as status,
        tb_payment.amount as amount,
        to_json(json_build_object('id', tb_user_auth.id, 'name', tb_user_auth.name)) user
        FROM tb_user_payment
        JOIN tb_payment ON tb_payment.id = tb_user_payment.payment_id
        JOIN tb_user_auth ON tb_user_auth.id = tb_user_payment.user_auth_id`,
      );

      return {
        status: true,
        message: "User payment list",
        data: list,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  };

  delete = async (id: string): Promise<ApiResponse<undefined>> => {
    const { rows: paymentImageList } = await pg.query<{ image_id: number }>(
      "DELETE FROM tb_payment_image WHERE tb_payment_image.payment_id = $1 RETURNING image_id",
      [id],
    );
    const paymentImageId = paymentImageList[0].image_id;
    await pg.query("DELETE FROM tb_image WHERE id = $1", [paymentImageId]);
    await pg.query("DELETE FROM tb_payment WHERE id = $1", [id]);
    return {
      status: true,
      message: "Payment deleted successfully!",
    };
  };
}
