import { format, fromUnixTime } from "date-fns";
import pg from "@/config/db";
import {
  UserVideoGetRequest,
  UserVideoLikeRequest,
  UserVideoListRequest,
  UserVideoViewRequest,
} from "@/types/request/video";
import { ApiResponse } from "@/types/response";

export class VideoDB {
  async get(query: UserVideoGetRequest): Promise<ApiResponse<any>> {
    try {
      const { id, current_user_id } = query;
      const values = [id];
      if (current_user_id) {
        values.push(current_user_id);
      }
      const isLikedParam = current_user_id
        ? `CAST(COALESCE((SELECT count(tb_user_video_like.id) FROM tb_user_video_like WHERE tb_user_video_like.user_video_id = tb_user_video.id AND tb_user_video_like.user_auth_id = $2), '0') as INTEGER) as is_liked,`
        : ``;
      const { rows: list } = await pg.query(
        `
        WITH pre_next AS (
          SELECT
            id,
            lag(id) over (
              order by
                id
            ) as prev_id,
            lead(id) over (
              order by
                id
            ) as next_id
          FROM
            tb_user_video
        )
        SELECT
          tb_user_video.id,
          tb_user_video.title,
          tb_user_video.viewed_count,
          tb_user_video.created_at,
          jsonb_build_object(
            'prev_id', pre_next.prev_id,
            'next_id', pre_next.next_id
          ) as cursor,
          jsonb_build_object(
            'id', tb_user_auth.id,
            'name', tb_user_auth.name,
            'avatar_image', 
            jsonb_build_object('url', user_auth_avatar_image_image.url),
            'role', tb_subscription_type.type
          ) as user,
          jsonb_build_object('url', tb_video.url) as video,
          jsonb_build_object('url', tb_image.url) as thumbnail,
          json_agg(
            DISTINCT jsonb_build_object(
              'id',
              tb_page_category.id,
              'page',
              tb_page,
              'category',
              tb_category,
              'image',
              jsonb_build_object('url', page_category_tb_image.url)
            )
          ) as page_category,
          CAST(COALESCE(tb_user_video_like_statistic.like_count, '0') AS INTEGER) as like_count,
          ${isLikedParam}
          to_json(tb_publication_type) as publication_type
        FROM
          tb_user_video
          JOIN tb_video ON tb_user_video.video_id = tb_video.id
          LEFT JOIN tb_user_video_publication_type ON tb_user_video_publication_type.user_video_id = tb_user_video.id
          LEFT JOIN tb_publication_type ON tb_publication_type.id = tb_user_video_publication_type.publication_type_id
          JOIN tb_video_thumbnail ON tb_video_thumbnail.user_video_id = tb_user_video.id
          JOIN tb_image ON tb_video_thumbnail.image_id = tb_image.id
          LEFT JOIN tb_user_video_page_category ON tb_user_video_page_category.user_video_id = tb_user_video.id
          LEFT JOIN tb_page_category ON tb_page_category.id = tb_user_video_page_category.page_category_id
          LEFT JOIN tb_page ON tb_page.id = tb_page_category.page_id
          LEFT JOIN tb_category ON tb_category.id = tb_page_category.category_id
          LEFT JOIN tb_image as page_category_tb_image ON page_category_tb_image.id = tb_page_category.image_id
          LEFT JOIN tb_user_auth ON tb_user_auth.id = tb_user_video.user_auth_id
          LEFT JOIN tb_user_auth_avatar_image ON tb_user_auth_avatar_image.user_auth_id = tb_user_video.user_auth_id
          LEFT JOIN tb_image as user_auth_avatar_image_image ON tb_image.id = tb_user_auth_avatar_image.image_id
          
          LEFT JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = tb_user_video.user_auth_id
          LEFT JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_subscription_type.subscription_type_id
  
          LEFT JOIN tb_user_video_like_statistic ON tb_user_video_like_statistic.user_video_id = tb_user_video.id
          LEFT JOIN pre_next ON pre_next.id = tb_user_video.id
        WHERE
          tb_user_video.id = $1
        GROUP BY
          tb_user_video.id,
          pre_next.prev_id,
          pre_next.next_id,
          tb_video.url,
          tb_image.url,
          tb_user_auth.id,
          user_auth_avatar_image_image.url,
          tb_subscription_type.type,
          tb_user_video_like_statistic.like_count,
          tb_publication_type
        `,
        values,
      );

      return {
        status: true,
        message: "Video",
        data: list.length > 0 ? list[0] : null,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
  async list(body: UserVideoListRequest): Promise<ApiResponse<any[]>> {
    try {
      const {
        user_id,
        page_category_id,
        current_user_id,
        publication_type_id,
        limit,
        offset,
        query,
        sort,
        order,
      } = body;
      const userIdFilter = user_id ? `tb_user_video.user_auth_id = $1` : `$1`;
      const pageCategoryIdFilter = page_category_id
        ? `($2 IN (SELECT tb_user_video_page_category.page_category_id
                    FROM tb_user_video_page_category
                    WHERE tb_user_video_page_category.user_video_id = tb_user_video.id))`
        : `$2`;

      const sqlquery = query ? "%" + query + "%" : null;
      const queryFilter = query
        ? `(tb_user_video.title ILIKE $3 OR
            tb_user_auth.name ILIKE $3 OR
            tb_subscription_type.type ILIKE $3 OR
            tb_publication_type.type ILIKE $3)`
        : `$3`;
      const publicationTypeIdFilter = publication_type_id
        ? `tb_publication_type.id = $4`
        : `$4`;

      let sortBy = `tb_user_video.created_at`;
      switch (sort) {
        case "time":
          sortBy = `tb_user_video.created_at`;
          break;
        case "like":
          sortBy = `likes_count`;
          break;
        case "view":
          sortBy = `tb_user_video.viewed_count`;
          break;
      }
      let orderBy = `DESC`;
      switch (order) {
        case "asc":
          orderBy = `ASC`;
          break;
        case "desc":
          orderBy = `DESC`;
          break;
      }
      const finalQuery = `WHERE ${userIdFilter} AND ${pageCategoryIdFilter} AND ${queryFilter} AND ${publicationTypeIdFilter}`;
      const values = [
        user_id || `TRUE`,
        page_category_id || `TRUE`,
        sqlquery || `TRUE`,
        publication_type_id || `TRUE`,
        limit || 10,
        offset || 0,
      ];

      if (current_user_id) {
        values.push(current_user_id);
      }
      const isLikedParam = current_user_id
        ? `CAST(COALESCE((SELECT count(tb_user_video_like.id) FROM tb_user_video_like WHERE tb_user_video_like.user_video_id = tb_user_video.id AND tb_user_video_like.user_auth_id = $7), '0') as INTEGER) as is_liked,`
        : ``;
      const { rows: list } = await pg.query(
        `
        SELECT
          tb_user_video.id,
          CAST(COUNT(tb_user_video.id) OVER() AS INTEGER) as items_full_count,
          tb_user_video.title,
          tb_user_video.viewed_count,
          tb_user_video.created_at,
          jsonb_build_object(
            'id', tb_user_auth.id,
            'name', tb_user_auth.name,
            'avatar_image', 
            jsonb_build_object('url', user_auth_avatar_image_image.url),
            'role', tb_subscription_type.type
          ) as user,
          jsonb_build_object('url', tb_video.url) as video,
          jsonb_build_object('url', tb_image.url) as thumbnail,
          json_agg(
            DISTINCT jsonb_build_object(
              'id',
              tb_page_category.id,
              'page',
              tb_page,
              'category',
              tb_category,
              'image',
              jsonb_build_object('url', page_category_tb_image.url)
            )
          ) as page_category,
          CAST(COALESCE(tb_user_video_like_statistic.like_count, '0') AS INTEGER) as like_count,
          ${isLikedParam}
          to_json(tb_publication_type) as publication_type
        FROM
          tb_user_video
          JOIN tb_video ON tb_user_video.video_id = tb_video.id
          LEFT JOIN tb_user_video_publication_type ON tb_user_video_publication_type.user_video_id = tb_user_video.id
          LEFT JOIN tb_publication_type ON tb_publication_type.id = tb_user_video_publication_type.publication_type_id
          JOIN tb_video_thumbnail ON tb_video_thumbnail.user_video_id = tb_user_video.id
          JOIN tb_image ON tb_video_thumbnail.image_id = tb_image.id
          LEFT JOIN tb_user_video_page_category ON tb_user_video_page_category.user_video_id = tb_user_video.id
          LEFT JOIN tb_page_category ON tb_page_category.id = tb_user_video_page_category.page_category_id
          LEFT JOIN tb_page ON tb_page.id = tb_page_category.page_id
          LEFT JOIN tb_category ON tb_category.id = tb_page_category.category_id
          LEFT JOIN tb_image as page_category_tb_image ON page_category_tb_image.id = tb_page_category.image_id
          LEFT JOIN tb_user_auth ON tb_user_auth.id = tb_user_video.user_auth_id
          LEFT JOIN tb_user_auth_avatar_image ON tb_user_auth_avatar_image.user_auth_id = tb_user_video.user_auth_id
          LEFT JOIN tb_image as user_auth_avatar_image_image ON tb_image.id = tb_user_auth_avatar_image.image_id
          
          LEFT JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = tb_user_video.user_auth_id
          LEFT JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_subscription_type.subscription_type_id
          LEFT JOIN tb_user_video_like_statistic ON tb_user_video_like_statistic.user_video_id = tb_user_video.id
        ${finalQuery}
        GROUP BY
          tb_user_video.id,
          tb_video.url,
          tb_image.url,
          tb_user_auth.id,
          user_auth_avatar_image_image.url,
          tb_subscription_type.type,
          tb_user_video_like_statistic.like_count,
          tb_publication_type
        ORDER BY
          ${sortBy} ${orderBy}
        LIMIT $5
        OFFSET $6
        `,
        values,
      );
      return {
        status: true,
        message: "Video list",
        data: list,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async getBadgeCount(
    session: any,
    lastFetchedDate?: number,
  ): Promise<ApiResponse<{ count: number }>> {
    try {
      if (lastFetchedDate) {
        const date = format(
          fromUnixTime(Math.floor(lastFetchedDate) / 1000),
          "yyyy-MM-dd HH:mm:ss",
        );

        const { rowCount: count } = await pg.query(
          "SELECT id FROM tb_user_video WHERE created_at BETWEEN $1 AND NOW()",
          [date],
        );

        return {
          status: true,
          message: "Video count",
          data: {
            count: count > 0 ? count - 1 : count,
          },
        };
      }
      if (session && session.last_fetched_video_date) {
        const date = format(
          fromUnixTime(Math.floor(session.last_fetched_video_date) / 1000),
          "yyyy-MM-dd HH:mm:ss",
        );

        const { rowCount: count } = await pg.query(
          "SELECT id FROM tb_user_video WHERE created_at BETWEEN $1 AND NOW()",
          [date],
        );

        return {
          status: true,
          message: "Video count",
          data: {
            count: count > 0 ? count - 1 : count,
          },
        };
      }

      const { rowCount: count } = await pg.query(
        "SELECT id FROM tb_user_video",
      );

      return {
        status: true,
        message: "Video badge count",
        data: {
          count,
        },
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async like(body: UserVideoLikeRequest): Promise<ApiResponse<undefined>> {
    try {
      const { id, current_user_id } = body;
      const { rows: userVideoLikeList } = await pg.query(
        `SELECT * FROM tb_user_video_like WHERE tb_user_video_like.user_video_id = $1 AND tb_user_video_like.user_auth_id = $2`,
        [id, current_user_id],
      );
      if (userVideoLikeList.length > 0) {
        return {
          status: false,
          message: "User already liked the video",
        };
      }
      await pg.query(
        `INSERT INTO tb_user_video_like (user_auth_id, user_video_id) VALUES($1, $2)`,
        [current_user_id, id],
      );

      const { rows: tb_publication_type_like_amount } = await pg.query(
        `
        SELECT 
          tb_publication_type_like_amount.*
        FROM
          tb_user_video_publication_type
        LEFT JOIN tb_publication_type_like_amount ON tb_publication_type_like_amount.publication_type_id = tb_user_video_publication_type.publication_type_id
        WHERE
            tb_user_video_publication_type.user_video_id = $1
        `,
        [id],
      );
      tb_publication_type_like_amount.map(
        async (elem) =>
          await pg.query(
            `
            WITH x AS (
              UPDATE
                tb_user_coin_balance SET balance = balance + $1
              WHERE
                tb_user_coin_balance.user_auth_id = $2
              RETURNING tb_user_coin_balance.id
            )
            UPDATE
              tb_user_coin_balance_statistics
            SET
              like_coin = like_coin + CAST(COALESCE($1, '0') as FLOAT),
              last_modified = CURRENT_TIMESTAMP
            FROM
              x
            WHERE
              tb_user_coin_balance_statistics.coin_balance_id = x.id  
            `,
            [elem.amount, current_user_id],
          ),
      );

      return {
        status: true,
        message: "Video was liked successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async view(body: UserVideoViewRequest): Promise<ApiResponse<undefined>> {
    try {
      const { id } = body;
      await pg.query(
        `
        UPDATE
          tb_user_video SET viewed_count = viewed_count + 1
        WHERE
          tb_user_video.id = $1
        `,
        [id],
      );

      return {
        status: true,
        message: "Video was viewed successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
}
