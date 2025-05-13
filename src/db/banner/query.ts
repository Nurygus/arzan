import dotenv from "dotenv";
import pg from "@/config/db";
import {
  UserBannerGetRequest,
  UserBannerListRequest,
} from "@/types/request/banner";

dotenv.config();

export class BannerDB {
  async get(body: UserBannerGetRequest): Promise<any> {
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

  async list(body: UserBannerListRequest): Promise<any[]> {
    const { platform, location, page_category, page } = body;
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
    const pageIdFilter = `${
      page
        ? `$4 IN (SELECT tb_page.id FROM tb_page
            LEFT JOIN tb_page_category ON tb_page_category.page_id = tb_page.id
            LEFT JOIN tb_banner_page_category ON tb_banner_page_category.page_category_id = tb_page_category.id
            WHERE tb_page_category.page_id = tb_page.id
            AND tb_banner_page_category.page_category_id = tb_page_category.id 
            AND tb_banner_page_category.banner_id = tb_banner.id)`
        : `$4`
    }`;
    const finalQuery = `WHERE ${pltfmIdFilter} AND ${locIdFilter} AND ${pageCategoryIdFilter} AND ${pageIdFilter}`;
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
      [
        platform || `TRUE`,
        location || `TRUE`,
        page_category || `TRUE`,
        page || `TRUE`,
      ],
    );
    return list;
  }
}
