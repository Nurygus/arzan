import pg from "@/config/db";
import {
  AdminDeleteUserRequest,
  AdminGetFollowRewardRequest,
  AdminListFollowRewardRequest,
  AdminListTopListLimitRequest,
  AdminSetFollowRewardRequest,
  AdminSetTopListLimitRequest,
  AdminUserDayStreakCoinRewardSetRequest,
} from "@/types/request/admin/user-profile";

import { ApiResponse } from "@/types/response";

export class AdminUserProfileDB {
  async listFollowReward(body: AdminListFollowRewardRequest): Promise<{
    status: boolean;
    message: string;
    data?: any[];
  }> {
    try {
      const { subscription_type_id, location_id } = body;

      const subscriptionTypeIdFilter = subscription_type_id
        ? `tb_subscription_type.id = $1`
        : `$1`;
      const locationIdFilter = location_id ? `tb_location.id = $2` : `$2`;
      const userQuery = `WHERE ${subscriptionTypeIdFilter} AND ${locationIdFilter}`;
      const { rows: list } = await pg.query(
        `
      SELECT
        tb_subscription_type.type,
        json_agg(
          jsonb_build_object(
            'location', tb_location,
            'coin_amount', tb_user_follow_coin_amount.coin_amount
          )
        ) AS data
      FROM
        tb_user_follow_coin_amount
        LEFT JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_follow_coin_amount.subscription_type_id
        LEFT JOIN tb_location ON tb_location.id = tb_user_follow_coin_amount.location_id
      ${userQuery}
      GROUP BY
        tb_subscription_type.type
      `,
        [subscription_type_id || `TRUE`, location_id || `TRUE`],
      );

      return {
        status: true,
        message: "Follow reward list",
        data: list,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async getFollowReward(body: AdminGetFollowRewardRequest): Promise<{
    status: boolean;
    message: string;
    data?: any;
  }> {
    try {
      const { location_id, subscription_type_id } = body;
      const values = [location_id, subscription_type_id];
      const { rows: list } = await pg.query(
        ` 
      SELECT
        tb_subscription_type.type,
        json_agg(
          jsonb_build_object(
            'location', tb_location,
            'coin_amount', tb_user_follow_coin_amount.coin_amount
          )
        ) AS data
      FROM
        tb_user_follow_coin_amount
        LEFT JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_follow_coin_amount.subscription_type_id
        LEFT JOIN tb_location ON tb_location.id = tb_user_follow_coin_amount.location_id
      WHERE
        tb_location.id = $1 AND tb_subscription_type.id = $2
      GROUP BY
        tb_subscription_type.type
      `,
        values,
      );

      return {
        status: true,
        message: "Follow reward",
        data: list.length > 0 ? list[0] : null,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async setFollowReward(
    body: AdminSetFollowRewardRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { subscription_type_id, location_id, coin_amount } = body;
      const { rows: itemList } = await pg.query(
        `SELECT
          *
        FROM
          tb_user_follow_coin_amount
        WHERE
          tb_user_follow_coin_amount.subscription_type_id = $1 AND 
          tb_user_follow_coin_amount.location_id = $2`,
        [subscription_type_id, location_id],
      );
      if (itemList.length < 1) {
        return {
          status: false,
          message: "Wrong subscription_type_id or location_id",
        };
      }
      await pg.query(
        `
        UPDATE
          tb_user_follow_coin_amount
        SET
          coin_amount = $3
        WHERE
          tb_user_follow_coin_amount.subscription_type_id = $1 AND 
          tb_user_follow_coin_amount.location_id = $2`,
        [subscription_type_id, location_id, coin_amount],
      );
      return {
        status: true,
        message: "Follow reward was set successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async setTopListLimit(
    body: AdminSetTopListLimitRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { name, limit_count } = body;
      const { rows: itemList } = await pg.query(
        `SELECT
          *
        FROM
          tb_top_list_limit
        WHERE
          tb_top_list_limit.name = $1`,
        [name],
      );
      if (itemList.length < 1) {
        await pg.query(
          `INSERT INTO tb_top_list_limit(name, limit_count) VALUES ($1, $2)`,
          [name, limit_count],
        );
      }
      await pg.query(
        `
        UPDATE
          tb_top_list_limit
        SET
          limit_count = $2
        WHERE
          tb_top_list_limit.name = $1`,
        [name, limit_count],
      );
      return {
        status: true,
        message: "Top list limit was set successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async listTopListLimit(body: AdminListTopListLimitRequest): Promise<{
    status: boolean;
    message: string;
    data?: any[];
  }> {
    try {
      const {} = body;
      const { rows: list } = await pg.query(`SELECT * FROM tb_top_list_limit`);
      return {
        status: true,
        message: "Top list limit",
        data: list,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async delteUser(
    body: AdminDeleteUserRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { id } = body;
      const { rows: itemList } = await pg.query(
        `SELECT
          *
        FROM
          tb_user_auth
        WHERE
          tb_user_auth.id = $1`,
        [id],
      );
      if (itemList.length < 1) {
        return {
          status: false,
          message: "User does not exists!",
        };
      }
      await pg.query(
        `DELETE FROM tb_video
        WHERE tb_video.id IN
          (
            SELECT
              tb_user_video.video_id
            FROM 
              tb_user_video
            WHERE 
              tb_user_video.user_auth_id = $1
          )`,
        [id],
      );

      await pg.query(
        `DELETE FROM tb_image
        WHERE tb_image.id IN
          (
            SELECT
              tb_gallery.image_id
            FROM 
              tb_gallery
            WHERE 
              tb_gallery.user_auth_id = $1
          )`,
        [id],
      );

      await pg.query(
        `DELETE FROM tb_image
        WHERE tb_image.id IN
          (
            SELECT
              tb_user_image.image_id
            FROM 
              tb_user_image
            WHERE 
              tb_user_image.user_auth_id = $1
          )`,
        [id],
      );

      await pg.query(`DELETE FROM tb_user_auth WHERE tb_user_auth.id = $1`, [
        id,
      ]);

      return {
        status: true,
        message: "User was deleted successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async setDayStreakCoinReward(
    body: AdminUserDayStreakCoinRewardSetRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { day_id, coin_amount } = body;
      const { rows: dayStreakList } = await pg.query(
        `
        UPDATE
          tb_day_streak_coin_amount
        SET
          coin_amount = $2,
          created_at = CURRENT_TIMESTAMP
        WHERE
          tb_day_streak_coin_amount.day_id = $1
        RETURNING
          *`,
        [day_id, coin_amount],
      );

      if (dayStreakList.length == 0) {
        await pg.query(
          `INSERT INTO tb_day_streak_coin_amount(day_id, coin_amount) VALUES ($1, $2)`,
          [day_id, coin_amount],
        );
      }

      return {
        status: true,
        message: "Admin set day streak coin reward successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
}
