import { PublicationTypeDB } from "./utils";
import {
  AdminPublicationTypeCreateRequest,
  AdminPublicationTypeGetRequest,
  AdminPublicationTypeListRequest,
} from "@/types/request/admin/publication-type";
import { ApiResponse } from "@/types/response";

export class AdminPublicationTypeDAO {
  private db: PublicationTypeDB;

  constructor() {
    this.db = new PublicationTypeDB();
  }
  create = async (
    body: AdminPublicationTypeCreateRequest,
  ): Promise<ApiResponse<undefined>> => {
    const result = await this.db.post(body);
    return result;
  };

  get = async (body: AdminPublicationTypeGetRequest): Promise<any> => {
    const result = await this.db.get(body);
    return result;
  };

  list = async (body: AdminPublicationTypeListRequest): Promise<any[]> => {
    const result = await this.db.list(body);
    return result;
  };
}
