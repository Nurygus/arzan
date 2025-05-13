import { LocationDB } from "./query";
import { ApiLocationResponse } from "@/types/response/location";

export class LocationDAO {
  private location: LocationDB;

  constructor() {
    this.location = new LocationDB();
  }

  list = async (): Promise<ApiLocationResponse[]> => {
    const list = await this.location.list();
    return list;
  };
}
