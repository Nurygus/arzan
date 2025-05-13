import path from "path";
import fs from "fs-extra";
import pg from "@/config/db";
import { AdminServiceRequest } from "@/types/request/admin/service";
import { ApiResponse } from "@/types/response";

export class AdminServiceDAO {
  post = async (
    body: AdminServiceRequest,
    image: string,
  ): Promise<ApiResponse<undefined>> => {
    try {
      const { name, cost, count, month, month_cost } = body;

      const { rows: serviceList } = await pg.query<{ id: number }>(
        "INSERT INTO tb_service(name, cost, count) VALUES($1, $2, $3) RETURNING id",
        [name, cost, count],
      );
      const { rows: imageList } = await pg.query<{ id: number }>(
        "INSERT INTO tb_image(url) VALUES($1) RETURNING id",
        [image],
      );

      const imageId = imageList[0].id;
      const serviceId = serviceList[0].id;

      await pg.query(
        "INSERT INTO tb_service_image(image_id, service_id) VALUES($1, $2)",
        [imageId, serviceId],
      );

      if (month) {
        await pg.query(
          `
          UPDATE
            tb_service
          SET
            month = $2
          WHERE
            tb_service.id = $1
          `,
          [serviceId, month],
        );
      }

      if (month_cost) {
        await pg.query(
          `
          UPDATE
            tb_service
          SET
            month_cost = $2
          WHERE
            tb_service.id = $1
          `,
          [serviceId, month_cost],
        );
      }

      return {
        status: true,
        message: "Service created successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  };

  put = async (
    id: number,
    body: AdminServiceRequest,
    image?: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const { name, cost, count, month, month_cost, location_costs } = body;

      await pg.query<{ id: number }>(
        "UPDATE tb_service SET name = $2, cost = $3, count = $4 WHERE id = $1",
        [id, name, cost, count],
      );

      if (month) {
        await pg.query(
          `
          UPDATE
            tb_service
          SET
            month = $2
          WHERE
            tb_service.id = $1
          `,
          [id, month],
        );
      }

      if (month_cost) {
        await pg.query(
          `
          UPDATE
            tb_service
          SET
            month_cost = $2
          WHERE
            tb_service.id = $1
          `,
          [id, month_cost],
        );
      }

      if (image) {
        const { rows: oldImageList } = await pg.query<{ url: string }>(
          `
          WITH
          deleted_service_image as (DELETE FROM tb_service_image WHERE tb_service_image.service_id = $1 RETURNING image_id)
          DELETE FROM tb_image WHERE tb_image.id = (SELECT deleted_service_image.image_id FROM deleted_service_image) RETURNING url
        `,
          [id],
        );

        if (oldImageList[0]) {
          const url = oldImageList[0].url;
          const filePath = path.resolve(url);
          await fs.unlink(filePath);
        }

        const { rows: imageList } = await pg.query<{ id: number }>(
          "INSERT INTO tb_image(url) VALUES($1) RETURNING id",
          [image],
        );

        const imageId = imageList[0].id;

        await pg.query(
          "INSERT INTO tb_service_image(image_id, service_id) VALUES($1, $2)",
          [imageId, id],
        );
      }

      if (location_costs) {
        for (let i = 0; i < location_costs.length; i++) {
          const elem = location_costs[i];
          const { rows: elemList } = await pg.query(
            `SELECT
              tb_service_location.service_id
            FROM
              tb_service_location
            WHERE
              tb_service_location.service_id = $1 AND tb_service_location.location_id = $2
            `,
            [id, elem.id],
          );
          if (elemList.length == 0) {
            return {
              status: false,
              message: "Service does not have this location",
            };
          }
          if (elem.cost) {
            await pg.query(
              `
              UPDATE
                tb_service_location
              SET
                cost = $3
              WHERE
                tb_service_location.service_id = $1 AND tb_service_location.location_id = $2
              `,
              [id, elem.id, elem.cost],
            );
          }
          if (elem.month_cost) {
            await pg.query(
              `
              UPDATE
                tb_service_location
              SET
                month_cost = $3
              WHERE
                tb_service_location.service_id = $1 AND tb_service_location.location_id = $2
              `,
              [id, elem.id, elem.month_cost],
            );
          }
        }
      }

      return {
        status: true,
        message: "Service updated successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  };

  list = async (): Promise<ApiResponse<any[]>> => {
    try {
      const { rows } = await pg.query(`
        SELECT
        tb_service.id as id,
        tb_service.name as name,
        tb_service.cost as cost,
        tb_service.count as count,
        tb_image.url as image
        FROM tb_service
        JOIN tb_service_image ON tb_service_image.service_id = tb_service.id
        JOIN tb_image ON tb_image.id = tb_service_image.image_id
      `);
      return {
        status: true,
        message: "Service list!",
        data: rows,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  };

  get = async (id: number): Promise<ApiResponse<any>> => {
    try {
      const { rows } = await pg.query(
        `
        WITH service AS (
          SELECT
            tb_service.id as id,
            tb_service.name as name,
            tb_service.cost as cost,
            tb_service.count as count,
            tb_image.url as image
          FROM tb_service
            JOIN tb_service_image ON tb_service_image.service_id = tb_service.id
            JOIN tb_image ON tb_image.id = tb_service_image.image_id
          WHERE
            tb_service.id = $1

        ), service_location AS (
          SELECT
            service.id as id,
            json_agg(
              jsonb_build_object(
                'location',
                ( 
                  SELECT
                    to_json(tb_location.*)
                  FROM
                    tb_location
                  WHERE
                    tb_location.id = tb_service_location.location_id
                  LIMIT 1
                ),
                'cost',
                tb_service_location.cost,
                'month_cost',
                tb_service_location.month_cost,
                'created_at',
                tb_service_location.created_at
              )
            ) as location_costs
          FROM
            service
            LEFT JOIN tb_service_location ON tb_service_location.service_id = service.id
          GROUP BY
            service.id
        )
        SELECT
          service.*,
          service_location.location_costs
        FROM
          service
          LEFT JOIN service_location ON service_location.id = service.id
      `,
        [id],
      );
      return {
        status: true,
        message: "Service!",
        data: rows,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  };

  delete = async (id: number): Promise<ApiResponse<undefined>> => {
    try {
      const { rows: imageList } = await pg.query(
        `
        WITH
          deleted_service as (DELETE FROM tb_service WHERE id = $1),
          deleted_service_image as (DELETE FROM tb_service_image WHERE tb_service_image.service_id = $1 RETURNING image_id)
          DELETE FROM tb_image WHERE tb_image.id = (SELECT deleted_service_image.image_id FROM deleted_service_image) RETURNING url
      `,
        [id],
      );

      if (imageList[0]) {
        const url = imageList[0].url;
        const filePath = path.resolve(url);
        await fs.unlink(filePath);
      }

      return {
        status: true,
        message: "Service deleted successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  };
}
