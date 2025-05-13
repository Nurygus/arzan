import dotenv from "dotenv";
import bcrypt from "bcrypt";
import pg from "@/config/db";
import { ApiResponse } from "@/types/response";
import {
  AdminUserListRequest,
  AdminUserRequest,
} from "@/types/request/admin/user";
import { AdminUserResponse } from "@/types/response/admin/user";

dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export class UserDB {
  async insert(
    body: AdminUserRequest,
    image: string | undefined,
  ): Promise<ApiResponse<undefined>> {
    try {
      const {
        name,
        password,
        email,
        phone,
        location_id,
        type,
        start_time,
        end_time,
      } = body;

      const { rows: userList } = await pg.query(
        `SELECT tb_user_auth.id as id
        FROM tb_user_auth
        WHERE name = $1`,
        [name],
      );

      if (userList.length > 0) {
        return {
          status: false,
          message: "User with this name already exists!",
        };
      }

      const { rows: userPhoneList } = await pg.query(
        `
        SELECT tb_user_auth.id as id
        FROM tb_user_auth
        JOIN tb_phone ON tb_phone.user_auth_id = tb_user_auth.id
        WHERE tb_phone.phone = $1`,
        [phone],
      );

      if (userPhoneList.length > 0) {
        return {
          status: false,
          message: "User with this phone number already exists!",
        };
      }

      const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const { rows: newUserList } = await pg.query<{ id: number }>(
        "INSERT INTO tb_user_auth(name, password, verify) VALUES($1, $2, $3) RETURNING id",
        [name, hashPassword, "TRUE"],
      );

      const newUserId = newUserList[0].id;

      if (image) {
        const { rows: imageList } = await pg.query<{ id: number }>(
          "INSERT INTO tb_image(url) VALUES ($1) RETURNING id",
          [image],
        );
        const imageId = imageList[0].id;
        await pg.query(
          "INSERT INTO tb_user_auth_avatar_image(image_id, user_auth_id) VALUES($1, $2)",
          [imageId, newUserId],
        );
      }

      const { rows: subscriptionTypeList } = await pg.query<{ id: number }>(
        `
        SELECT id
        FROM tb_subscription_type
        WHERE type = $1
        `,
        [type],
      );

      if (!subscriptionTypeList[0]?.id) {
        return {
          status: false,
          message: "Invalid subscription type!",
        };
      }

      const subscriptionTypeId = subscriptionTypeList[0].id;

      if (type === "OFFICIAL") {
        await pg.query(
          "INSERT INTO tb_official_user(user_auth_id, email, start_date, expiry_date) VALUES($1, $2, $3, $4)",
          [newUserId, email, start_time, end_time],
        );
      }

      await pg.query(
        "INSERT INTO tb_user_subscription_type(user_auth_id, subscription_type_id) VALUES($1, $2)",
        [newUserId, subscriptionTypeId],
      );

      await pg.query(
        "INSERT INTO tb_phone(user_auth_id, phone) VALUES($1, $2)",
        [newUserId, phone],
      );

      await pg.query(
        "INSERT INTO tb_user_location(user_auth_id, location_id) SELECT $1, unnest(ARRAY[$2::int[]])",
        [newUserId, JSON.parse(location_id)],
      );

      return {
        status: true,
        message: "User created successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async list(
    query: AdminUserListRequest,
  ): Promise<ApiResponse<{ total_count: number; users: AdminUserResponse[] }>> {
    try {
      const { type, location_id, name, limit, offset } = query;

      const typeFilter = type ? `tb_subscription_type.type = $1` : "$1";
      const nameFilter = name ? `tb_user_auth.name ILIKE $2` : "$2";
      const locationFilter = location_id ? `tb_location.id = $3` : "$3";

      const filterQuery = `WHERE ${typeFilter} AND ${nameFilter} AND ${locationFilter}`;

      const { rows: list } = await pg.query(
        `SELECT
        tb_user_auth.id as id,
        tb_user_auth.name as name,
        tb_image.url as avatar_image,
        tb_phone.phone as phone,
        tb_user_coin_balance.balance as balance,
        tb_official_user.email as email,
        tb_official_user.start_date as start_date,
        tb_official_user.expiry_date as expiry_date,
        (SELECT json_agg(to_json(json_build_object('id', t_l.id, 'name', t_l.display_name)))
          FROM tb_user_location t_u_l
          JOIN tb_location t_l ON t_l.id = t_u_l.location_id
          WHERE t_u_l.user_auth_id = tb_user_auth.id) as locations,
        to_json(json_build_object('id', tb_subscription_type.id, 'type', tb_subscription_type.type)) type
      
        FROM tb_user_auth

      LEFT JOIN LATERAL
      (
        SELECT balance, user_auth_id
        FROM tb_user_coin_balance
        WHERE tb_user_coin_balance.user_auth_id = tb_user_auth.id
      ) tb_user_coin_balance ON true

      LEFT JOIN LATERAL
      (
        SELECT tb_location.id as id, tb_location.name as name
        FROM tb_user_location
        JOIN tb_location ON tb_location.id = tb_user_location.location_id
        WHERE tb_user_location.user_auth_id = tb_user_auth.id
      ) tb_location ON true

      LEFT JOIN LATERAL
        (
        SELECT tb_image.id as id, tb_image.url as url
        FROM tb_user_auth_avatar_image
        JOIN tb_image ON tb_image.id = tb_user_auth_avatar_image.image_id
        WHERE tb_user_auth_avatar_image.user_auth_id = tb_user_auth.id
        ) tb_image ON true

      JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = tb_user_auth.id
      JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_subscription_type.subscription_type_id
      JOIN tb_phone ON tb_phone.user_auth_id = tb_user_auth.id
      
      LEFT JOIN LATERAL
        (
        SELECT  email, expiry_date, start_date
        FROM    tb_official_user
        WHERE   tb_official_user.user_auth_id = tb_user_auth.id
        ) tb_official_user ON true
      ${filterQuery}
      GROUP BY tb_user_auth.id, tb_phone.id, tb_user_coin_balance.balance, tb_image.url, tb_subscription_type.id, tb_user_subscription_type.id, tb_official_user.email, tb_official_user.expiry_date, tb_official_user.start_date
      ORDER BY created_on DESC
      LIMIT $4
      OFFSET $5
      `,
        [
          type || "TRUE",
          name ? `%${name}%` : "TRUE",
          location_id || "TRUE",
          limit || 10,
          offset || 0,
        ],
      );

      const { rowCount: totalCount } = await pg.query(
        `
      SELECT tb_user_auth.id
      FROM tb_user_auth
      LEFT JOIN LATERAL
      (
        SELECT user_auth_id, location_id
        FROM tb_user_location
        WHERE tb_user_location.user_auth_id = tb_user_auth.id
      ) tb_user_location ON true
      LEFT JOIN LATERAL
      (
        SELECT id, name
        FROM tb_location
        WHERE tb_location.id = tb_user_location.location_id
      ) tb_location ON true
      JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = tb_user_auth.id
      JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_subscription_type.subscription_type_id
      ${filterQuery}
      GROUP BY tb_user_auth.id`,
        [type || "TRUE", name ? `%${name}%` : "TRUE", location_id || "TRUE"],
      );

      return {
        status: true,
        message: "User list",
        data: {
          total_count: totalCount,
          users: list,
        },
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  //   async get(id: string): Promise<ApiResponse<AdminSubCategoryResponse>> {
  //     try {
  //       const { rows: list } = await pg.query(
  //         `SELECT tb_post_sub_category.id as id, tb_category.name as name,
  //         to_json(json_build_object('id', tb_post_category.id, 'name', tb_parent_category.name)) category
  //         FROM tb_post_sub_category
  //         INNER JOIN tb_category ON tb_category.id = tb_post_sub_category.category_id
  //         JOIN tb_post_category ON tb_post_category.id = tb_post_sub_category.post_category_id
  //         LEFT JOIN tb_category as tb_parent_category ON tb_parent_category.id = tb_post_category.category_id
  //         WHERE tb_post_sub_category.id = $1
  //         GROUP BY tb_post_sub_category.id, tb_category.name, tb_post_category.id, tb_parent_category.name
  //         `,
  //         [id],
  //       );
  //       return {
  //         status: true,
  //         message: "Sub Category get",
  //         data: list[0],
  //       };
  //     } catch (err: any) {
  //       return {
  //         status: false,
  //         message: err.message,
  //       };
  //     }
  //   }

  //   async delete(id: string): Promise<ApiResponse<undefined>> {
  //     try {
  //       const { rows: categoryList } = await pg.query<{ category_id: number }>(
  //         "SELECT category_id FROM tb_post_sub_category WHERE id = $1",
  //         [id],
  //       );

  //       const categoryId = categoryList[0].category_id;

  //       await pg.query("DELETE FROM tb_post_sub_category WHERE id = $1", [id]);

  //       await pg.query("DELETE FROM tb_category WHERE id = $1", [categoryId]);

  //       return {
  //         message: "Sub Category succesfully deleted!",
  //         status: true,
  //       };
  //     } catch (err: any) {
  //       return {
  //         status: false,
  //         message: err.message,
  //       };
  //     }
  //   }
}
