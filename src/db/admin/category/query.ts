import dotenv from "dotenv";
import pg from "@/config/db";
import {
  AdminCategoryListRequest,
  AdminCategoryRequest,
} from "@/types/request/admin/category";
import { ApiResponse } from "@/types/response";
import { AdminCategoryResponse } from "@/types/response/admin/category";

dotenv.config();

export class CategoryDB {
  async insert(
    body: AdminCategoryRequest,
    image: string,
  ): Promise<ApiResponse<undefined>> {
    const { name } = body;
    const { rows: list } = await pg.query(
      "SELECT id from tb_category WHERE name = $1",
      [name],
    );
    if (list.length > 0) {
      return {
        status: false,
        message: "Category with this name exists!",
      };
    }
    const { rows: categoryList } = await pg.query<{ id: number }>(
      "INSERT INTO tb_category (name) VALUES($1) RETURNING id",
      [name],
    );
    const categoryId = categoryList[0].id;
    const { rows: postCategoryList } = await pg.query<{ id: number }>(
      "INSERT INTO tb_post_category (category_id) VALUES($1) RETURNING id",
      [categoryId],
    );
    const postCategoryId = postCategoryList[0].id;
    const { rows: imageList } = await pg.query<{ id: number }>(
      "INSERT INTO tb_image(url) VALUES($1) RETURNING id",
      [image],
    );
    const imageId = imageList[0].id;
    await pg.query(
      "INSERT INTO tb_post_category_image (post_category_id, image_id) VALUES($1, $2)",
      [postCategoryId, imageId],
    );
    return {
      status: true,
      message: "Category created successfully",
    };
  }

  async list(
    query: AdminCategoryListRequest,
  ): Promise<AdminCategoryResponse[]> {
    const { limit, offset } = query;
    const { rows: list } = await pg.query<AdminCategoryResponse>(
      `SELECT tb_post_category.id as id, CONCAT('${process.env.STATIC_HOST}', tb_image.url) as image, tb_category.name as name
      FROM tb_post_category
      JOIN tb_post_category_image ON tb_post_category_image.post_category_id = tb_post_category.id
      JOIN tb_image ON tb_post_category_image.image_id = tb_image.id
      JOIN tb_category ON tb_post_category.category_id = tb_category.id
      GROUP BY tb_post_category.id, tb_category.id, tb_image.id
      ORDER BY id
      LIMIT $1
      OFFSET $2`,
      [limit || 10, offset || 0],
    );
    return list;
  }

  async get(id: string): Promise<AdminCategoryResponse> {
    const { rows: list } = await pg.query<AdminCategoryResponse>(
      `SELECT tb_post_category.id as id, CONCAT('${process.env.STATIC_HOST}', tb_image.url) as image, tb_category.name as name
      FROM tb_post_category
      JOIN tb_post_category_image ON tb_post_category_image.post_category_id = tb_post_category.id
      JOIN tb_image ON tb_post_category_image.image_id = tb_image.id
      JOIN tb_category ON tb_post_category.category_id = tb_category.id
      WHERE tb_post_category.id = $1
      GROUP BY tb_post_category.id, tb_category.id, tb_image.id
      ORDER BY id`,
      [id],
    );
    return list[0];
  }

  async delete(id: string): Promise<ApiResponse<undefined>> {
    try {
      const { rows: subCategoryList } = await pg.query(
        "SELECT id FROM tb_post_sub_category WHERE post_category_id = $1",
        [id],
      );
      if (subCategoryList.length > 0) {
        return {
          message: "Delete sub categories of category to proceed",
          status: false,
        };
      }
      const { rows: postCategoryList } = await pg.query<{
        category_id: number;
      }>("SELECT category_id from tb_post_category WHERE id = $1", [id]);
      const { rows: postCategoryImageList } = await pg.query<{
        id: number;
        image_id: number;
      }>(
        "SELECT id, image_id from tb_post_category_image WHERE post_category_id = $1",
        [id],
      );
      const imageId = postCategoryImageList[0].image_id;
      const categoryId = postCategoryList[0].category_id;
      const postCategoryImageId = postCategoryImageList[0].id;
      await pg.query("DELETE FROM tb_post_category_image WHERE id = $1", [
        postCategoryImageId,
      ]);
      await pg.query("DELETE FROM tb_post_category WHERE id = $1", [id]);
      await pg.query("DELETE FROM tb_image WHERE id = $1", [imageId]);
      await pg.query("DELETE FROM tb_category WHERE id = $1", [categoryId]);

      return {
        message: "Category succesfully deleted!",
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
