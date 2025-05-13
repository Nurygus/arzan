import path from "path";
import fs from "fs-extra";
import pg from "@/config/db";

import {
  AdminPageCategoryCreateRequest,
  AdminPageCategoryGetRequest,
  AdminPageCategoryDeleteRequest,
  AdminPageCategoryListRequest,
  AdminPageListRequest,
  AdminCategoryListRequest,
  AdminPageCategoryEditRequest,
} from "@/types/request/admin/page-category";
import { ApiResponse } from "@/types/response";

export class PageCategoryDB {
  async insert(
    body: AdminPageCategoryCreateRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { page_id, category_name, image } = body;

      const { rows: list } = await pg.query(
        "SELECT * from tb_category WHERE name = $1",
        [category_name],
      );
      if (list.length === 0) {
        const { rows: list1 } = await pg.query(
          `INSERT INTO tb_category(name) values($1) RETURNING *`,
          [category_name],
        );
        list[0] = list1[0];
      }
      const category_id = list[0].id;
      if (image) {
        const { rows: image_list } = await pg.query(
          `INSERT INTO tb_image(url) values($1) RETURNING *`,
          [image],
        );
        const { rows: page_category_list } = await pg.query(
          `INSERT INTO tb_page_category(page_id, category_id, image_id) values($1, $2, $3) RETURNING *`,
          [page_id, category_id, image_list[0].id],
        );
        return {
          status: true,
          message: "Page category was created successfully",
          data: page_category_list[0],
        };
      }

      const { rows: page_category_list } = await pg.query(
        `INSERT INTO tb_page_category(page_id, category_id) values($1, $2) RETURNING *`,
        [page_id, category_id],
      );
      return {
        status: true,
        message: "Page category was created successfully",
        data: page_category_list[0],
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async edit(body: AdminPageCategoryEditRequest): Promise<ApiResponse<any>> {
    try {
      const { page_category_id, page_id, category_name, image } = body;

      const { rows: pageCategoryList } = await pg.query(
        "SELECT * from tb_page_category WHERE id = $1",
        [page_category_id],
      );
      if (pageCategoryList.length === 0) {
        return {
          status: false,
          message: "Page category does not exists!",
        };
      }

      if (page_id) {
        const { rows: pageList } = await pg.query(
          "SELECT * from tb_page WHERE id = $1",
          [page_id],
        );
        if (pageList.length === 0) {
          return {
            status: false,
            message: "Page does not exists!",
          };
        }

        await pg.query(
          `
          UPDATE
            tb_page_category
          SET
            page_id = $2
          WHERE
            tb_page_category.id = $1
          `,
          [page_category_id, page_id],
        );
      }

      if (category_name) {
        const { rows: categoryList } = await pg.query(
          "SELECT * from tb_category WHERE name = $1",
          [category_name],
        );
        if (categoryList.length === 0) {
          const { rows: list1 } = await pg.query(
            `INSERT INTO tb_category(name) values($1) RETURNING *`,
            [category_name],
          );
          categoryList[0] = list1[0];
        }

        const category_id = categoryList[0].id;
        await pg.query(
          `
          UPDATE
            tb_page_category
          SET
            category_id = $2
          WHERE
            tb_page_category.id = $1
          `,
          [page_category_id, category_id],
        );
      }

      if (image) {
        const { rows: image_list } = await pg.query(
          `INSERT INTO tb_image(url) values($1) RETURNING *`,
          [image],
        );

        await pg.query(
          `
          UPDATE
            tb_page_category
          SET
            image_id = $2
          WHERE
            tb_page_category.id = $1
          `,
          [page_category_id, image_list[0].id],
        );
        const { rows: oldImageList } = await pg.query(
          "DELETE from tb_image WHERE tb_image.id = $1 RETURNING *",
          [pageCategoryList[0].image_id],
        );

        oldImageList.map(async (elem) => {
          const filepath = path.resolve(elem.url);
          await fs.unlink(filepath);
        });
      }

      return {
        status: true,
        message: "Page category was edited successfully",
        data: await this.get({
          id: page_category_id,
        } as unknown as AdminPageCategoryGetRequest),
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async get(query: AdminPageCategoryGetRequest): Promise<any> {
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

  async delete(
    query: AdminPageCategoryDeleteRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { id } = query;
      const { rows: list } = await pg.query(
        `DELETE FROM tb_page_category WHERE tb_page_category.id = $1 RETURNING *`,
        [id],
      );
      return {
        status: true,
        message: "Video category deleted successfully",
        data: list[0],
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async list(query: AdminPageCategoryListRequest): Promise<any[]> {
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

  async listPage(query: AdminPageListRequest): Promise<any[]> {
    const {} = query;
    const { rows: list } = await pg.query(`SELECT * FROM tb_page`);
    return list;
  }

  async listCategory(query: AdminCategoryListRequest): Promise<any[]> {
    const {} = query;
    const { rows: list } = await pg.query(`SELECT * FROM tb_category`);
    return list;
  }
}
