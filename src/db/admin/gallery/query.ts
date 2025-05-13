import path from "path";
import fs from "fs-extra";
import dotenv from "dotenv";
import pg from "@/config/db";
import { ApiResponse } from "@/types/response";
import {
  AdminGalleryAddImageRequest,
  AdminGalleryCreateRequest,
  AdminGalleryDeleteImageRequest,
  AdminGalleryDeleteRequest,
  AdminGalleryEditRequest,
  AdminGalleryGetRequest,
  AdminGalleryListRequest,
  AdminGalleryPhotoGetPublicationTypeRequest,
  AdminGalleryPhotoSetPublicationTypeRequest,
} from "@/types/request/admin/gallery";

dotenv.config();

export class GalleryDB {
  async insert(
    body: AdminGalleryCreateRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { title, user_id, avatar_image, images, page_category_id } = body;
      const { rows: list } = await pg.query(
        `SELECT tb_page_category.id from tb_page_category WHERE tb_page_category.id = $1`,
        [page_category_id],
      );
      if (list.length === 0) {
        return {
          status: false,
          message: "Wrong page_category_id!",
        };
      }
      const { rows: imagesDB } = await pg.query(
        "INSERT INTO tb_image (url) SELECT unnest(ARRAY[$1::varchar[]]) RETURNING id",
        [images],
      );
      const imagesIds = imagesDB.map((elem) => elem.id);

      const { rows: userImagesDB } = await pg.query(
        "INSERT INTO tb_user_image (user_auth_id, image_id) SELECT $1, unnest(ARRAY[$2::int[]]) RETURNING *",
        [user_id, imagesIds],
      );
      const userImagesDBIds = userImagesDB.map((elem) => elem.id);

      const { rows: avatar_image_list } = await pg.query(
        "INSERT INTO tb_image (url) VALUES($1) RETURNING *",
        [avatar_image],
      );
      const avatar_image_id = avatar_image_list[0].id;

      const { rows: gallery_list } = await pg.query(
        "INSERT INTO tb_gallery (title, user_auth_id, image_id) VALUES($1, $2, $3) RETURNING *",
        [title, user_id, avatar_image_id],
      );
      const gallery = gallery_list[0];

      await pg.query(
        "INSERT INTO tb_gallery_page_category (gallery_id, page_category_id) VALUES($1, $2)",
        [gallery.id, page_category_id],
      );

      await pg.query(
        "INSERT INTO tb_gallery_user_image (gallery_id, user_image_id)  SELECT $1, unnest(ARRAY[$2::int[]])",
        [gallery.id, userImagesDBIds],
      );

      await pg.query(
        `INSERT INTO tb_user_image_publication_type(user_image_id, publication_type_id) SELECT unnest(ARRAY[$1::int[]]), $2`,
        [userImagesDBIds, 1],
      );

      return {
        status: true,
        message: "Gallery created successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async edit(body: AdminGalleryEditRequest): Promise<ApiResponse<any>> {
    try {
      const { gallery_id, title, user_id, avatar_image, page_category_id } =
        body;

      const { rows: galleryList } = await pg.query(
        `SELECT * FROM tb_gallery WHERE tb_gallery.id = $1`,
        [gallery_id],
      );
      if (galleryList.length === 0) {
        return {
          status: false,
          message: "Wrong gallery_id!",
        };
      }
      const galleryData = galleryList[0];

      if (!galleryData) {
        return {
          status: false,
          message: "Wrong gallery_id!",
        };
      }

      if (title) {
        await pg.query(
          `
          UPDATE
            tb_gallery
          SET
            title = $2
          WHERE
            tb_gallery.id = $1
          `,
          [gallery_id, title],
        );
      }

      if (user_id) {
        const { rows: list } = await pg.query(
          `SELECT tb_user_auth.id from tb_user_auth WHERE tb_user_auth.id = $1`,
          [user_id],
        );
        if (list.length === 0) {
          return {
            status: false,
            message: "Wrong user_id!",
          };
        }
        await pg.query(
          `
          UPDATE
            tb_gallery
          SET
            user_auth_id = $2
          WHERE
            tb_gallery.id = $1
          `,
          [gallery_id, user_id],
        );
      }

      if (avatar_image) {
        const { rows: imageList } = await pg.query(
          `INSERT INTO tb_image(url) values($1) RETURNING *`,
          [avatar_image],
        );
        await pg.query(
          `
          UPDATE
            tb_gallery
          SET
            image_id = $2
          WHERE
            tb_gallery.id = $1
          `,
          [gallery_id, imageList[0].id],
        );
        const { rows: oldImageList } = await pg.query(
          "DELETE from tb_image WHERE tb_image.id = $1 RETURNING *",
          [galleryData.image_id],
        );
        oldImageList.map(async (elem) => {
          const filepath = path.resolve(elem.url);
          await fs.unlink(filepath);
        });
      }

      if (page_category_id) {
        const { rows: list } = await pg.query(
          `SELECT tb_page_category.id from tb_page_category WHERE tb_page_category.id = $1`,
          [page_category_id],
        );
        if (list.length === 0) {
          return {
            status: false,
            message: "Wrong page_category_id!",
          };
        }
        await pg.query(
          `
          UPDATE
            tb_gallery_page_category
          SET
            page_category_id = $2
          WHERE
            tb_gallery_page_category.gallery_id = $1
          `,
          [gallery_id, page_category_id],
        );
      }

      return {
        status: true,
        message: "Gallery edited successfully",
        data: await this.get({
          id: gallery_id,
        } as unknown as AdminGalleryGetRequest),
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async addImages(
    body: AdminGalleryAddImageRequest,
  ): Promise<ApiResponse<any>> {
    try {
      const { gallery_id, images } = body;

      const { rows: galleryList } = await pg.query(
        `SELECT * FROM tb_gallery WHERE tb_gallery.id = $1`,
        [gallery_id],
      );
      if (galleryList.length === 0) {
        return {
          status: false,
          message: "Wrong gallery_id!",
        };
      }
      const galleryData = galleryList[0];

      const { rows: imagesDB } = await pg.query(
        "INSERT INTO tb_image (url) SELECT unnest(ARRAY[$1::varchar[]]) RETURNING id",
        [images],
      );
      const imagesIds = imagesDB.map((elem) => elem.id);

      const { rows: userImagesDB } = await pg.query(
        "INSERT INTO tb_user_image (user_auth_id, image_id) SELECT $1, unnest(ARRAY[$2::int[]]) RETURNING *",
        [galleryData.user_auth_id, imagesIds],
      );
      const userImagesDBIds = userImagesDB.map((elem) => elem.id);

      await pg.query(
        "INSERT INTO tb_gallery_user_image (gallery_id, user_image_id)  SELECT $1, unnest(ARRAY[$2::int[]])",
        [gallery_id, userImagesDBIds],
      );

      await pg.query(
        `INSERT INTO tb_user_image_publication_type(user_image_id, publication_type_id) SELECT unnest(ARRAY[$1::int[]]), $2`,
        [userImagesDBIds, 1],
      );

      return {
        status: true,
        message: "Gallery images added successfully!",
        data: await this.get({
          id: gallery_id,
        } as unknown as AdminGalleryGetRequest),
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async deleteImages(
    body: AdminGalleryDeleteImageRequest,
  ): Promise<ApiResponse<any>> {
    try {
      const { gallery_id, image_ids } = body;
      const { rows: galleryList } = await pg.query(
        `SELECT * FROM tb_gallery WHERE tb_gallery.id = $1`,
        [gallery_id],
      );
      if (galleryList.length === 0) {
        return {
          status: false,
          message: "Wrong gallery_id!",
        };
      }

      const { rows: oldImageList } = await pg.query(
        `WITH x AS (
          DELETE FROM
            tb_user_image
          WHERE
            tb_user_image.id = ANY(SELECT unnest(ARRAY[$1::int[]]))
          RETURNING *
        )
        DELETE FROM
          tb_image
        WHERE
          tb_image.id = ANY(SELECT x.image_id FROM x)
        RETURNING *`,
        [image_ids],
      );

      oldImageList.map(async (elem) => {
        const filepath = path.resolve(elem.url);
        await fs.unlink(filepath);
      });

      return {
        status: true,
        message: "Gallery images deleted successfully!",
        data: await this.get({
          id: gallery_id,
        } as unknown as AdminGalleryGetRequest),
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async list(body: AdminGalleryListRequest): Promise<any[]> {
    const {
      user_id,
      page_category_id,
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
        CAST(COUNT(tb_user_image.id) as INTEGER) as image_count,
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
      [
        user_id || `TRUE`,
        page_category_id || `TRUE`,
        sqlquery || `TRUE`,
        publication_type_id || `TRUE`,
        limit || 10,
        offset || 0,
      ],
    );
    return list;
  }

  async get(body: AdminGalleryGetRequest): Promise<any> {
    const { id } = body;
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
      [id],
    );
    return list[0];
  }

  async delete(
    body: AdminGalleryDeleteRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { id } = body;
      const { rows: galleryList } = await pg.query(
        `SELECT tb_gallery.* from tb_gallery WHERE tb_gallery.id = $1`,
        [id],
      );
      if (galleryList.length === 0) {
        return {
          status: false,
          message: "Wrong gallery id!",
        };
      }
      const gallery = galleryList[0];

      await pg.query(
        `DELETE FROM tb_gallery_page_category WHERE tb_gallery_page_category.gallery_id = $1`,
        [gallery.id],
      );
      // Delete gallery images
      await pg.query(
        `
        WITH
          deleted_user_image as (
            DELETE FROM
              tb_gallery_user_image
            WHERE
              tb_gallery_user_image.gallery_id = $1 RETURNING tb_gallery_user_image.user_image_id
          ),
          deleted_user_image_pub_type as (
            DELETE FROM
              tb_user_image_publication_type
            WHERE
              tb_user_image_publication_type.user_image_id = ANY(
                SELECT
                  deleted_user_image.user_image_id
                FROM
                  deleted_user_image
              ) RETURNING *
          ),
          deleted_image as (
            DELETE FROM
              tb_user_image
            WHERE
              tb_user_image.id = ANY(
                SELECT
                  deleted_user_image.user_image_id
                FROM
                  deleted_user_image
              ) RETURNING tb_user_image.image_id
          )
        DELETE FROM
          tb_image
        WHERE
          tb_image.id = ANY(
            SELECT
              deleted_image.image_id
            FROM
              deleted_image
          )
        `,
        [gallery.id],
      );
      // Delete gallery and avatar_image
      await pg.query(`DELETE FROM tb_image WHERE tb_image.id = $1`, [
        gallery.image_id,
      ]);
      await pg.query(`DELETE FROM tb_gallery WHERE tb_gallery.id = $1`, [
        gallery.id,
      ]);

      return {
        message: "Gallery succesfully deleted!",
        status: true,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async setPublicationType(
    query: AdminGalleryPhotoSetPublicationTypeRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { id, publication_type_id } = query;
      const { rows: tb_user_image } = await pg.query(
        `SELECT * FROM tb_user_image WHERE tb_user_image.id = $1`,
        [id],
      );
      const { rows: tb_publication_type } = await pg.query(
        `SELECT * FROM tb_publication_type WHERE tb_publication_type.id = $1`,
        [publication_type_id],
      );

      if (tb_user_image.length === 0 || tb_publication_type.length === 0) {
        return {
          status: false,
          message: "Gallery photo or publication type does not exist",
        };
      }
      const { rows: current_tb_publication_type } = await pg.query(
        `
        SELECT * FROM tb_user_image_publication_type
        WHERE
          tb_user_image_publication_type.user_image_id = $1
        `,
        [id],
      );
      if (current_tb_publication_type.length > 0) {
        await pg.query(
          `
          UPDATE
            tb_user_image_publication_type
          SET
            publication_type_id = $1
          WHERE
            tb_user_image_publication_type.user_image_id = $2
          `,
          [publication_type_id, id],
        );
      } else {
        await pg.query(
          `
          INSERT INTO tb_user_image_publication_type (user_image_id, publication_type_id) VALUES($1, $2)
          `,
          [id, publication_type_id],
        );
      }

      return {
        status: true,
        message: "Gellery photo publication type was set successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async getPublicationType(
    query: AdminGalleryPhotoGetPublicationTypeRequest,
  ): Promise<any> {
    const { id } = query;
    const { rows: tb_publication_type } = await pg.query(
      `SELECT tb_publication_type.*
      FROM
        tb_user_image_publication_type
        LEFT JOIN tb_publication_type ON tb_publication_type.id = tb_user_image_publication_type.publication_type_id
      WHERE
        tb_user_image_publication_type.user_image_id = $1`,
      [id],
    );

    return tb_publication_type.length > 0 ? tb_publication_type[0] : null;
  }
}
