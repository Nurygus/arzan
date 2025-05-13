import pg from "@/config/db";
import {
  AdminPublicationTypeCreateRequest,
  AdminPublicationTypeGetRequest,
  AdminPublicationTypeListRequest,
} from "@/types/request/admin/publication-type";
import { ApiResponse } from "@/types/response";

export class PublicationTypeDB {
  async post(
    body: AdminPublicationTypeCreateRequest,
  ): Promise<ApiResponse<undefined>> {
    try {
      const { type, like_amount } = body;

      const { rows: tb_publication_type } = await pg.query(
        `INSERT INTO tb_publication_type(type) values($1) RETURNING *`,
        [type],
      );
      const publicationType = tb_publication_type[0];

      const { rows: tb_publication_type_like_amount } = await pg.query(
        `INSERT INTO tb_publication_type_like_amount(amount, publication_type_id) values($1, $2) RETURNING amount, created_at`,
        [like_amount || 0, publicationType.id],
      );
      publicationType.like_amount = tb_publication_type_like_amount[0];

      return {
        status: true,
        message: "Publication type created successfully",
        data: publicationType,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  }
  async get(query: AdminPublicationTypeGetRequest): Promise<any> {
    const { id } = query;
    const { rows: list } = await pg.query(
      `
      SELECT
        tb_publication_type.*,
        to_json(tb_publication_type_like_amount) as like_amount
      FROM
        tb_publication_type
        LEFT JOIN tb_publication_type_like_amount ON tb_publication_type_like_amount.publication_type_id = tb_publication_type.id
      WHERE
        tb_publication_type.id = $1
      `,
      [id],
    );

    return list.length > 0 ? list[0] : null;
  }

  async list(query: AdminPublicationTypeListRequest): Promise<any[]> {
    const { type } = query;
    const typeFilter = type ? `tb_publication_type.type = $1` : `$1`;
    const finalQuery = `WHERE ${typeFilter}`;
    const { rows: list } = await pg.query(
      `
      SELECT
        tb_publication_type.*,
        to_json(tb_publication_type_like_amount) as like_amount
      FROM
        tb_publication_type
        LEFT JOIN tb_publication_type_like_amount ON tb_publication_type_like_amount.publication_type_id = tb_publication_type.id
      ${finalQuery}
      `,
      [type || `TRUE`],
    );
    return list;
  }
}
