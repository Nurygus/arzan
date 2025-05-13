import pg from "@/config/db";
import { ApiResponse } from "@/types/response";

export class UserDAO {
  async profile(userId: number): Promise<ApiResponse<any>> {
    try {
      const { rows: list } = await pg.query(
        `SELECT tb_user_auth.id as id, tb_user_auth.name, tb_phone.phone as phone
        FROM tb_user_auth

        JOIN tb_phone ON tb_phone.user_auth_id = tb_user_auth.id

        LEFT JOIN LATERAL (
          
        )
        JOIN tb_user_auth_avatar_image ON tb_user_auth_avatar_image.user_auth_id = tb_user_auth.id

        WHERE tb_user_auth.id = $1`,
        [userId],
      );
      return {
        status: true,
        message: "User list",
        data: list[0],
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
}
