import path from "path";
import fs from "fs-extra";
import { format, fromUnixTime } from "date-fns";
import pg from "@/config/db";
import {
  ApiPostDeleteRequest,
  ApiPostListRequest,
  ApiPostRequest,
  UserPostGetRequest,
  UserPostLikeRequest,
  UserPostUpdateRequest,
  UserPostViewRequest,
} from "@/types/request/post";
import { ApiResponse } from "@/types/response";
import { ApiPostResponse } from "@/types/response/post";

export class PostDB {
  async post(
    body: ApiPostRequest,
    images: string[],
    userId: number,
  ): Promise<ApiResponse<undefined>> {
    try {
      const {
        title,
        description,
        price,
        phone,
        discount,
        tags,
        category_id,
        sub_category_id,
        start_date,
        end_date,
      } = body;
      const { rows: postList } = await pg.query<{ id: number }>(
        `INSERT INTO
        tb_post(user_auth_id, title, description, price, phone, discount, post_category_id, post_sub_category_id, start_date, end_date)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id`,
        [
          userId,
          title,
          description,
          price,
          phone,
          discount,
          category_id,
          sub_category_id,
          start_date,
          end_date,
        ],
      );
      const postId = postList[0].id;
      if (tags.length > 0) {
        const { rows: tagList } = await pg.query(
          `INSERT INTO tb_tag(name) SELECT unnest(ARRAY[$1::varchar[]]) RETURNING id`,
          [JSON.parse(tags)],
        );
        const tagIds = tagList.reduce((acc, curValue) => {
          return [...acc, curValue.id];
        }, []);
        await pg.query(
          `INSERT INTO tb_post_tag(post_id, tag_id) SELECT $1, unnest(ARRAY[$2::int[]])`,
          [postId, tagIds],
        );
      }

      const { rows: imageList } = await pg.query(
        "INSERT INTO tb_image(url) SELECT unnest(ARRAY[$1::varchar[]]) RETURNING id",
        [images],
      );
      const imageIds = imageList.reduce((acc, curValue) => {
        return [...acc, curValue.id];
      }, []);
      await pg.query(
        "INSERT INTO tb_post_image(post_id, image_id) SELECT $1, unnest($2::int[])",
        [postId, imageIds],
      );

      await pg.query(
        `INSERT INTO tb_post_publication_type(post_id, publication_type_id) values($1, $2)`,
        [postId, 1],
      );

      return {
        status: true,
        message: "Post created successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async list(
    body: ApiPostListRequest,
  ): Promise<ApiResponse<ApiPostResponse[]>> {
    try {
      const {
        category_id,
        sub_category_id,
        publication_type_id,
        user_id,
        current_user_id,
        limit,
        offset,
        query,
        sort,
        order,
        status,
      } = body;
      const categoryFilter = category_id
        ? "tb_post.post_category_id = $1"
        : "$1";
      const subCategoryFilter = sub_category_id
        ? "tb_post.post_sub_category_id = $2"
        : "$2";
      const userIdFilter = user_id ? "tb_post.user_auth_id = $3" : "$3";
      const sqlquery = query ? "%" + query + "%" : null;
      const queryFilter = query
        ? ` tb_post.title ILIKE $4 OR
            tb_post.description ILIKE $4 OR
            tb_user_auth.name ILIKE $4`
        : `$4`;
      const publicationTypeIdFilter = publication_type_id
        ? `tb_publication_type.id = $5`
        : `$5`;

      let statusFilter = `tb_post.approved = TRUE`;
      switch (status) {
        case "waiting":
          statusFilter = `tb_post.waiting = TRUE`;
          break;
        case "approved":
          statusFilter = `tb_post.approved = TRUE`;
          break;
        case "declined":
          statusFilter = `tb_post.waiting = FALSE AND tb_post.approved = FALSE`;
          break;
      }

      let sortBy = `tb_post.created_at`;
      switch (sort) {
        case "time":
          sortBy = `tb_post.created_at`;
          break;
        case "like":
          sortBy = `like_count`;
          break;
        case "view":
          sortBy = `tb_post.viewed_count`;
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
      const values = [
        category_id || "TRUE",
        sub_category_id || "TRUE",
        user_id || "TRUE",
        sqlquery || `TRUE`,
        publication_type_id || `TRUE`,
        limit,
        offset || 0,
      ];
      const filterQuery = `WHERE ${categoryFilter} AND ${subCategoryFilter} AND ${userIdFilter} AND ${queryFilter} AND ${publicationTypeIdFilter} AND ${statusFilter}`;
      if (current_user_id) {
        values.push(current_user_id);
      }
      const isLikedParam = current_user_id
        ? `CAST(COALESCE((SELECT count(tb_post_like.id) FROM tb_post_like WHERE tb_post_like.post_id = tb_post.id AND tb_post_like.user_auth_id = $8), '0') as INTEGER) as is_liked,`
        : ``;

      const { rows: list } = await pg.query<ApiPostResponse>(
        `
        SELECT
          tb_post.id as id,
          CAST(COUNT(tb_post.id) OVER() AS INTEGER) as items_full_count,
          tb_post.title as title,
          tb_post.description as description,
          tb_image.url as image,
          tb_post.viewed_count as viewed_count,
          tb_post.price as price,
          tb_post.discount as discount,
          tb_post.created_at as created_at,
          jsonb_build_object(
            'id', tb_user_auth.id,
            'name', tb_user_auth.name,
            'avatar_image',
            jsonb_build_object('url', user_auth_avatar_image_image.url),
            'role', tb_subscription_type.type
          ) as user,
          tb_post_like_statistic.like_count as like_count,
          ${isLikedParam}
          to_json(tb_publication_type) as publication_type
        FROM
          tb_post
          LEFT JOIN tb_post_publication_type ON tb_post_publication_type.post_id = tb_post.id
          LEFT JOIN tb_publication_type ON tb_publication_type.id = tb_post_publication_type.publication_type_id
        
          LEFT JOIN tb_user_auth ON tb_user_auth.id = tb_post.user_auth_id
          LEFT JOIN tb_user_auth_avatar_image ON tb_user_auth_avatar_image.user_auth_id = tb_post.user_auth_id
          LEFT JOIN tb_image as user_auth_avatar_image_image ON user_auth_avatar_image_image.id = tb_user_auth_avatar_image.image_id
          
          LEFT JOIN tb_post_like_statistic ON tb_post_like_statistic.post_id = tb_post.id
          LEFT JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = tb_post.user_auth_id
          LEFT JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_subscription_type.subscription_type_id
      
          LEFT JOIN LATERAL (
            SELECT
              post_id,
              image_id
            FROM
              tb_post_image
            WHERE
              tb_post_image.post_id = tb_post.id
            limit
              1
          ) tb_post_image ON true
          JOIN tb_image ON tb_image.id = tb_post_image.image_id
        ${filterQuery}
        GROUP BY
          tb_post.id,
          tb_user_auth.id,
          tb_image.url,
          user_auth_avatar_image_image.url,
          tb_subscription_type.type,
          tb_post_like_statistic.like_count,
          tb_publication_type
        ORDER BY
          ${sortBy} ${orderBy}
        LIMIT $6
        OFFSET $7
        `,
        values,
      );

      return {
        status: true,
        message: "Post list",
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
    publicationTypeId?: number,
  ): Promise<ApiResponse<{ count: number }>> {
    try {
      const publicationTypeFilter =
        publicationTypeId === 3
          ? "tb_post_publication_type.publication_type_id = 3"
          : "tb_post_publication_type.publication_type_id != 3";

      const lastFetched =
        publicationTypeId === 3
          ? session.last_fetched_selected_post_date
          : session.last_fetched_post_date;

      const filterQuery = `${publicationTypeFilter}`;

      if (lastFetchedDate) {
        const date = format(
          fromUnixTime(Math.floor(lastFetchedDate / 1000)),
          "yyyy-MM-dd HH:mm:ss",
        );

        const { rowCount: count } = await pg.query(
          `SELECT tb_post.id as id
          FROM tb_post
          JOIN tb_post_publication_type ON tb_post_publication_type.post_id = tb_post.id
          WHERE
          created_at BETWEEN $1 AND NOW()
          AND
          approved = TRUE
          AND
          ${filterQuery}
          `,
          [date],
        );

        return {
          status: true,
          message: "Post badge count",
          data: {
            count: count > 0 ? count - 1 : count,
          },
        };
      }

      if (session && lastFetched) {
        const date = format(
          fromUnixTime(Math.floor(lastFetched / 1000)),
          "yyyy-MM-dd HH:mm:ss",
        );

        const { rowCount: count } = await pg.query(
          `SELECT tb_post.id as id
          FROM tb_post
          JOIN tb_post_publication_type ON tb_post_publication_type.post_id = tb_post.id
          WHERE
          created_at BETWEEN $1 AND NOW()
          AND
          approved = TRUE
          AND
          ${filterQuery}`,
          [date],
        );

        return {
          status: true,
          message: "Post badge count",
          data: {
            count: count > 0 ? count - 1 : count,
          },
        };
      }

      const { rowCount: count } = await pg.query(
        `SELECT tb_post.id as id
        FROM tb_post
        JOIN tb_post_publication_type ON tb_post_publication_type.post_id = tb_post.id
        WHERE
        approved = TRUE
        AND
        ${filterQuery}`,
      );

      return {
        status: true,
        message: "Post badge count",
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

  async get(body: UserPostGetRequest): Promise<ApiResponse<ApiPostResponse>> {
    try {
      const { id, current_user_id } = body;
      const values = [];
      if (current_user_id) {
        values.push(current_user_id);
      }
      const isLikedParam = current_user_id
        ? `CAST(COALESCE((SELECT count(tb_post_like.id) FROM tb_post_like WHERE tb_post_like.post_id = tb_post.id AND tb_post_like.user_auth_id = $2), '0') as INTEGER) as is_liked,`
        : ``;
      const { rows: list } = await pg.query<ApiPostResponse>(
        `
        SELECT
          tb_post.id as id,
          tb_post.title as title,
          tb_post.description as description,
          json_agg(DISTINCT tb_image.*) images,
          json_agg(DISTINCT tb_tag.*) tags,
          json_build_object(
            'id', tb_user_auth.id,
            'name', tb_user_auth.name,
            'role', tb_subscription_type.type,
            'avatar_image', jsonb_build_object('url', tb_user_image.url)
          ) as user,
          tb_post.phone as phone,
          tb_post.viewed_count as viewed_count,
          tb_post.price as price,
          tb_post.discount as discount,
          tb_post.created_at as created_at,
          tb_post.start_date as start_date,
          tb_post.end_date as end_date,
          tb_post_like_statistic.like_count as like_count,
          tb_post.next_id as next_id,
          tb_post.prev_id as prev_id,
          ${isLikedParam}
          to_json(tb_publication_type) as publication_type
        FROM (
          select
            id,
            user_auth_id,
            title,
            description,
            phone,
            viewed_count,
            price,
            discount,
            created_at,
            start_date,
            end_date,
            lag(id) over (
              order by
                id
            ) as prev_id,
            lead(id) over (
              order by
                id
            ) as next_id
          from
            tb_post
          WHERE tb_post.approved = TRUE
          ) as tb_post

          LEFT JOIN tb_user_auth ON tb_user_auth.id = tb_post.user_auth_id
          LEFT JOIN tb_user_subscription_type ON tb_user_subscription_type.user_auth_id = tb_user_auth.id
          LEFT JOIN tb_subscription_type ON tb_subscription_type.id = tb_user_subscription_type.subscription_type_id

          LEFT JOIN tb_post_like_statistic ON tb_post_like_statistic.post_id = tb_post.id
          LEFT JOIN tb_post_publication_type ON tb_post_publication_type.post_id = tb_post.id
          LEFT JOIN tb_publication_type ON tb_publication_type.id = tb_post_publication_type.publication_type_id

          LEFT JOIN LATERAL (
            SELECT
              tb_tag.id as id,
              tb_tag.name as name
            FROM
              tb_post_tag
            JOIN tb_tag ON tb_post_tag.tag_id = tb_tag.id
            WHERE
              tb_post_tag.post_id = tb_post.id
          ) tb_tag ON true

          LEFT JOIN LATERAL (
            SELECT
              tb_image.id as id,
              tb_image.url as url
            FROM
              tb_post_image
            JOIN tb_image ON tb_post_image.image_id = tb_image.id
            WHERE
              tb_post_image.post_id = tb_post.id
          ) tb_image ON true
          
          LEFT JOIN LATERAL (
            SELECT
              tb_image.url as url
            FROM tb_user_auth_avatar_image
            JOIN tb_image ON tb_user_auth_avatar_image.image_id = tb_image.id
            WHERE
              tb_user_auth_avatar_image.user_auth_id = tb_post.user_auth_id
          ) tb_user_image ON true

        WHERE
          tb_post.id = $1
        GROUP BY
          tb_post.id,
          tb_post.title,
          tb_post.description,
          tb_post.phone,
          tb_post.viewed_count,
          tb_post.price,
          tb_post.discount,
          tb_post.next_id,
          tb_post.prev_id,
          tb_post.created_at,
          tb_post.start_date,
          tb_post.end_date,
          tb_user_auth.id,
          tb_user_image.url,
          tb_post_like_statistic.like_count,
          tb_subscription_type.type,
          tb_publication_type.*
        ORDER BY
          created_at DESC
        `,
        [id, ...values],
      );

      if (list.length === 0) {
        return {
          status: false,
          message: "Post doesn't exists!",
        };
      }

      return {
        status: true,
        message: "Post",
        data: list[0],
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async like(body: UserPostLikeRequest): Promise<ApiResponse<undefined>> {
    try {
      const { id, current_user_id } = body;
      const { rows: likeList } = await pg.query(
        `SELECT * FROM tb_post_like WHERE tb_post_like.post_id = $1 AND tb_post_like.user_auth_id = $2`,
        [id, current_user_id],
      );
      if (likeList.length > 0) {
        return {
          status: false,
          message: "User already liked the post",
        };
      }
      await pg.query(
        `INSERT INTO tb_post_like (user_auth_id, post_id) VALUES($1, $2)`,
        [current_user_id, id],
      );

      const { rows: tb_publication_type_like_amount } = await pg.query(
        `
        SELECT 
          tb_publication_type_like_amount.*
        FROM
          tb_post_publication_type
        LEFT JOIN tb_publication_type_like_amount ON tb_publication_type_like_amount.publication_type_id = tb_post_publication_type.publication_type_id
        WHERE
            tb_post_publication_type.post_id = $1
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
        message: "Post was liked successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async view(body: UserPostViewRequest): Promise<ApiResponse<undefined>> {
    try {
      const { id } = body;
      await pg.query(
        `
        UPDATE
          tb_post SET viewed_count = viewed_count + 1
        WHERE
          tb_post.id = $1
        `,
        [id],
      );

      return {
        status: true,
        message: "Post was viewed successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async delete(body: ApiPostDeleteRequest): Promise<ApiResponse<undefined>> {
    try {
      const { id } = body;
      const { rows: imageList } = await pg.query(
        `
        WITH
          deleted_post_tag as (DELETE FROM tb_post_tag WHERE tb_post_tag.post_id = $1 RETURNING *),
          deleted_tag as (DELETE FROM tb_tag WHERE tb_tag.id = ANY(SELECT deleted_post_tag.tag_id FROM deleted_post_tag) RETURNING *),
          deleted_post_publication_type as (DELETE FROM tb_post_publication_type WHERE tb_post_publication_type.post_id = $1 RETURNING *),
          deleted_post_image as (DELETE FROM tb_post_image WHERE tb_post_image.post_id = $1 RETURNING *),
          deleted_post_like as (DELETE FROM tb_post_like WHERE tb_post_like.post_id = $1 RETURNING *),
          deleted_post as (DELETE FROM tb_post WHERE tb_post.id = $1 RETURNING *)
          DELETE FROM tb_image WHERE tb_image.id = ANY(SELECT deleted_post_image.image_id FROM deleted_post_image) RETURNING *
        `,
        [id],
      );
      imageList.map(async (elem) => {
        const filepath = path.resolve(elem.url);
        await fs.unlink(filepath);
      });

      return {
        status: true,
        message: "Post deleted successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async update(body: UserPostUpdateRequest): Promise<ApiResponse<undefined>> {
    try {
      const {
        post_id,
        current_user_id,
        title,
        description,
        phone,
        price,
        discount,
        tags,
        category_id,
        sub_category_id,
        start_date,
        end_date,
        images,
      } = body;

      const { rows: checkPostList } = await pg.query(
        `SELECT
          tb_post.id
        FROM
          tb_post
        WHERE
          tb_post.id = $1 AND tb_post.user_auth_id = $2`,
        [post_id, current_user_id],
      );

      if (checkPostList.length == 0) {
        return {
          status: false,
          message: "Post does not exist or access is denied!",
        };
      }

      if (title) {
        await pg.query(
          `UPDATE
            tb_post
          SET
            title = $2 
          WHERE tb_post.id = $1`,
          [post_id, title],
        );
      }

      if (description) {
        await pg.query(
          `UPDATE
            tb_post
          SET
            description = $2 
          WHERE tb_post.id = $1`,
          [post_id, description],
        );
      }

      if (phone) {
        await pg.query(
          `UPDATE
            tb_post
          SET
            phone = $2 
          WHERE tb_post.id = $1`,
          [post_id, phone],
        );
      }

      if (price) {
        await pg.query(
          `UPDATE
            tb_post
          SET
            price = $2 
          WHERE tb_post.id = $1`,
          [post_id, price],
        );
      }

      if (discount) {
        await pg.query(
          `UPDATE
            tb_post
          SET
            discount = $2 
          WHERE tb_post.id = $1`,
          [post_id, discount],
        );
      }

      if (category_id) {
        await pg.query(
          `UPDATE
            tb_post
          SET
            post_category_id = $2 
          WHERE tb_post.id = $1`,
          [post_id, category_id],
        );
      }

      if (sub_category_id) {
        await pg.query(
          `UPDATE
            tb_post
          SET
            post_sub_category_id = $2 
          WHERE tb_post.id = $1`,
          [post_id, sub_category_id],
        );
      }

      if (start_date) {
        await pg.query(
          `UPDATE
            tb_post
          SET
            start_date = $2 
          WHERE tb_post.id = $1`,
          [post_id, start_date],
        );
      }

      if (end_date) {
        await pg.query(
          `UPDATE
            tb_post
          SET
            end_date = $2 
          WHERE tb_post.id = $1`,
          [post_id, end_date],
        );
      }

      if (tags && tags.length > 0) {
        await pg.query(
          `WITH x AS (
            DELETE FROM
              tb_post_tag
            WHERE
              tb_post_tag.post_id = $1
            RETURNING *)
          DELETE FROM
            tb_tag
          WHERE
            tb_tag.id = ANY(SELECT x.tag_id FROM x)`,
          [post_id],
        );
        const { rows: tagList } = await pg.query(
          `INSERT INTO tb_tag(name) SELECT unnest(ARRAY[$1::varchar[]]) RETURNING id`,
          [JSON.parse(tags)],
        );
        const tagIds = tagList.reduce((acc, curValue) => {
          return [...acc, curValue.id];
        }, []);
        await pg.query(
          `INSERT INTO tb_post_tag(post_id, tag_id) SELECT $1, unnest(ARRAY[$2::int[]])`,
          [post_id, tagIds],
        );
      }

      if (images) {
        const { rows: oldImageList } = await pg.query(
          `WITH x AS (
            DELETE FROM
              tb_post_image
            WHERE
              tb_post_image.post_id = $1
            RETURNING *)
          DELETE FROM
            tb_image
          WHERE
            tb_image.id = ANY(SELECT x.image_id FROM x)
          RETURNING *`,
          [post_id],
        );
        oldImageList.map(async (elem) => {
          const filepath = path.resolve(elem.url);
          await fs.unlink(filepath);
        });

        await pg.query(
          `WITH imgs AS (
            INSERT INTO
              tb_image(url) SELECT unnest(ARRAY[$1::varchar[]])
            RETURNING id)
          INSERT INTO
            tb_post_image(post_id, image_id) SELECT $2, imgs.id FROM imgs
          `,
          [images, post_id],
        );
      }

      return {
        status: true,
        message: "Post edited successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
}
