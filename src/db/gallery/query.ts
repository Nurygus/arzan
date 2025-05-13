import dotenv from "dotenv";
import { format, fromUnixTime } from "date-fns";
import pg from "@/config/db";
import {
  UserGalleryGetRequest,
  UserGalleryListRequest,
  UserGalleryPhotoLikeRequest,
  UserGalleryPhotoViewRequest,
} from "@/types/request/gallery";
import { ApiResponse } from "@/types/response";

dotenv.config();

export class GalleryDB {
  async list(body: UserGalleryListRequest): Promise<any[]> {
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
    const userIdFilter = user_id ? `tb_gallery.user_auth_id = $1` : `$1`;
    const pageCategoryIdFilter = page_category_id
      ? `($2 IN (SELECT tb_gallery_page_category.page_category_id
                  FROM tb_gallery_page_category
                  WHERE tb_gallery_page_category.gallery_id = tb_gallery.id))`
      : `$2`;

    const sqlquery = query ? "%" + query + "%" : null;
    const queryFilter = query
      ? ` tb_gallery.title ILIKE $3 OR
          tb_user_auth.name ILIKE $3 OR
          tb_subscription_type.type ILIKE $3`
      : `$3`;

    const publicationTypeIdFilter = publication_type_id
      ? `tb_publication_type.id = $4`
      : `$4`;
    let sortBy = `tb_gallery.created_at`;
    switch (sort) {
      case "time":
        sortBy = `tb_gallery.created_at`;
        break;
      case "like":
        sortBy = `like_count`;
        break;
      case "view":
        sortBy = `view_count`;
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
      limit,
      offset || 0,
    ];
    if (current_user_id) {
      values.push(current_user_id);
    }
    const isLikedParam = current_user_id
      ? `CAST(
        COALESCE(
          (
            SELECT
              count(tb_user_image_like.id)
            FROM
              tb_user_image_like
            WHERE
              tb_user_image_like.user_auth_id = $7
          ),
          '0'
        ) as INTEGER
      ) as is_liked,`
      : ``;
    const { rows: list } = await pg.query<any>(
      `
      SELECT
        tb_gallery.id,
        CAST(COUNT(tb_gallery.id) OVER() AS INTEGER) as items_full_count,
        tb_gallery.title,
        jsonb_build_object(
          'id',
          tb_user_auth.id,
          'name',
          tb_user_auth.name,
          'avatar_image',
          jsonb_build_object('url', user_auth_avatar_image_image.url),
          'role',
          tb_subscription_type.type
        ) as user,
        jsonb_build_object('url', tb_image_avatar.url) as avatar_image,
        CAST(SUM(COUNT(tb_user_image_like.id)) OVER (PARTITION BY tb_gallery.id) as INTEGER) as like_count,
        CAST(SUM(tb_user_image.viewed_count) as INTEGER) as view_count,
        CAST(COUNT(distinct tb_user_image.id) as INTEGER) as image_count,
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
        ${isLikedParam}
        tb_gallery.created_at
      FROM
        tb_gallery
        LEFT JOIN tb_gallery_user_image ON tb_gallery_user_image.gallery_id = tb_gallery.id
        LEFT JOIN tb_user_image ON tb_user_image.id = tb_gallery_user_image.user_image_id
        LEFT JOIN tb_user_image_like ON tb_user_image_like.user_image_id = tb_user_image.id

        LEFT JOIN tb_user_image_publication_type ON tb_user_image_publication_type.user_image_id = tb_user_image.id
        LEFT JOIN tb_publication_type ON tb_publication_type.id = tb_user_image_publication_type.publication_type_id
        

        LEFT JOIN tb_image as tb_image_avatar ON tb_image_avatar.id = tb_gallery.image_id
        LEFT JOIN tb_image ON tb_image.id = tb_user_image.image_id
        LEFT JOIN tb_gallery_page_category ON tb_gallery_page_category.gallery_id = tb_gallery.id
        LEFT JOIN tb_page_category ON tb_page_category.id = tb_gallery_page_category.page_category_id
        LEFT JOIN tb_page ON tb_page.id = tb_page_category.page_id
        LEFT JOIN tb_category ON tb_category.id = tb_page_category.category_id
        LEFT JOIN tb_image as page_category_tb_image ON page_category_tb_image.id = tb_page_category.image_id
        LEFT JOIN tb_user_auth ON tb_user_auth.id = tb_gallery.user_auth_id
        LEFT JOIN tb_user_auth_avatar_image ON tb_user_auth_avatar_image.user_auth_id = tb_gallery.user_auth_id
        LEFT JOIN tb_image as user_auth_avatar_image_image ON tb_image.id = tb_user_auth_avatar_image.image_id
        LEFT JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = tb_gallery.user_auth_id
        LEFT JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_subscription_type.subscription_type_id
      ${finalQuery}
      GROUP BY
        tb_gallery.id,
        tb_image_avatar.url,
        tb_user_auth.id,
        user_auth_avatar_image_image.url,
        tb_subscription_type.type
      ORDER BY
        ${sortBy} ${orderBy}
      LIMIT $5
      OFFSET $6
      `,
      values,
    );
    return list;
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
          "SELECT id FROM tb_gallery WHERE created_at BETWEEN $1 AND NOW()",
          [date],
        );

        return {
          status: true,
          message: "Gallery badge count",
          data: {
            count: count > 0 ? count - 1 : count,
          },
        };
      }

      if (session && session.last_fetched_gallery_date) {
        const date = format(
          fromUnixTime(Math.floor(session.last_fetched_gallery_date) / 1000),
          "yyyy-MM-dd HH:mm:ss",
        );

        const { rowCount: count } = await pg.query(
          "SELECT id FROM tb_gallery WHERE created_at BETWEEN $1 AND NOW()",
          [date],
        );

        return {
          status: true,
          message: "Gallery badge count",
          data: {
            count: count > 0 ? count - 1 : count,
          },
        };
      }

      const { rowCount: count } = await pg.query("SELECT id FROM tb_gallery");

      return {
        status: true,
        message: "Gallery badge count",
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

  async get(body: UserGalleryGetRequest): Promise<any> {
    const { id, current_user_id } = body;
    const values = [id];
    if (current_user_id) {
      values.push(current_user_id);
    }
    const isLikedParam = current_user_id
      ? `'is_liked', CAST(
        COALESCE(
          (
            SELECT
              count(tb_user_image_like.id)
            FROM
              tb_user_image_like
            WHERE
              tb_user_image_like.user_image_id = tb_user_image.id AND tb_user_image_like.user_auth_id = $2
          ),
          '0'
        ) as INTEGER
      ),`
      : ``;
    const { rows: list } = await pg.query<any>(
      `
      SELECT
        tb_gallery.id,
        tb_gallery.title,
        jsonb_build_object(
          'id', tb_user_auth.id,
          'name', tb_user_auth.name,
          'avatar_image', 
          jsonb_build_object('url', user_auth_avatar_image_image.url),
          'role', tb_subscription_type.type
        ) as user,
        jsonb_build_object('url', tb_image_avatar.url) as avatar_image,
        json_agg(
          jsonb_build_object(
            'id',
            tb_user_image.id,
            'view_count',
            tb_user_image.viewed_count,
            'user_id',
            tb_user_image.user_auth_id,
            'url',
            tb_image.url,
            'created_at',
            tb_user_image.created_at,
            'publication_type',
            (
              SELECT
                to_json(tb_publication_type.*)
              FROM
                tb_publication_type
              WHERE
                tb_publication_type.id = tb_user_image_publication_type.publication_type_id
              LIMIT 1
            ),
            ${isLikedParam}
            'like_count',
            CAST(
              COALESCE(
                (
                  SELECT
                    count(tb_user_image_like.id)
                  FROM
                    tb_user_image_like
                  WHERE
                    tb_user_image_like.user_image_id = tb_user_image.id
                ),
                '0'
              ) as INTEGER
            )
          )
        ) as images,
        json_agg(DISTINCT jsonb_build_object(
          'id',
          tb_page_category.id,
          'page',
          tb_page,
          'category',
          tb_category,
          'image',
          jsonb_build_object('url', page_category_tb_image.url)
        )) as page_category,
        tb_gallery.created_at
      FROM
        tb_gallery
        LEFT JOIN tb_gallery_user_image ON tb_gallery_user_image.gallery_id = tb_gallery.id
        LEFT JOIN tb_user_image ON tb_user_image.id = tb_gallery_user_image.user_image_id
        LEFT JOIN tb_user_image_publication_type ON tb_user_image_publication_type.user_image_id = tb_user_image.id
        LEFT JOIN tb_image as tb_image_avatar ON tb_image_avatar.id = tb_gallery.image_id
        LEFT JOIN tb_image ON tb_image.id = tb_user_image.image_id
        LEFT JOIN tb_gallery_page_category ON tb_gallery_page_category.gallery_id = tb_gallery.id
        LEFT JOIN tb_page_category ON tb_page_category.id = tb_gallery_page_category.page_category_id
        LEFT JOIN tb_page ON tb_page.id = tb_page_category.page_id
        LEFT JOIN tb_category ON tb_category.id = tb_page_category.category_id
        LEFT JOIN tb_image as page_category_tb_image ON page_category_tb_image.id = tb_page_category.image_id
        LEFT JOIN tb_user_auth ON tb_user_auth.id = tb_gallery.user_auth_id
        LEFT JOIN tb_user_auth_avatar_image ON tb_user_auth_avatar_image.user_auth_id = tb_gallery.user_auth_id
        LEFT JOIN tb_image as user_auth_avatar_image_image ON tb_image.id = tb_user_auth_avatar_image.image_id
        LEFT JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = tb_gallery.user_auth_id
        LEFT JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_subscription_type.subscription_type_id
      WHERE
        tb_gallery.id = $1
      GROUP BY
        tb_gallery.id,
        tb_image_avatar.url,
        tb_user_auth.id,
        user_auth_avatar_image_image.url,
        tb_subscription_type.type
      ORDER BY
        tb_gallery.id
      `,
      values,
    );
    return list[0];
  }

  async like(
    body: UserGalleryPhotoLikeRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { id, current_user_id } = body;
      const { rows: userImageLikeList } = await pg.query(
        `
        SELECT
          *
        FROM
          tb_user_image_like
        WHERE
          tb_user_image_like.user_image_id = $1
          AND tb_user_image_like.user_auth_id = $2
        `,
        [id, current_user_id],
      );
      if (userImageLikeList.length > 0) {
        return {
          status: false,
          message: "User already liked the photo",
        };
      }
      await pg.query(
        `INSERT INTO tb_user_image_like (user_auth_id, user_image_id) VALUES($1, $2)`,
        [current_user_id, id],
      );

      const { rows: tb_publication_type_like_amount } = await pg.query(
        `
        SELECT 
          tb_publication_type_like_amount.*
        FROM
          tb_user_image_publication_type
        LEFT JOIN tb_publication_type_like_amount ON tb_publication_type_like_amount.publication_type_id = tb_user_image_publication_type.publication_type_id
        WHERE
            tb_user_image_publication_type.user_image_id = $1
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
        message: "Photo was liked successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async view(
    body: UserGalleryPhotoViewRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { id } = body;
      await pg.query(
        `
        UPDATE
          tb_user_image SET viewed_count = viewed_count + 1
        WHERE
          tb_user_image.id = $1
        `,
        [id],
      );

      return {
        status: true,
        message: "Photo was viewed successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
}
