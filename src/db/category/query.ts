import dotenv from "dotenv";
import pg from "@/config/db";
import { ApiResponse } from "@/types/response";
import { ApiCategoryResponse } from "@/types/response/category";

dotenv.config();

export class CategoryDB {
  async list(): Promise<ApiResponse<ApiCategoryResponse[]>> {
    try {
      const { rows: list } = await pg.query(
        `SELECT tb_post_category.id as id, tb_category.name as name, CONCAT('${process.env.STATIC_HOST}', tb_image.url) as image,
        json_agg(to_json(json_build_object('id', tb_post_sub_category.id, 'name', tb_sub_category.name))) FILTER (where tb_post_sub_category.id IS NOT NULL) sub_categories
        FROM tb_post_category
        JOIN tb_post_category_image ON tb_post_category_image.post_category_id = tb_post_category.id
        JOIN tb_image ON tb_image.id = tb_post_category_image.image_id
        LEFT JOIN tb_post_sub_category ON tb_post_sub_category.post_category_id = tb_post_category.id
        JOIN tb_category ON tb_category.id = tb_post_category.category_id
        LEFT JOIN tb_category as tb_sub_category ON tb_sub_category.id = tb_post_sub_category.category_id
        GROUP BY tb_post_category.id, tb_category.id, tb_image.id
        ORDER BY id`,
      );

      return {
        status: true,
        message: "Category List",
        data: list,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
}
