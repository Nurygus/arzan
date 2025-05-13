import { AdminServiceDAO } from "../admin/service";
import pg from "@/config/db";
import { ApiServiceRequestBody } from "@/types/request/service-request";
import { ApiResponse } from "@/types/response";

export class ServiceRequestDAO {
  _adminServiceDAO = new AdminServiceDAO();
  post = async (
    body: ApiServiceRequestBody,
  ): Promise<ApiResponse<undefined>> => {
    try {
      const {
        count,
        service_id,
        user_auth_id,
        location_ids,
        active_time,
        month,
      } = body;

      for (let i = 0; i < location_ids.length; i++) {
        const { rows } = await pg.query(
          "SELECT EXISTS(SELECT 1 FROM tb_location WHERE id = $1)",
          [location_ids[i]],
        );
        if (!rows[0].exists) {
          return {
            status: false,
            message: "Location with given id doesn't exists!",
          };
        }
      }
      const response = await this._adminServiceDAO.get(service_id);

      if (!response.status || !response.data || response.data?.length == 0) {
        return {
          status: false,
          message: "Service with given id doesn't exists!",
        };
      }

      const service = response.data[0];
      let totalCost = service.cost || 0;
      if (service.month && !month) {
        return {
          status: false,
          message: "Month required!",
        };
      }

      if (service.count && !count) {
        return {
          status: false,
          message: "Count required!",
        };
      }
      if (service.month) {
        totalCost += (month || 0) * (service.month_cost || 0);
      }
      for (let i = 0; i < service.location_costs.length; i++) {
        const lCost = service.location_costs[i];
        if (location_ids.includes(lCost.location.id)) {
          totalCost +=
            (lCost.cost || 0) + (month || 0) * (lCost.month_cost || 0);
        }
      }

      if (service.count) {
        totalCost *= count || 0;
      }

      const { rows: balanceList } = await pg.query<any>(
        `SELECT
          tb_user_coin_balance.*
        FROM
          tb_user_coin_balance
        WHERE
          tb_user_coin_balance.user_auth_id = $1
        `,
        [user_auth_id],
      );

      if (balanceList.length == 0) {
        return {
          status: false,
          message: "Invalid user!",
        };
      }
      const balance = balanceList[0];
      if (balance.balance < totalCost) {
        return {
          status: false,
          message:
            "User does not have enough coins!. Coins required: " +
            totalCost.toString(),
        };
      }

      const { rows: serviceRequestList } = await pg.query<{ id: number }>(
        "INSERT INTO tb_user_service_request(service_id, user_auth_id, active_time) VALUES($1, $2, $3) RETURNING id",
        [service_id, user_auth_id, active_time],
      );

      const serviceRequestId = serviceRequestList[0].id;

      await pg.query<{ id: number }>(
        "INSERT INTO tb_user_service_request_location(user_service_request_id, location_id) SELECT $1, UNNEST($2::int[])",
        [serviceRequestId, location_ids],
      );

      if (count) {
        await pg.query(
          `
          UPDATE
            tb_user_service_request
          SET
            count = $2
          WHERE
            tb_user_service_request.id = $1
          `,
          [serviceRequestId, count],
        );
      }

      if (month) {
        await pg.query(
          `
          UPDATE
            tb_user_service_request
          SET
            month = $2
          WHERE
            tb_user_service_request.id = $1
          `,
          [serviceRequestId, month],
        );
      }

      return {
        status: true,
        message: "Service request created successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
      };
    }
  };
}
