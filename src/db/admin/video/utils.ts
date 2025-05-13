import path from "path";
import fs from "fs-extra";
import pg from "@/config/db";
import {
  AdminVideoCreateRequest,
  AdminVideoGetRequest,
  AdminVideoDeleteRequest,
  AdminVideoListRequest,
  AdminVideoSetPublicationTypeRequest,
  AdminVideoGetPublicationTypeRequest,
  AdminVideoEditRequest,
} from "@/types/request/admin/video";
import { ApiResponse } from "@/types/response";

export class VideoDB {
  async post(body: AdminVideoCreateRequest): Promise<ApiResponse<undefined>> {
    try {
      const { user_id, title, page_category_ids, video, thumbnail } = body;

      const { rows: image_list } = await pg.query(
        `INSERT INTO tb_image(url) values($1) RETURNING *;`,
        [thumbnail],
      );
      const thumbnailImageDBData = image_list[0];

      const { rows: video_list } = await pg.query(
        `INSERT INTO tb_video(url) values($1) RETURNING *;`,
        [video],
      );
      const videoDBData = video_list[0];

      const { rows: user_video_list } = await pg.query(
        `INSERT INTO tb_user_video(title, user_auth_id, video_id) values($1, $2, $3) RETURNING *;`,
        [title, user_id, videoDBData.id],
      );
      const userVideoDBData = user_video_list[0];

      await pg.query(
        `INSERT INTO tb_video_thumbnail(user_video_id, image_id) values($1, $2);`,
        [userVideoDBData.id, thumbnailImageDBData.id],
      );

      page_category_ids.map(async (item) => {
        await pg.query(
          `INSERT INTO tb_user_video_page_category(user_video_id, page_category_id) values($1, $2)`,
          [userVideoDBData.id, item],
        );
      });

      await pg.query(
        `INSERT INTO tb_user_video_publication_type(user_video_id, publication_type_id) values($1, $2)`,
        [userVideoDBData.id, 1],
      );

      return {
        status: true,
        message: "Video created successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async edit(body: AdminVideoEditRequest): Promise<ApiResponse<any>> {
    try {
      const { id, user_id, title, page_category_ids, thumbnail } = body;

      const { rows: videoList } = await pg.query(
        "SELECT * from tb_user_video WHERE id = $1",
        [id],
      );
      if (videoList.length === 0) {
        return {
          status: false,
          message: "User video does not exists!",
        };
      }

      if (user_id) {
        const { rows: userList } = await pg.query(
          "SELECT * from tb_user_auth WHERE id = $1",
          [user_id],
        );
        if (userList.length === 0) {
          return {
            status: false,
            message: "User does not exists!",
          };
        }
        await pg.query(
          `
          UPDATE
            tb_user_video
          SET
            user_auth_id = $2
          WHERE
            tb_user_video.id = $1
          `,
          [id, user_id],
        );
      }

      if (title) {
        await pg.query(
          `
          UPDATE
            tb_user_video
          SET
            title = $2
          WHERE
            tb_user_video.id = $1
          `,
          [id, title],
        );
      }

      if (page_category_ids) {
        const { rows: pageCategoryList } = await pg.query(
          "SELECT * from tb_page_category WHERE id = ANY(SELECT unnest(ARRAY[$1::int[]]))",
          [page_category_ids],
        );
        if (pageCategoryList.length != page_category_ids.length) {
          return {
            status: false,
            message: "Page categories does not exists!",
          };
        }
        await pg.query(
          `
          WITH x as (
            DELETE FROM
              tb_user_video_page_category
            WHERE
              tb_user_video_page_category.user_video_id = $1
          )
          INSERT INTO tb_user_video_page_category(user_video_id, page_category_id) SELECT $1, unnest(ARRAY[$2::int[]])
          `,
          [id, page_category_ids],
        );
      }

      if (thumbnail) {
        const { rows: oldImageList } = await pg.query(
          `
          WITH x AS (
            DELETE FROM
              tb_video_thumbnail
            WHERE
              tb_video_thumbnail.user_video_id = $1
            RETURNING *
          )
          DELETE FROM
            tb_image
          WHERE
            tb_image.id = ANY(SELECT x.image_id FROM x)
          RETURNING *`,
          [id],
        );
        oldImageList.map(async (elem) => {
          const filepath = path.resolve(elem.url);
          await fs.unlink(filepath);
        });
        await pg.query(
          `
          WITH x as (
            INSERT INTO tb_image (url) values($2) RETURNING id
          )
          INSERT INTO tb_video_thumbnail(user_video_id, image_id) SELECT $1, x.id FROM x
          `,
          [id, thumbnail],
        );
      }

      return {
        status: true,
        message: "Video edited successfully",
        data: await this.get({
          id: id,
        } as unknown as AdminVideoGetRequest),
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async get(query: AdminVideoGetRequest): Promise<any> {
    const { id } = query;
    const { rows: list } = await pg.query(
      `
      SELECT
        tb_user_video.id,
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
        CAST(
          COALESCE(
            (
              SELECT
                count(tb_user_video_like.id)
              FROM
                tb_user_video_like
              WHERE
                tb_user_video_like.user_video_id = tb_user_video.id
            ),
            '0'
          ) as INTEGER
        ) as likes_count,
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
      WHERE
        tb_user_video.id = $1
      GROUP BY
        tb_user_video.id,
        tb_video.url,
        tb_image.url,
        tb_user_auth.id,
        user_auth_avatar_image_image.url,
        tb_subscription_type.type,
        tb_publication_type
      `,
      [id],
    );

    return list.length > 0 ? list[0] : null;
  }
  async delete(
    query: AdminVideoDeleteRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { id } = query;

      await pg.query(
        `WITH 
          deleted as (DELETE FROM tb_video_thumbnail WHERE tb_video_thumbnail.user_video_id = $1 RETURNING image_id)
          DELETE FROM tb_image WHERE tb_image.id = ANY(SELECT deleted.image_id from deleted)`,
        [id],
      );
      await pg.query(
        `DELETE FROM tb_user_video_page_category WHERE tb_user_video_page_category.user_video_id = $1`,
        [id],
      );
      await pg.query(
        `WITH
        deleted as (DELETE FROM tb_user_video WHERE tb_user_video.id = $1 RETURNING video_id)
        DELETE FROM tb_video WHERE tb_video.id = ANY(SELECT deleted.video_id from deleted)`,
        [id],
      );
      await pg.query(
        `DELETE FROM tb_user_video_publication_type WHERE tb_user_video_publication_type.user_video_id = $1`,
        [id],
      );
      return {
        status: true,
        message: "Video deleted successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
  async list(body: AdminVideoListRequest): Promise<any[]> {
    const {
      user_id,
      page_category_id,
      publication_type_id,
      query,
      sort,
      order,
      limit,
      offset,
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
        CAST(
          COALESCE(
            (
              SELECT
                count(tb_user_video_like.id)
              FROM
                tb_user_video_like
              WHERE
                tb_user_video_like.user_video_id = tb_user_video.id
            ),
            '0'
          ) as INTEGER
        ) as likes_count,
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
      ${finalQuery}
      GROUP BY
        tb_user_video.id,
        tb_video.url,
        tb_image.url,
        tb_user_auth.id,
        user_auth_avatar_image_image.url,
        tb_subscription_type.type,
        tb_publication_type
      ORDER BY
        ${sortBy} ${orderBy}
      LIMIT $5
      OFFSET $6
        `,
      [
        user_id || `TRUE`,
        page_category_id || `TRUE`,
        sqlquery || `TRUE`,
        publication_type_id || `TRUE`,
        limit,
        offset || 0,
      ],
    );
    return list;
  }

  async setPublicationType(
    query: AdminVideoSetPublicationTypeRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { id, publication_type_id } = query;
      const { rows: tb_user_video } = await pg.query(
        `SELECT * FROM tb_user_video WHERE tb_user_video.id = $1`,
        [id],
      );
      const { rows: tb_publication_type } = await pg.query(
        `SELECT * FROM tb_publication_type WHERE tb_publication_type.id = $1`,
        [publication_type_id],
      );

      if (tb_user_video.length === 0 || tb_publication_type.length === 0) {
        return {
          status: false,
          message: "Video or publication type does not exist",
        };
      }
      const { rows: current_tb_publication_type } = await pg.query(
        `
        SELECT * FROM tb_user_video_publication_type
        WHERE
          tb_user_video_publication_type.user_video_id = $1
        `,
        [id],
      );
      if (current_tb_publication_type.length > 0) {
        await pg.query(
          `
          UPDATE
            tb_user_video_publication_type
          SET
            publication_type_id = $1
          WHERE
            tb_user_video_publication_type.user_video_id = $2
          `,
          [publication_type_id, id],
        );
      } else {
        await pg.query(
          `
          INSERT INTO tb_user_video_publication_type (user_video_id, publication_type_id) VALUES($1, $2)
          `,
          [id, publication_type_id],
        );
      }

      return {
        status: true,
        message: "Video publication type was set successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async getPublicationType(
    query: AdminVideoGetPublicationTypeRequest,
  ): Promise<any> {
    const { id } = query;
    const { rows: tb_publication_type } = await pg.query(
      `SELECT tb_publication_type.*
      FROM
        tb_user_video_publication_type
        LEFT JOIN tb_publication_type ON tb_publication_type.id = tb_user_video_publication_type.publication_type_id
      WHERE
        tb_user_video_publication_type.user_video_id = $1`,
      [id],
    );

    return tb_publication_type.length > 0 ? tb_publication_type[0] : null;
  }
}
