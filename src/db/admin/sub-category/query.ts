import dotenv from "dotenv";
import pg from "@/config/db";
import {
  AdminSubCategoryListRequest,
  AdminSubCategoryRequest,
} from "@/types/request/admin/sub-category";
import { ApiResponse } from "@/types/response";
import { AdminSubCategoryResponse } from "@/types/response/admin/sub-category";

dotenv.config();

export class SubCategoryDB {
  async insert(body: AdminSubCategoryRequest): Promise<ApiResponse<undefined>> {
    const { name, category_id: postCategoryId } = body;

    const { rows: postCategoryList } = await pg.query(
      "SELECT id FROM tb_post_category WHERE id = $1",
      [postCategoryId],
    );

    if (postCategoryList.length === 0) {
      return {
        status: false,
        message: "Category doesn't exists!",
      };
    }

    const { rows: categoryList } = await pg.query<{ id: number }>(
      "INSERT INTO tb_category(name) VALUES ($1) RETURNING id",
      [name],
    );

    const categoryId = categoryList[0].id;

    await pg.query(
      "INSERT INTO tb_post_sub_category(category_id, post_category_id) VALUES ($1, $2)",
      [categoryId, postCategoryId],
    );

    return {
      status: true,
      message: "Sub Category created successfully",
    };
  }

  async list(
    query: AdminSubCategoryListRequest,
  ): Promise<ApiResponse<AdminSubCategoryResponse[]>> {
    try {
      const { category_id } = query;
      const filter = `${category_id ? "WHERE " : ""}${
        category_id ? "tb_post_category.id = $1" : ""
      }`;
      const returnValues = [...Object.entries(query)].reduce(
        (acc: string[], curValue) => {
          if (curValue) {
            return [...acc, curValue[1]];
          }
          return acc;
        },
        [],
      );
      const { rows: list } = await pg.query<AdminSubCategoryResponse>(
        `SELECT tb_post_sub_category.id as id, tb_category.name as name,
        to_json(json_build_object('id', tb_post_category.id, 'name', tb_parent_category.name)) category
        FROM tb_post_sub_category
        INNER JOIN tb_category ON tb_category.id = tb_post_sub_category.category_id
        JOIN tb_post_category ON tb_post_category.id = tb_post_sub_category.post_category_id
        LEFT JOIN tb_category as tb_parent_category ON tb_parent_category.id = tb_post_category.category_id
        GROUP BY tb_post_sub_category.id, tb_category.name, tb_post_category.id, tb_parent_category.name
        ${filter}
    `,
        returnValues,
      );
      return {
        status: true,
        message: "Sub category list",
        data: list,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async get(id: string): Promise<ApiResponse<AdminSubCategoryResponse>> {
    try {
      const { rows: list } = await pg.query(
        `SELECT tb_post_sub_category.id as id, tb_category.name as name,
        to_json(json_build_object('id', tb_post_category.id, 'name', tb_parent_category.name)) category
        FROM tb_post_sub_category
        INNER JOIN tb_category ON tb_category.id = tb_post_sub_category.category_id
        JOIN tb_post_category ON tb_post_category.id = tb_post_sub_category.post_category_id
        LEFT JOIN tb_category as tb_parent_category ON tb_parent_category.id = tb_post_category.category_id
        WHERE tb_post_sub_category.id = $1
        GROUP BY tb_post_sub_category.id, tb_category.name, tb_post_category.id, tb_parent_category.name
        `,
        [id],
      );
      return {
        status: true,
        message: "Sub Category get",
        data: list[0],
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<undefined>> {
    try {
      const { rows: categoryList } = await pg.query<{ category_id: number }>(
        "SELECT category_id FROM tb_post_sub_category WHERE id = $1",
        [id],
      );

      const categoryId = categoryList[0].category_id;

      await pg.query("DELETE FROM tb_post_sub_category WHERE id = $1", [id]);

      await pg.query("DELETE FROM tb_category WHERE id = $1", [categoryId]);

      return {
        message: "Sub Category succesfully deleted!",
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
