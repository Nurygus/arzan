import pg from "@/config/db";
import {
  UserPageCategoryGetRequest,
  UserPageCategoryListRequest,
} from "@/types/request/page-category";

export class PageCategoryDB {
  async get(query: UserPageCategoryGetRequest): Promise<any> {
    const { id } = query;
    const { rows: list } = await pg.query(
      `
      SELECT
        tb_page_category.id as id,
        to_json(tb_page) as page,
        to_json(tb_category) as category,
        jsonb_build_object('url', tb_image.url) as image,
        jsonb_build_object(
          'video_count', CAST(COALESCE(tb_page_category_statistic.video_count, '0') AS INTEGER),
          'gallery_count', CAST(COALESCE(tb_page_category_statistic.gallery_count, '0') AS INTEGER)
        ) as statistics
      FROM
        tb_page_category
        LEFT JOIN tb_page ON tb_page.id = tb_page_category.page_id
        LEFT JOIN tb_category ON tb_category.id = tb_page_category.category_id
        LEFT JOIN tb_image ON tb_image.id = tb_page_category.image_id
        LEFT JOIN tb_page_category_statistic ON tb_page_category_statistic.page_category_id = tb_page_category.id
      WHERE
        tb_page_category.id = $1
      `,
      [id],
    );
    return list[0];
  }

  async list(query: UserPageCategoryListRequest): Promise<any[]> {
    const { page_id } = query;
    const pageIdFilter = page_id ? `tb_page_category.page_id = $1` : `$1`;
    const finalQuery = `WHERE ${pageIdFilter}`;
    const { rows: list } = await pg.query(
      `
      SELECT
        tb_page_category.id as id,
        to_json(tb_page) as page,
        to_json(tb_category) as category,
        jsonb_build_object('url', tb_image.url) as image,
        jsonb_build_object(
          'video_count', CAST(COALESCE(tb_page_category_statistic.video_count, '0') AS INTEGER),
          'gallery_count', CAST(COALESCE(tb_page_category_statistic.gallery_count, '0') AS INTEGER)
        ) as statistics
      FROM
        tb_page_category
        LEFT JOIN tb_page ON tb_page.id = tb_page_category.page_id
        LEFT JOIN tb_category ON tb_category.id = tb_page_category.category_id
        LEFT JOIN tb_image ON tb_image.id = tb_page_category.image_id
        LEFT JOIN tb_page_category_statistic ON tb_page_category_statistic.page_category_id = tb_page_category.id
      ${finalQuery}
      `,
      [page_id || `TRUE`],
    );
    return list;
  }
}
