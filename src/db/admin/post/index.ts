import path from "path";
import fs from "fs/promises";
import pg from "@/config/db";
import {
  AdminPostApproveRequest,
  AdminPostDeleteRequest,
  AdminPostGetPublicationTypeRequest,
  AdminPostListRequest,
  AdminPostRequest,
  AdminPostSetPublicationTypeRequest,
  AdminPostUpdateRequest,
} from "@/types/request/admin/post";
import { ApiResponse } from "@/types/response";
import { ApiPostResponse } from "@/types/response/post";

export class PostDAO {
  async post(
    body: AdminPostRequest,
    images: string[],
  ): Promise<ApiResponse<undefined>> {
    try {
      const {
        user_id,
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
        tb_post(user_auth_id, title, description, price, phone, discount, post_category_id, post_sub_category_id, start_date, end_date, approved, waiting)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id`,
        [
          user_id,
          title,
          description,
          price,
          phone,
          discount,
          category_id,
          sub_category_id,
          start_date,
          end_date,
          true,
          false,
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
    body: AdminPostListRequest,
  ): Promise<ApiResponse<ApiPostResponse[]>> {
    try {
      const {
        category_id,
        sub_category_id,
        publication_type_id,
        title,
        description,
        limit,
        offset,
        query,
        sort,
        order,
      } = body;

      const categoryFilter = category_id
        ? "tb_post.post_category_id = $1"
        : "$1";
      const subCategoryFilter = category_id
        ? "tb_post.post_sub_category_id = $2"
        : "$2";

      const titleFilter = title ? "tb_post.title ILIKE $3" : "$3";
      const descriptionFilter = description
        ? "tb_post.description ILIKE $4"
        : "$4";
      const sqlquery = query ? "%" + query + "%" : null;
      const queryFilter = query
        ? `(tb_post.title ILIKE $5 OR
            tb_post.description ILIKE $5 OR
            tb_user_auth.name ILIKE $5)`
        : `$5`;
      const publicationTypeIdFilter = publication_type_id
        ? `tb_publication_type.id = $6`
        : `$6`;
      let sortBy = `tb_post.created_at`;
      switch (sort) {
        case "time":
          sortBy = `tb_post.created_at`;
          break;
        case "like":
          sortBy = `likes_count`;
          break;
        case "view":
          sortBy = `viewed_count`;
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
      const filterQuery = `WHERE ${categoryFilter} AND ${subCategoryFilter} AND ${titleFilter} AND ${descriptionFilter} AND ${queryFilter} AND ${publicationTypeIdFilter}`;

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
          tb_post.approved as approved,
          tb_post.waiting as waiting,
          tb_post.created_at as created_at,
          CAST(
            COALESCE(
              (
                SELECT
                  count(tb_post_like.id)
                FROM
                  tb_post_like
                WHERE
                  tb_post_like.post_id = tb_post.id
              ),
              '0'
            ) as INTEGER
          ) as likes_count,
          to_json(tb_publication_type) as publication_type
        FROM
          tb_post
          LEFT JOIN tb_post_publication_type ON tb_post_publication_type.post_id = tb_post.id
          LEFT JOIN tb_publication_type ON tb_publication_type.id = tb_post_publication_type.publication_type_id
          LEFT JOIN LATERAL
          (
          SELECT  post_id, image_id
          FROM    tb_post_image
          WHERE   tb_post_image.post_id = tb_post.id
          limit 1
          ) tb_post_image ON true
          JOIN tb_image ON tb_image.id = tb_post_image.image_id
        ${filterQuery}
        GROUP BY
          tb_post.id,
          tb_image.url,
          tb_publication_type
        ORDER BY
          ${sortBy} ${orderBy}
        LIMIT $7
        OFFSET $8
        `,
        [
          category_id || "TRUE",
          sub_category_id || "TRUE",
          title ? `%${title}%` : "TRUE",
          description ? `%${description}%` : "TRUE",
          sqlquery || `TRUE`,
          publication_type_id || `TRUE`,
          limit || 10,
          offset || 0,
        ],
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

  async get(id: string): Promise<ApiResponse<ApiPostResponse>> {
    try {
      const { rows: list } = await pg.query<ApiPostResponse>(
        `
        SELECT
          tb_post.id as id,
          tb_post.title as title,
          tb_post.description as description,
          json_agg(DISTINCT tb_image.*) images,
          json_agg(DISTINCT tb_tag.*) tags,
          to_json(
            json_build_object(
              'id',
              tb_user_auth.id,
              'name',
              tb_user_auth.name,
              'image',
              to_json(tb_user_image.*)
            )
          ) user,
          tb_post.phone as phone,
          tb_post.approved as approved,
          tb_post.viewed_count as viewed_count,
          tb_post.price as price,
          tb_post.discount as discount,
          tb_post.created_at as created_at,
          tb_post.start_date as start_date,
          tb_post.end_date as end_date,
          CAST(
            COALESCE(
              (
                SELECT
                  count(tb_post_like.id)
                FROM
                  tb_post_like
                WHERE
                  tb_post_like.post_id = tb_post.id
              ),
              '0'
            ) as INTEGER
          ) as likes_count,
          to_json(tb_publication_type) as publication_type
        FROM
          tb_post
          LEFT JOIN tb_post_publication_type ON tb_post_publication_type.post_id = tb_post.id
          LEFT JOIN tb_publication_type ON tb_publication_type.id = tb_post_publication_type.publication_type_id
        
          LEFT JOIN LATERAL (
            SELECT
              id,
              tag_id
            FROM
              tb_post_tag
            WHERE
              tb_post_tag.post_id = tb_post.id
          ) tb_post_tag ON true
          LEFT JOIN LATERAL (
            SELECT
              id,
              name
            FROM
              tb_tag
            WHERE
              tb_post_tag.tag_id = tb_tag.id
          ) tb_tag ON true
          LEFT JOIN LATERAL (
            SELECT
              id,
              image_id
            FROM
              tb_post_image
            WHERE
              tb_post_image.post_id = tb_post.id
          ) tb_post_image ON true
          LEFT JOIN LATERAL (
            SELECT
              id,
              url
            FROM
              tb_image
            WHERE
              tb_post_image.image_id = tb_image.id
          ) tb_image ON true
          JOIN tb_user_auth ON tb_user_auth.id = tb_post.user_auth_id
          JOIN tb_user_auth_avatar_image ON tb_user_auth_avatar_image.user_auth_id = tb_post.user_auth_id
          LEFT JOIN LATERAL (
            SELECT
              id,
              url
            FROM
              tb_image
            WHERE
              tb_user_auth_avatar_image.image_id = tb_image.id
          ) tb_user_image ON true
        WHERE
          tb_post.id = $1
        GROUP BY
          tb_post.id,
          tb_user_auth.id,
          tb_user_image.*,
          tb_publication_type
        ORDER BY
          created_at DESC
        `,
        [id],
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

  async approve(
    id: string,
    body: AdminPostApproveRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { approve } = body;
      await pg.query<ApiPostResponse>(
        `UPDATE tb_post SET approved = $1, waiting = false WHERE id = $2`,
        [approve, id],
      );

      return {
        status: true,
        message: "Post approved",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async setPublicationType(
    query: AdminPostSetPublicationTypeRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { id, publication_type_id } = query;
      const { rows: tb_post } = await pg.query(
        `SELECT * FROM tb_post WHERE tb_post.id = $1`,
        [id],
      );
      const { rows: tb_publication_type } = await pg.query(
        `SELECT * FROM tb_publication_type WHERE tb_publication_type.id = $1`,
        [publication_type_id],
      );

      if (tb_post.length === 0 || tb_publication_type.length === 0) {
        return {
          status: false,
          message: "Post or publication type does not exist",
        };
      }
      const { rows: current_tb_publication_type } = await pg.query(
        `
        SELECT * FROM tb_post_publication_type
        WHERE
          tb_post_publication_type.post_id = $1
        `,
        [id],
      );
      if (current_tb_publication_type.length > 0) {
        await pg.query(
          `
          UPDATE
            tb_post_publication_type
          SET
            publication_type_id = $1
          WHERE
            tb_post_publication_type.post_id = $2
          `,
          [publication_type_id, id],
        );
      } else {
        await pg.query(
          `
          INSERT INTO tb_post_publication_type (post_id, publication_type_id) VALUES($1, $2)
          `,
          [id, publication_type_id],
        );
      }

      return {
        status: true,
        message: "Post publication type was set successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async getPublicationType(
    query: AdminPostGetPublicationTypeRequest,
  ): Promise<any> {
    const { id } = query;
    const { rows: tb_publication_type } = await pg.query(
      `SELECT tb_publication_type.*
      FROM
        tb_post_publication_type
        LEFT JOIN tb_publication_type ON tb_publication_type.id = tb_post_publication_type.publication_type_id
      WHERE
        tb_post_publication_type.post_id = $1`,
      [id],
    );

    return tb_publication_type.length > 0 ? tb_publication_type[0] : null;
  }

  async delete(body: AdminPostDeleteRequest): Promise<ApiResponse<undefined>> {
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

  async update(body: AdminPostUpdateRequest): Promise<ApiResponse<undefined>> {
    try {
      const {
        post_id,
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
          tb_post.id = $1`,
        [post_id],
      );

      if (checkPostList.length == 0) {
        return {
          status: false,
          message: "Post not found!",
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
