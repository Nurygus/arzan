import path from "path";
import fs from "fs-extra";
import pg from "@/config/db";
import {
  AdminBannerCreateRequest,
  AdminBannerDeleteRequest,
  AdminBannerEditRequest,
  AdminBannerGetRequest,
  AdminBannerListRequest,
} from "@/types/request/admin/banner";
import type { AdminBannerData } from "@/types/admin/banner";
import type { AdminImageData } from "@/types/admin/image";
import { ApiResponse } from "@/types/response";

export class AdminBannerDB {
  async insert(
    body: AdminBannerCreateRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const {
        title,
        description,
        url,
        image,
        start_date,
        end_date,
        platform_id,
        page_category_ids,
        location_ids,
      } = body;
      const { rows: banner_list } = await pg.query<AdminBannerData>(
        `INSERT INTO tb_banner (title, description, url, start_date, end_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
        [title, description, url, start_date, end_date],
      );
      const adminBannerData = banner_list[0];
      const { rows: image_list } = await pg.query<AdminImageData>(
        `INSERT INTO tb_image (url) VALUES ($1) RETURNING *`,
        [image],
      );
      const adminImageData = image_list[0];
      await pg.query(
        `INSERT INTO tb_banner_image (banner_id, image_id) VALUES ($1, $2)`,
        [adminBannerData.id, adminImageData.id],
      );
      await pg.query(
        `INSERT INTO tb_banner_platform (banner_id, platform_id) VALUES ($1, $2)`,
        [adminBannerData.id, platform_id],
      );
      page_category_ids.map(async (item) => {
        await pg.query(
          `INSERT INTO tb_banner_page_category(banner_id, page_category_id) VALUES ($1, $2);`,
          [adminBannerData.id, item],
        );
      });
      location_ids.map(async (item) => {
        await pg.query(
          `INSERT INTO tb_banner_location(banner_id, location_id) values($1, $2);`,
          [adminBannerData.id, item],
        );
      });
      return {
        status: true,
        message: "Banner created successfully",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async edit(body: AdminBannerEditRequest): Promise<ApiResponse<any>> {
    try {
      const {
        id,
        title,
        description,
        url,
        image,
        start_date,
        end_date,
        platform_id,
        page_category_ids,
        location_ids,
      } = body;

      const { rows: bannerList } = await pg.query(
        `SELECT * FROM tb_banner WHERE tb_banner.id = $1`,
        [id],
      );
      if (bannerList.length === 0) {
        return {
          status: false,
          message: "Wrong id!",
        };
      }

      if (title) {
        await pg.query(
          `
          UPDATE
            tb_banner
          SET
            title = $2
          WHERE
            tb_banner.id = $1
          `,
          [id, title],
        );
      }

      if (description) {
        await pg.query(
          `
          UPDATE
            tb_banner
          SET
            description = $2
          WHERE
            tb_banner.id = $1
          `,
          [id, description],
        );
      }

      if (url) {
        await pg.query(
          `
          UPDATE
            tb_banner
          SET
            url = $2
          WHERE
            tb_banner.id = $1
          `,
          [id, url],
        );
      }

      if (start_date) {
        await pg.query(
          `
          UPDATE
            tb_banner
          SET
            start_date = $2
          WHERE
            tb_banner.id = $1
          `,
          [id, start_date],
        );
      }

      if (end_date) {
        await pg.query(
          `
          UPDATE
            tb_banner
          SET
            end_date = $2
          WHERE
            tb_banner.id = $1
          `,
          [id, end_date],
        );
      }

      if (image) {
        const { rows: oldImageList } = await pg.query(
          `
          WITH x AS (
            DELETE FROM
              tb_banner_image
            WHERE
              tb_banner_image.banner_id = $1
            RETURNING *
          )
          DELETE FROM
            tb_image
          WHERE
            tb_image.id = ANY(SELECT x.image_id FROM x)
          RETURNING *
          `,
          [id],
        );
        oldImageList.map(async (elem) => {
          const filepath = path.resolve(elem.url);
          await fs.unlink(filepath);
        });
        await pg.query(
          `
          WITH x as (
            INSERT INTO tb_image (url) values($2) RETURNING *
          )
          INSERT INTO tb_banner_image(banner_id, image_id) SELECT $1, x.id FROM x
          `,
          [id, image],
        );
      }

      if (page_category_ids) {
        const { rows: pageCategoryList } = await pg.query(
          "SELECT * from tb_page_category WHERE tb_page_category.id = ANY(SELECT unnest(ARRAY[$1::int[]]))",
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
              tb_banner_page_category
            WHERE
              tb_banner_page_category.banner_id = $1
          )
          INSERT INTO tb_banner_page_category(banner_id, page_category_id) SELECT $1, unnest(ARRAY[$2::int[]])
          `,
          [id, page_category_ids],
        );
      }

      if (location_ids) {
        const { rows: locationList } = await pg.query(
          "SELECT * from tb_location WHERE tb_location.id = ANY(SELECT unnest(ARRAY[$1::int[]]))",
          [location_ids],
        );
        if (locationList.length != location_ids.length) {
          return {
            status: false,
            message: "Locations does not exists!",
          };
        }
        await pg.query(
          `
          WITH x as (
            DELETE FROM
              tb_banner_location
            WHERE
              tb_banner_location.banner_id = $1
          )
          INSERT INTO tb_banner_location(banner_id, location_id) SELECT $1, unnest(ARRAY[$2::int[]])
          `,
          [id, location_ids],
        );
      }

      if (platform_id) {
        const { rows: platformList } = await pg.query(
          `SELECT * FROM tb_platform WHERE tb_platform.id = $1`,
          [platform_id],
        );
        if (platformList.length === 0) {
          return {
            status: false,
            message: "Wrong platform!",
          };
        }
        await pg.query<AdminImageData>(
          `WITH x AS (
            DELETE FROM tb_banner_platform WHERE tb_banner_platform.banner_id = $1
          )
          INSERT INTO tb_banner_platform (banner_id, platform_id) VALUES ($1, $2)`,
          [id, platform_id],
        );
      }

      return {
        status: true,
        message: "Banner edited successfully",
        data: await this.get({
          id: id,
        } as unknown as AdminBannerGetRequest),
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async get(body: AdminBannerGetRequest): Promise<any> {
    const { id } = body;
    const { rows: list } = await pg.query(
      `
      SELECT
        tb_banner.id,
        tb_banner.title,
        tb_banner.description,
        tb_banner.url as url,
        tb_banner.start_date,
        tb_banner.end_date,
        tb_banner.created_at,
        jsonb_build_object('url', tb_image.url) as image,
        json_agg(DISTINCT (tb_platform)) as platform,
        json_agg(DISTINCT (tb_location)) as location,
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
        ) as page_category
      FROM
        tb_banner
        LEFT JOIN tb_banner_platform ON tb_banner_platform.banner_id = tb_banner.id
        LEFT JOIN tb_platform ON tb_platform.id = tb_banner_platform.platform_id
        LEFT JOIN tb_banner_location ON tb_banner_location.banner_id = tb_banner.id
        LEFT JOIN tb_location ON tb_location.id = tb_banner_location.location_id
        LEFT JOIN tb_banner_image ON tb_banner_image.banner_id = tb_banner.id
        LEFT JOIN tb_image ON tb_image.id = tb_banner_image.image_id
        LEFT JOIN tb_banner_page_category ON tb_banner_page_category.banner_id = tb_banner.id
        LEFT JOIN tb_page_category ON tb_page_category.id = tb_banner_page_category.page_category_id
        LEFT JOIN tb_page ON tb_page.id = tb_page_category.page_id
        LEFT JOIN tb_category ON tb_category.id = tb_page_category.category_id
        LEFT JOIN tb_image as page_category_tb_image ON page_category_tb_image.id = tb_page_category.image_id
      WHERE
        tb_banner.id = $1
      GROUP BY
        tb_banner.id,
        tb_image.id
      `,
      [id],
    );
    return list.length > 0 ? list[0] : null;
  }

  async list(body: AdminBannerListRequest): Promise<any[]> {
    const { platform, location, page_category } = body;
    const pltfmIdFilter = `${
      platform ? `tb_banner_platform.platform_id = $1` : `$1`
    }`;
    const locIdFilter = `${
      location
        ? `$2 IN (SELECT tb_banner_location.location_id FROM tb_banner_location WHERE tb_banner_location.banner_id = tb_banner.id)`
        : `$2`
    }`;

    const pageCategoryIdFilter = `${
      page_category
        ? `$3 IN (SELECT tb_banner_page_category.page_category_id FROM tb_banner_page_category WHERE tb_banner_page_category.banner_id = tb_banner.id)`
        : `$3`
    }`;
    const finalQuery = `WHERE ${pltfmIdFilter} AND ${locIdFilter} AND ${pageCategoryIdFilter}`;
    const { rows: list } = await pg.query(
      `
      SELECT
        tb_banner.id,
        tb_banner.title,
        tb_banner.description,
        tb_banner.url as url,
        tb_banner.start_date,
        tb_banner.end_date,
        tb_banner.created_at,
        jsonb_build_object('url', tb_image.url) as image,
        json_agg(DISTINCT (tb_platform)) as platform,
        json_agg(DISTINCT (tb_location)) as location,
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
        ) as page_category
      FROM
        tb_banner
        LEFT JOIN tb_banner_platform ON tb_banner_platform.banner_id = tb_banner.id
        LEFT JOIN tb_platform ON tb_platform.id = tb_banner_platform.platform_id
        LEFT JOIN tb_banner_location ON tb_banner_location.banner_id = tb_banner.id
        LEFT JOIN tb_location ON tb_location.id = tb_banner_location.location_id
        LEFT JOIN tb_banner_image ON tb_banner_image.banner_id = tb_banner.id
        LEFT JOIN tb_image ON tb_image.id = tb_banner_image.image_id
        LEFT JOIN tb_banner_page_category ON tb_banner_page_category.banner_id = tb_banner.id
        LEFT JOIN tb_page_category ON tb_page_category.id = tb_banner_page_category.page_category_id
        LEFT JOIN tb_page ON tb_page.id = tb_page_category.page_id
        LEFT JOIN tb_category ON tb_category.id = tb_page_category.category_id
        LEFT JOIN tb_image as page_category_tb_image ON page_category_tb_image.id = tb_page_category.image_id
      ${finalQuery}
      GROUP BY
        tb_banner.id,
        tb_image.id
      `,
      [platform || `TRUE`, location || `TRUE`, page_category || `TRUE`],
    );
    return list;
  }

  async delete(
    body: AdminBannerDeleteRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { id } = body;
      const { rows: bannerList } = await pg.query(
        `SELECT * FROM tb_banner WHERE tb_banner.id = $1`,
        [id],
      );
      if (bannerList.length === 0) {
        return {
          status: false,
          message: "banner does not exist",
        };
      }
      // TODO: delete image from /static
      const { rows: banner_image_list } = await pg.query(
        `DELETE FROM tb_banner_image WHERE tb_banner_image.banner_id = $1 RETURNING *`,
        [id],
      );
      if (banner_image_list.length === 0) {
        return {
          status: false,
          message: "banner image does not exist",
        };
      }
      const imageId = banner_image_list[0].image_id;
      if (imageId) {
        await pg.query(`DELETE FROM tb_image WHERE tb_image.id = $1`, [
          imageId,
        ]);
      }
      await pg.query(
        `DELETE FROM tb_banner_platform WHERE tb_banner_platform.banner_id = $1`,
        [id],
      );
      await pg.query(
        `DELETE FROM tb_banner_page_category WHERE tb_banner_page_category.banner_id = $1`,
        [id],
      );
      await pg.query(
        `DELETE FROM tb_banner_location WHERE tb_banner_location.banner_id = $1`,
        [id],
      );
      await pg.query(`DELETE FROM tb_banner WHERE tb_banner.id = $1`, [id]);

      return {
        message: "Banner succesfully deleted!",
        status: true,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
}
